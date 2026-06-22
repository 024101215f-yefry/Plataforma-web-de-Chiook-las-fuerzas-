import express from "express";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { 
  INITIAL_ALBUMS, INITIAL_TRACKS, INITIAL_CLIENTS, INITIAL_EMPLOYEES,
  INITIAL_INVOICES, INITIAL_PLAYLISTS, PLAYLIST_TRACKS_MAP,
  INITIAL_ARTISTS, INITIAL_GENRES
} from "../src/data";

const app = express();
app.use(express.json());

// Lazy-initialized Prisma Client
let prisma: PrismaClient | null = null;
let isDbConnected = !!process.env.DATABASE_URL;

function getPrisma(): PrismaClient {
  if (!prisma) { prisma = new PrismaClient(); }
  return prisma;
}

// In-memory clones
let mockAlbums = [...INITIAL_ALBUMS];
let mockTracks = [...INITIAL_TRACKS];
let mockClients = [...INITIAL_CLIENTS];
let mockEmployees = [...INITIAL_EMPLOYEES];
let mockInvoices = [...INITIAL_INVOICES];
let mockPlaylists = [...INITIAL_PLAYLISTS];
let mockPlaylistTracksMap = { ...PLAYLIST_TRACKS_MAP };
let mockArtists = [...INITIAL_ARTISTS];
let mockGenres = [...INITIAL_GENRES];

function formatMilliseconds(ms: number) {
  const totalSecs = Math.floor(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function getAlbumMetadata(id: number, title: string) {
  const norm = title.toLowerCase();
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
  return {
    coverUrl: images[id % images.length], genre: norm.includes("rock")?"Rock":norm.includes("jazz")?"Jazz":norm.includes("metal")?"Metal":norm.includes("classical")?"Classical":"Varios",
    releaseYear: 2025 - (id % 30), price: 3.99 + (id % 5)
  };
}

// Probe DB connection on boot
if (process.env.DATABASE_URL) {
  getPrisma().$connect()
    .then(() => { isDbConnected = true; console.log("[API] DB connected"); })
    .catch(() => { isDbConnected = false; console.log("[API] DB failed, using mock"); });
}

// Middleware
app.use((req, res, next) => {
  if (process.env.DATABASE_URL && prisma) isDbConnected = true;
  next();
});

// DB Status
app.get("/api/db-status", (req, res) => {
  res.json({ connected: isDbConnected, mode: isDbConnected ? "production-neon" : "sandbox-mock", dbUrlConfigured: !!process.env.DATABASE_URL, localTime: new Date().toISOString() });
});

// Artists
app.get("/api/artists", async (req, res) => {
  if (isDbConnected) {
    try {
      const dbArtists = await getPrisma().artist.findMany({ take: 300, orderBy: { name: "asc" } });
      return res.json(dbArtists.map(a => ({ id: a.artist_id, name: a.name || "Unknown" })));
    } catch (e: any) { console.warn("[API] artists query failed", e.message); }
  }
  res.json(mockArtists);
});

// Genres
app.get("/api/genres", async (req, res) => {
  if (isDbConnected) {
    try {
      const dbGenres = await getPrisma().genre.findMany({ orderBy: { name: "asc" } });
      return res.json(dbGenres.map(g => ({ id: g.genre_id, name: g.name || "General" })));
    } catch (e: any) { console.warn("[API] genres query failed", e.message); }
  }
  res.json(mockGenres);
});

// Albums
app.get("/api/albums", async (req, res) => {
  if (isDbConnected) {
    try {
      const dbAlbums = await getPrisma().album.findMany({ take: 300, include: { artist: true, track: { select: { track_id: true } } }, orderBy: { title: "asc" } });
      return res.json(dbAlbums.map(al => {
        const meta = getAlbumMetadata(al.album_id, al.title);
        return { id: al.album_id, name: al.title, artistName: al.artist?.name || "Unknown", coverUrl: meta.coverUrl, genre: meta.genre, releaseYear: meta.releaseYear, tracksCount: al.track.length, price: Number(meta.price) };
      }));
    } catch (e: any) { console.warn("[API] albums query failed", e.message); }
  }
  res.json(mockAlbums);
});

// Tracks
app.get("/api/tracks", async (req, res) => {
  if (isDbConnected) {
    try {
      const dbTracks = await getPrisma().track.findMany({ take: 300, include: { album: { include: { artist: true } }, genre: true, media_type: true } });
      return res.json(dbTracks.map(t => ({ id: t.track_id, name: t.name, composer: t.composer || "Unknown", duration: formatMilliseconds(t.milliseconds), mediaType: t.media_type?.name || "Audio", unitPrice: Number(t.unit_price), genre: t.genre?.name || "General", albumId: t.album_id || 0 })));
    } catch (e: any) { console.warn("[API] tracks query failed", e.message); }
  }
  res.json(mockTracks);
});

// Clients
app.get("/api/clients", async (req, res) => {
  if (isDbConnected) {
    try {
      const dbClients = await getPrisma().customer.findMany({ orderBy: { last_name: "asc" } });
      return res.json(dbClients.map(c => ({ id: c.customer_id, firstName: c.first_name, lastName: c.last_name, email: c.email, company: c.company || "Personal", country: c.country || "Perú", phone: c.phone || "S/N", supportRepId: c.support_rep_id || 0 })));
    } catch (e: any) { console.warn("[API] clients query failed", e.message); }
  }
  res.json(mockClients);
});

app.post("/api/clients", async (req, res) => {
  const { firstName, lastName, email, company, country, phone, supportRepId } = req.body;
  if (isDbConnected) {
    try {
      const db = getPrisma();
      const maxId = await db.customer.aggregate({ _max: { customer_id: true } });
      const nextId = (maxId._max.customer_id || 0) + 1;
      const nc = await db.customer.create({ data: { customer_id: nextId, first_name: firstName, last_name: lastName, email, company: company || "", country: country || "Perú", phone: phone || "", support_rep_id: supportRepId || null } });
      return res.json({ id: nc.customer_id, firstName: nc.first_name, lastName: nc.last_name, email: nc.email, company: nc.company || "", country: nc.country || "", phone: nc.phone || "", supportRepId: nc.support_rep_id || 0 });
    } catch (e: any) { console.warn("[API] create client failed", e.message); }
  }
  const nextId = mockClients.reduce((max, c) => c.id > max ? c.id : max, 0) + 1;
  const created = { id: nextId, firstName, lastName, email, company, country, phone, supportRepId };
  mockClients.push(created);
  res.json(created);
});

app.put("/api/clients/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { firstName, lastName, email, company, country, phone, supportRepId } = req.body;
  if (isDbConnected) {
    try {
      const upd = await getPrisma().customer.update({ where: { customer_id: id }, data: { first_name: firstName, last_name: lastName, email, company, country, phone, support_rep_id: supportRepId || null } });
      return res.json({ id: upd.customer_id, firstName: upd.first_name, lastName: upd.last_name, email: upd.email, company: upd.company || "", country: upd.country || "", phone: upd.phone || "", supportRepId: upd.support_rep_id || 0 });
    } catch (e: any) { console.warn("[API] update client failed", e.message); }
  }
  mockClients = mockClients.map(c => c.id === id ? { ...c, firstName, lastName, email, company, country, phone, supportRepId } : c);
  res.json({ id, firstName, lastName, email, company, country, phone, supportRepId });
});

app.delete("/api/clients/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isDbConnected) {
    try { await getPrisma().customer.delete({ where: { customer_id: id } }); return res.json({ success: true }); }
    catch (e: any) { console.warn("[API] delete client failed", e.message); }
  }
  mockClients = mockClients.filter(c => c.id !== id);
  res.json({ success: true });
});

// Employees
app.get("/api/employees", async (req, res) => {
  if (isDbConnected) {
    try {
      const dbEmps = await getPrisma().employee.findMany({ include: { employee: true, customer: true }, orderBy: { last_name: "asc" } });
      return res.json(dbEmps.map(e => ({ id: e.employee_id, firstName: e.first_name, lastName: e.last_name, title: e.title || "Agente", reportsToId: e.reports_to || undefined, reportsToName: e.employee ? `${e.employee.first_name} ${e.employee.last_name}` : undefined, hireDate: e.hire_date ? e.hire_date.toISOString().split("T")[0] : "2024-01-01", email: e.email || "", clientsCount: e.customer ? e.customer.length : 0, avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${e.first_name}` })));
    } catch (e: any) { console.warn("[API] employees query failed", e.message); }
  }
  res.json(mockEmployees);
});

// Invoices
app.get("/api/invoices", async (req, res) => {
  if (isDbConnected) {
    try {
      const dbInvs = await getPrisma().invoice.findMany({ include: { invoice_line: { include: { track: true } } }, orderBy: { invoice_date: "desc" } });
      return res.json(dbInvs.map(inv => ({ id: `INV-00${inv.invoice_id}`, invoiceDate: inv.invoice_date.toISOString().split("T")[0], billingCity: inv.billing_city || "Cusco", billingCountry: inv.billing_country || "Perú", total: Number(inv.total), lines: inv.invoice_line.map(l => ({ id: l.invoice_line_id, trackName: l.track?.name || "Pista", unitPrice: Number(l.unit_price), quantity: l.quantity })) })));
    } catch (e: any) { console.warn("[API] invoices query failed", e.message); }
  }
  res.json(mockInvoices);
});

app.post("/api/invoices", async (req, res) => {
  const { id_cliente, billingCity, billingCountry, cartItems } = req.body;
  const total = cartItems.reduce((acc: number, item: any) => acc + Number(item.unitPrice), 0);
  if (isDbConnected) {
    try {
      const db = getPrisma();
      const maxInv = await db.invoice.aggregate({ _max: { invoice_id: true } });
      const nextInvId = (maxInv._max.invoice_id || 0) + 1;
      const maxLine = await db.invoiceLine.aggregate({ _max: { invoice_line_id: true } });
      const startLineId = (maxLine._max.invoice_line_id || 0) + 1;
      const dbInv = await db.invoice.create({ data: { invoice_id: nextInvId, customer_id: id_cliente || 1, invoice_date: new Date(), billing_city: billingCity || "Cusco", billing_country: billingCountry || "Perú", total, invoice_line: { create: cartItems.map((item: any, idx: number) => ({ invoice_line_id: startLineId + idx, track_id: item.id, unit_price: item.unitPrice, quantity: 1 })) } }, include: { invoice_line: { include: { track: true } } } });
      return res.json({ id: `INV-00${dbInv.invoice_id}`, invoiceDate: dbInv.invoice_date.toISOString().split("T")[0], billingCity: dbInv.billing_city || "", billingCountry: dbInv.billing_country || "", total: Number(dbInv.total), lines: dbInv.invoice_line.map(l => ({ id: l.invoice_line_id, trackName: l.track?.name || "Pista", unitPrice: Number(l.unit_price), quantity: l.quantity })) });
    } catch (e: any) { console.warn("[API] create invoice failed", e.message); }
  }
  const mockIdNum = mockInvoices.length + 105;
  const lines = cartItems.map((track: any, index: number) => ({ id: 9000 + index + mockIdNum, trackName: track.name, unitPrice: track.unitPrice, quantity: 1 }));
  const invoice = { id: `INV-00${mockIdNum}`, invoiceDate: new Date().toISOString().split("T")[0], billingCity: billingCity || "Cusco", billingCountry: billingCountry || "Perú", total: Number(total.toFixed(2)), lines };
  mockInvoices.unshift(invoice);
  res.json(invoice);
});

// Playlists
app.get("/api/playlists", async (req, res) => {
  if (isDbConnected) {
    try {
      const dbPls = await getPrisma().playlist.findMany({ include: { playlist_track: true }, orderBy: { name: "asc" } });
      return res.json(dbPls.map(p => ({ id: p.playlist_id, name: p.name || "Lista", trackCount: p.playlist_track.length })));
    } catch (e: any) { console.warn("[API] playlists query failed", e.message); }
  }
  res.json(mockPlaylists);
});

app.post("/api/playlists", async (req, res) => {
  const { name } = req.body;
  if (isDbConnected) {
    try {
      const db = getPrisma();
      const maxId = await db.playlist.aggregate({ _max: { playlist_id: true } });
      const nextId = (maxId._max.playlist_id || 0) + 1;
      const created = await db.playlist.create({ data: { playlist_id: nextId, name } });
      return res.json({ id: created.playlist_id, name: created.name, trackCount: 0, isCustom: true });
    } catch (e: any) { console.warn("[API] create playlist failed", e.message); }
  }
  const nextId = mockPlaylists.reduce((max, p) => p.id > max ? p.id : max, 0) + 1;
  const createdPl = { id: nextId, name, trackCount: 0, isCustom: true };
  mockPlaylists.push(createdPl);
  mockPlaylistTracksMap[nextId] = [];
  res.json(createdPl);
});

app.delete("/api/playlists/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isDbConnected) {
    try { await getPrisma().playlist_track.deleteMany({ where: { playlist_id: id } }); await getPrisma().playlist.delete({ where: { playlist_id: id } }); return res.json({ success: true }); }
    catch (e: any) { console.warn("[API] delete playlist failed", e.message); }
  }
  mockPlaylists = mockPlaylists.filter(p => p.id !== id);
  delete mockPlaylistTracksMap[id];
  res.json({ success: true });
});

// Serve static files
const distPath = path.join(process.cwd(), "dist");
app.use(express.static(distPath));
app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));

export default app;
