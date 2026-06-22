import express from "express";
import path from "path";
import { 
  INITIAL_ALBUMS, INITIAL_TRACKS, INITIAL_CLIENTS, INITIAL_EMPLOYEES,
  INITIAL_INVOICES, INITIAL_PLAYLISTS, PLAYLIST_TRACKS_MAP,
  INITIAL_ARTISTS, INITIAL_GENRES
} from "../src/data";

const app = express();
app.use(express.json());

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

app.get("/api/db-status", (req, res) => {
  res.json({ connected: false, mode: "sandbox-mock", dbUrlConfigured: false, localTime: new Date().toISOString() });
});

app.get("/api/artists", (req, res) => res.json(mockArtists));
app.get("/api/genres", (req, res) => res.json(mockGenres));
app.get("/api/albums", (req, res) => res.json(mockAlbums));
app.get("/api/tracks", (req, res) => res.json(mockTracks));
app.get("/api/clients", (req, res) => res.json(mockClients));
app.get("/api/employees", (req, res) => res.json(mockEmployees));
app.get("/api/invoices", (req, res) => res.json(mockInvoices));
app.get("/api/playlists", (req, res) => res.json(mockPlaylists));

app.post("/api/clients", (req, res) => {
  const { firstName, lastName, email, company, country, phone, supportRepId } = req.body;
  const nextId = mockClients.reduce((max, c) => c.id > max ? c.id : max, 0) + 1;
  const created = { id: nextId, firstName, lastName, email, company, country, phone, supportRepId };
  mockClients.push(created);
  res.json(created);
});

app.put("/api/clients/:id", (req, res) => {
  const id = Number(req.params.id);
  const { firstName, lastName, email, company, country, phone, supportRepId } = req.body;
  mockClients = mockClients.map(c => c.id === id ? { ...c, firstName, lastName, email, company, country, phone, supportRepId } : c);
  res.json({ id, firstName, lastName, email, company, country, phone, supportRepId });
});

app.delete("/api/clients/:id", (req, res) => {
  mockClients = mockClients.filter(c => c.id !== Number(req.params.id));
  res.json({ success: true });
});

app.post("/api/invoices", (req, res) => {
  const { billingCity, billingCountry, cartItems } = req.body;
  const total = cartItems.reduce((acc: number, item: any) => acc + Number(item.unitPrice), 0);
  const mockIdNum = mockInvoices.length + 105;
  const formattedId = `INV-00${mockIdNum}`;
  const lines = cartItems.map((track: any, index: number) => ({
    id: 9000 + index + mockIdNum,
    trackName: track.name,
    unitPrice: track.unitPrice,
    quantity: 1
  }));
  const invoice = { id: formattedId, invoiceDate: new Date().toISOString().split("T")[0], billingCity: billingCity || "Cusco", billingCountry: billingCountry || "Perú", total: Number(total.toFixed(2)), lines };
  mockInvoices.unshift(invoice);
  res.json(invoice);
});

app.post("/api/playlists", (req, res) => {
  const { name } = req.body;
  const nextId = mockPlaylists.reduce((max, p) => p.id > max ? p.id : max, 0) + 1;
  const createdPl = { id: nextId, name, trackCount: 0, isCustom: true };
  mockPlaylists.push(createdPl);
  mockPlaylistTracksMap[nextId] = [];
  res.json(createdPl);
});

app.delete("/api/playlists/:id", (req, res) => {
  mockPlaylists = mockPlaylists.filter(p => p.id !== Number(req.params.id));
  delete mockPlaylistTracksMap[Number(req.params.id)];
  res.json({ success: true });
});

// Serve static files in production
const distPath = path.join(process.cwd(), "dist");
app.use(express.static(distPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

export default app;
