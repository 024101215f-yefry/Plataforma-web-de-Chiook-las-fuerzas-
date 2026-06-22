import { DatabaseSync } from 'node:sqlite';
import { writeFileSync, existsSync, createWriteStream } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { get } from 'node:https';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DB_URL = 'https://github.com/lerocha/chinook-database/raw/master/ChinookDatabase/DataSources/Chinook_Sqlite.sqlite';
const DB_PATH = join(__dirname, '..', 'chinook.sqlite');
const OUTPUT_PATH = join(__dirname, '..', 'src', 'chinook-data.json');

await downloadIfMissing(DB_URL, DB_PATH);

const db = new DatabaseSync(DB_PATH);

const artists = db.prepare('SELECT ArtistId as id, Name as name FROM Artist ORDER BY ArtistId').all();
const genres = db.prepare('SELECT GenreId as id, Name as name FROM Genre ORDER BY GenreId').all();

const albumRows = db.prepare(`SELECT a.AlbumId as id, a.Title as name, a.ArtistId as artistId, ar.Name as artistName FROM Album a JOIN Artist ar ON a.ArtistId = ar.ArtistId ORDER BY a.AlbumId`).all();

const trackRows = db.prepare(`SELECT t.TrackId as id, t.Name as name, t.Composer as composer, t.Milliseconds as milliseconds, t.UnitPrice as unitPrice, t.AlbumId as albumId, t.GenreId as genreId, t.MediaTypeId as mediaTypeId, g.Name as genre, mt.Name as mediaType FROM Track t LEFT JOIN Genre g ON t.GenreId = g.GenreId LEFT JOIN MediaType mt ON t.MediaTypeId = mt.MediaTypeId ORDER BY t.TrackId`).all();

const customerRows = db.prepare(`SELECT c.CustomerId as id, c.FirstName as firstName, c.LastName as lastName, c.Email as email, c.Company as company, c.Country as country, c.Phone as phone, c.SupportRepId as supportRepId FROM Customer c ORDER BY c.CustomerId`).all();

const employeeRows = db.prepare(`SELECT e.EmployeeId as id, e.FirstName as firstName, e.LastName as lastName, e.Title as title, e.ReportsTo as reportsTo, e.HireDate as hireDate, e.Email as email FROM Employee e ORDER BY e.EmployeeId`).all();

const invoiceRows = db.prepare(`SELECT i.InvoiceId as id, i.InvoiceDate as invoiceDate, i.BillingCity as billingCity, i.BillingCountry as billingCountry, i.Total as total, i.CustomerId FROM Invoice i ORDER BY i.InvoiceId`).all();

const invoiceLineRows = db.prepare(`SELECT il.InvoiceLineId as id, il.InvoiceId as invoiceId, il.TrackId as trackId, il.UnitPrice as unitPrice, il.Quantity as quantity, t.Name as trackName FROM InvoiceLine il JOIN Track t ON il.TrackId = t.TrackId ORDER BY il.InvoiceLineId`).all();

const playlistRows = db.prepare(`SELECT p.PlaylistId as id, p.Name as name FROM Playlist p ORDER BY p.PlaylistId`).all();
const playlistTrackRows = db.prepare(`SELECT pt.PlaylistId as playlistId, pt.TrackId as trackId FROM PlaylistTrack pt`).all();

// Build albums
const images = [
  "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=300&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1549417229-aa67d3263c09?w=300&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&auto=format&fit=crop&q=60"
];

const trackCountPerAlbum = {};
const genrePerAlbum = {};
for (const t of trackRows) {
  trackCountPerAlbum[t.albumId] = (trackCountPerAlbum[t.albumId] || 0) + 1;
  if (!genrePerAlbum[t.albumId]) genrePerAlbum[t.albumId] = t.genre || 'Varios';
}

const albums = albumRows.map(a => ({
  id: a.id,
  name: a.name,
  artistName: a.artistName || 'Unknown',
  coverUrl: images[a.id % images.length],
  genre: genrePerAlbum[a.id] || 'Varios',
  releaseYear: 2000 + (a.id % 24),
  tracksCount: trackCountPerAlbum[a.id] || 0,
  price: Number((3.99 + (a.id % 5) * 0.99).toFixed(2))
}));

const formatMs = (ms) => {
  const totalSecs = Math.floor(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const tracks = trackRows.map(t => ({
  id: t.id, name: t.name, composer: t.composer || 'Unknown',
  duration: formatMs(t.milliseconds), mediaType: t.mediaType || 'MPEG audio file',
  unitPrice: Number(t.unitPrice), genre: t.genre || 'General', albumId: t.albumId || 0
}));

const clients = customerRows.map(c => ({
  id: c.id, firstName: c.firstName, lastName: c.lastName, email: c.email,
  company: c.company || 'Personal', country: c.country || 'Unknown',
  phone: c.phone || 'S/N', supportRepId: c.supportRepId || 0
}));

const employees = employeeRows.map(e => ({
  id: e.id, firstName: e.firstName, lastName: e.lastName, title: e.title || 'Employee',
  reportsToId: e.reportsTo || undefined, hireDate: e.hireDate ? new Date(e.hireDate).toISOString().split('T')[0] : '2020-01-01',
  email: e.email || '', clientsCount: 0,
  avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${e.firstName}`
}));

// Invoices - limit to recent 100 for performance
const linesByInvoice = {};
for (const l of invoiceLineRows) {
  if (!linesByInvoice[l.invoiceId]) linesByInvoice[l.invoiceId] = [];
  linesByInvoice[l.invoiceId].push({ id: l.id, trackName: l.trackName, unitPrice: Number(l.unitPrice), quantity: l.quantity });
}

const invoices = invoiceRows.slice(0, 100).map(i => ({
  id: `INV-00${i.id}`, invoiceDate: new Date(i.invoiceDate).toISOString().split('T')[0],
  billingCity: i.billingCity || 'Unknown', billingCountry: i.billingCountry || 'Unknown',
  total: Number(i.total), lines: linesByInvoice[i.id] || []
}));

const tracksByPlaylist = {};
for (const pt of playlistTrackRows) {
  if (!tracksByPlaylist[pt.playlistId]) tracksByPlaylist[pt.playlistId] = [];
  tracksByPlaylist[pt.playlistId].push(pt.trackId);
}

const playlists = playlistRows.map(p => ({ id: p.id, name: p.name, trackCount: (tracksByPlaylist[p.id] || []).length }));

const playlistTracksMap = {};
for (const [plId, trIds] of Object.entries(tracksByPlaylist)) {
  playlistTracksMap[plId] = trIds;
}

const data = { artists, genres, albums, tracks, clients, employees, invoices, playlists, playlistTracksMap };
writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));
console.log(`Generated ${OUTPUT_PATH}`);
console.log(`  Artists: ${artists.length}`);
console.log(`  Genres: ${genres.length}`);
console.log(`  Albums: ${albums.length}`);
console.log(`  Tracks: ${tracks.length}`);
console.log(`  Clients: ${clients.length}`);
console.log(`  Employees: ${employees.length}`);
console.log(`  Invoices: ${invoices.length}`);
console.log(`  Playlists: ${playlists.length}`);

async function downloadIfMissing(url, dest) {
  if (existsSync(dest)) { console.log('DB already cached'); return; }
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => { file.close(); reject(err); });
  });
}
