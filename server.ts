import express from "express";
import path from "path";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

// Standard data exports as fallbacks if database is missing/unconfigured
import { 
  INITIAL_ALBUMS, 
  INITIAL_TRACKS, 
  INITIAL_CLIENTS, 
  INITIAL_EMPLOYEES, 
  INITIAL_INVOICES, 
  INITIAL_PLAYLISTS, 
  PLAYLIST_TRACKS_MAP,
  INITIAL_ARTISTS,
  INITIAL_GENRES
} from "./src/data";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Lazy-initialized Prisma Client
let prisma: PrismaClient | null = null;
let isDbConnected = !!process.env.DATABASE_URL;

function getPrisma(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is missing.");
  }
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

// In-memory clones to preserve mutations in mock mode
let mockAlbums = [...INITIAL_ALBUMS];
let mockTracks = [...INITIAL_TRACKS];
let mockClients = [...INITIAL_CLIENTS];
let mockEmployees = [...INITIAL_EMPLOYEES];
let mockInvoices = [...INITIAL_INVOICES];
let mockPlaylists = [...INITIAL_PLAYLISTS];
let mockPlaylistTracksMap = { ...PLAYLIST_TRACKS_MAP };
let mockArtists = [...INITIAL_ARTISTS];
let mockGenres = [...INITIAL_GENRES];

// Standard duration formatter helper
function formatMilliseconds(ms: number) {
  const totalSecs = Math.floor(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Map real album covers, release details and mock store pricing for standard Chinook entries
function getAlbumMetadata(id: number, title: string) {
  const norm = title.toLowerCase();
  if (norm.includes("kind of blue")) {
    return {
      coverUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=300&auto=format&fit=crop&q=60",
      genre: "Jazz",
      releaseYear: 1959,
      price: 4.95
    };
  }
  if (norm.includes("back in black")) {
    return {
      coverUrl: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?w=300&auto=format&fit=crop&q=60",
      genre: "Rock",
      releaseYear: 1980,
      price: 5.94
    };
  }
  if (norm.includes("nevermind")) {
    return {
      coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=60",
      genre: "Rock",
      releaseYear: 1991,
      price: 4.95
    };
  }
  if (norm.includes("master of puppets")) {
    return {
      coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop&q=60",
      genre: "Metal",
      releaseYear: 1986,
      price: 4.95
    };
  }
  if (norm.includes("estaciones") || norm.includes("four seasons")) {
    return {
      coverUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=60",
      genre: "Classical",
      releaseYear: 1725,
      price: 3.96
    };
  }
  if (norm.includes("random access")) {
    return {
      coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=60",
      genre: "Electronic",
      releaseYear: 2013,
      price: 5.94
    };
  }
  // Fallbacks: dynamically hash images and price based on ID
  const images = [
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=60"
  ];
  return {
    coverUrl: images[id % images.length],
    genre: "Varios",
    releaseYear: 2025 - (id % 30),
    price: 3.99 + (id % 5)
  };
}

// Middleware to detect if we should query database or fallback to mock
app.use((req, res, next) => {
  if (process.env.DATABASE_URL) {
    try {
      getPrisma();
      // We will rely on our background connection status
    } catch {
      isDbConnected = false;
    }
  } else {
    isDbConnected = false;
  }
  next();
});

// Asynchronously probe DB connection on startup
if (process.env.DATABASE_URL) {
  console.log("[PRISMA] Probing base database connection...");
  getPrisma().$connect()
    .then(() => {
      isDbConnected = true;
      console.log("[PRISMA] Base database connection verified successfully. Serving real data.");
    })
    .catch((err) => {
      isDbConnected = false;
      console.warn("[PRISMA] Base database connection failed. Falling back to sandbox-mock.", err.stack || err);
    });
}

// API endpoint to verify real status
app.get("/api/db-status", (req, res) => {
  res.json({
    connected: isDbConnected,
    mode: isDbConnected ? "production-neon" : "sandbox-mock",
    dbUrlConfigured: !!process.env.DATABASE_URL,
    localTime: new Date().toISOString()
  });
});

// Helper for generic database error logging
function handleRouteError(res: any, err: any, fallbackName: string) {
  console.warn(`[PRISMA BACKEND] Failed to execute query for ${fallbackName}. Falling back to mock caches. Error:`, err.message || err);
}

// ---------------------- ARTISTS API ----------------------
app.get("/api/artists", async (req, res) => {
  if (isDbConnected) {
    try {
      const db = getPrisma();
      const dbArtists = await db.artist.findMany({
        take: 300,
        orderBy: { name: "asc" }
      });
      const mapped = dbArtists.map(a => ({
        id: a.artist_id,
        name: a.name || "Artista Desconocido"
      }));
      return res.json(mapped);
    } catch (err: any) {
      handleRouteError(res, err, "artists");
    }
  }
  res.json(mockArtists);
});

// ---------------------- ALBUMS API ----------------------
app.get("/api/albums", async (req, res) => {
  if (isDbConnected) {
    try {
      const db = getPrisma();
      const dbAlbums = await db.album.findMany({
        take: 300,
        include: {
          artist: true,
          track: {
            select: { track_id: true }
          }
        },
        orderBy: { title: "asc" }
      });

      const mapped = dbAlbums.map(al => {
        const artistName = al.artist?.name || "Varios Artistas";
        const metadata = getAlbumMetadata(al.album_id, al.title);
        return {
          id: al.album_id,
          name: al.title,
          artistName,
          coverUrl: metadata.coverUrl,
          genre: metadata.genre,
          releaseYear: metadata.releaseYear,
          tracksCount: al.track.length,
          price: Number(metadata.price)
        };
      });
      return res.json(mapped);
    } catch (err: any) {
      handleRouteError(res, err, "albums");
    }
  }
  res.json(mockAlbums);
});

// ---------------------- TRACKS API ----------------------
app.get("/api/tracks", async (req, res) => {
  if (isDbConnected) {
    try {
      const db = getPrisma();
      const dbTracks = await db.track.findMany({
        take: 300,
        include: {
          album: {
            include: { artist: true }
          },
          genre: true,
          media_type: true
        }
      });

      const mapped = dbTracks.map(t => {
        return {
          id: t.track_id,
          name: t.name,
          composer: t.composer || "Varios Compositores",
          duration: formatMilliseconds(t.milliseconds),
          mediaType: t.media_type?.name || "Audio standard",
          unitPrice: Number(t.unit_price),
          genre: t.genre?.name || "General",
          albumId: t.album_id || 0
        };
      });
      return res.json(mapped);
    } catch (err: any) {
      handleRouteError(res, err, "tracks");
    }
  }
  res.json(mockTracks);
});

// ---------------------- CLIENTS / CUSTOMERS API ----------------------
app.get("/api/clients", async (req, res) => {
  if (isDbConnected) {
    try {
      const db = getPrisma();
      const dbClients = await db.customer.findMany({
        orderBy: { last_name: "asc" }
      });
      const mapped = dbClients.map(c => ({
        id: c.customer_id,
        firstName: c.first_name,
        lastName: c.last_name,
        email: c.email,
        company: c.company || "Personal",
        country: c.country || "Perú",
        phone: c.phone || "S/N",
        supportRepId: c.support_rep_id || 0
      }));
      return res.json(mapped);
    } catch (err: any) {
      handleRouteError(res, err, "clients");
    }
  }
  res.json(mockClients);
});

app.post("/api/clients", async (req, res) => {
  const { firstName, lastName, email, company, country, phone, supportRepId } = req.body;
  if (isDbConnected) {
    try {
      const db = getPrisma();
      const maxIdResult = await db.customer.aggregate({ _max: { customer_id: true } });
      const nextId = (maxIdResult._max.customer_id || 0) + 1;

      const newClient = await db.customer.create({
        data: {
          customer_id: nextId,
          first_name: firstName,
          last_name: lastName,
          email: email,
          company: company || "",
          country: country || "Perú",
          phone: phone || "",
          support_rep_id: supportRepId ? Number(supportRepId) : null
        }
      });
      return res.json({
        id: newClient.customer_id,
        firstName: newClient.first_name,
        lastName: newClient.last_name,
        email: newClient.email,
        company: newClient.company || "",
        country: newClient.country || "",
        phone: newClient.phone || "",
        supportRepId: newClient.support_rep_id || 0
      });
    } catch (err: any) {
      handleRouteError(res, err, "add-client");
    }
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
      const db = getPrisma();
      const updated = await db.customer.update({
        where: { customer_id: id },
        data: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          company: company,
          country: country,
          phone: phone,
          support_rep_id: supportRepId ? Number(supportRepId) : null
        }
      });
      return res.json({
        id: updated.customer_id,
        firstName: updated.first_name,
        lastName: updated.last_name,
        email: updated.email,
        company: updated.company || "",
        country: updated.country || "",
        phone: updated.phone || "",
        supportRepId: updated.support_rep_id || 0
      });
    } catch (err: any) {
      handleRouteError(res, err, "edit-client");
    }
  }
  mockClients = mockClients.map(c => c.id === id ? { ...c, firstName, lastName, email, company, country, phone, supportRepId } : c);
  res.json({ id, firstName, lastName, email, company, country, phone, supportRepId });
});

app.delete("/api/clients/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isDbConnected) {
    try {
      const db = getPrisma();
      await db.customer.delete({
        where: { customer_id: id }
      });
      return res.json({ success: true });
    } catch (err: any) {
      handleRouteError(res, err, "delete-client");
    }
  }
  mockClients = mockClients.filter(c => c.id !== id);
  res.json({ success: true });
});

// ---------------------- EMPLOYEES API ----------------------
app.get("/api/employees", async (req, res) => {
  if (isDbConnected) {
    try {
      const db = getPrisma();
      const dbEmployees = await db.employee.findMany({
        include: {
          employee: true,
          customer: true
        },
        orderBy: { last_name: "asc" }
      });

      const mapped = dbEmployees.map(e => ({
        id: e.employee_id,
        firstName: e.first_name,
        lastName: e.last_name,
        title: e.title || "Agente",
        reportsToId: e.reports_to || undefined,
        reportsToName: e.employee ? `${e.employee.first_name} ${e.employee.last_name}` : undefined,
        hireDate: e.hire_date ? e.hire_date.toISOString().split("T")[0] : "2024-01-01",
        email: e.email || "",
        clientsCount: e.customer ? e.customer.length : 0,
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${e.first_name}`
      }));
      return res.json(mapped);
    } catch (err: any) {
      handleRouteError(res, err, "employees");
    }
  }
  res.json(mockEmployees);
});

// ---------------------- INVOICES API ----------------------
app.get("/api/invoices", async (req, res) => {
  if (isDbConnected) {
    try {
      const db = getPrisma();
      const dbInvoices = await db.invoice.findMany({
        include: {
          invoice_line: {
            include: { track: true }
          }
        },
        orderBy: { invoice_date: "desc" }
      });

      const mapped = dbInvoices.map(inv => ({
        id: `INV-00${inv.invoice_id}`,
        invoiceDate: inv.invoice_date.toISOString().split("T")[0],
        billingCity: inv.billing_city || "Cusco",
        billingCountry: inv.billing_country || "Perú",
        total: Number(inv.total),
        lines: inv.invoice_line.map(l => ({
          id: l.invoice_line_id,
          trackName: l.track?.name || "Pista Musical",
          unitPrice: Number(l.unit_price),
          quantity: l.quantity
        }))
      }));
      return res.json(mapped);
    } catch (err: any) {
      handleRouteError(res, err, "invoices");
    }
  }
  res.json(mockInvoices);
});

// Checkouts / creating an invoice
app.post("/api/invoices", async (req, res) => {
  const { id_cliente, billingCity, billingCountry, cartItems } = req.body;
  const total = cartItems.reduce((acc: number, item: any) => acc + Number(item.unitPrice), 0);

  if (isDbConnected) {
    try {
      const db = getPrisma();
      const maxInvResult = await db.invoice.aggregate({ _max: { invoice_id: true } });
      const nextInvId = (maxInvResult._max.invoice_id || 0) + 1;

      const maxLineResult = await db.invoiceLine.aggregate({ _max: { invoice_line_id: true } });
      const startLineId = (maxLineResult._max.invoice_line_id || 0) + 1;

      // Insert new Invoice record
      const dbInvoice = await db.invoice.create({
        data: {
          invoice_id: nextInvId,
          customer_id: id_cliente || 1, // default customer ID
          invoice_date: new Date(),
          billing_city: billingCity || "Cusco",
          billing_country: billingCountry || "Perú",
          total: total,
          invoice_line: {
            create: cartItems.map((item: any, idx: number) => ({
              invoice_line_id: startLineId + idx,
              track_id: item.id,
              unit_price: item.unitPrice,
              quantity: 1
            }))
          }
        },
        include: {
          invoice_line: {
            include: { track: true }
          }
        }
      });

      return res.json({
        id: `INV-00${dbInvoice.invoice_id}`,
        invoiceDate: dbInvoice.invoice_date.toISOString().split("T")[0],
        billingCity: dbInvoice.billing_city || "",
        billingCountry: dbInvoice.billing_country || "",
        total: Number(dbInvoice.total),
        lines: dbInvoice.invoice_line.map(l => ({
          id: l.invoice_line_id,
          trackName: l.track?.name || "Pista Musical",
          unitPrice: Number(l.unit_price),
          quantity: l.quantity
        }))
      });
    } catch (err: any) {
      handleRouteError(res, err, "checkout-invoice");
    }
  }

  // Fallback memory state
  const mockIdNum = mockInvoices.length + 105;
  const formattedId = `INV-00${mockIdNum}`;
  const lines = cartItems.map((track: any, index: number) => ({
    id: 9000 + index + mockIdNum,
    trackName: track.name,
    unitPrice: track.unitPrice,
    quantity: 1
  }));
  const invoice = {
    id: formattedId,
    invoiceDate: new Date().toISOString().split("T")[0],
    billingCity: billingCity || "São José dos Campos",
    billingCountry: billingCountry || "Brasil",
    total: Number(total.toFixed(2)),
    lines
  };
  mockInvoices.unshift(invoice);
  res.json(invoice);
});

// ---------------------- PLAYLISTS API ----------------------
app.get("/api/playlists", async (req, res) => {
  if (isDbConnected) {
    try {
      const db = getPrisma();
      const dbPlaylists = await db.playlist.findMany({
        include: {
          playlist_track: true
        },
        orderBy: { name: "asc" }
      });

      const mapped = dbPlaylists.map(p => ({
        id: p.playlist_id,
        name: p.name || "Lista de Reproducción",
        trackCount: p.playlist_track.length
      }));
      return res.json(mapped);
    } catch (err: any) {
      handleRouteError(res, err, "playlists");
    }
  }
  res.json(mockPlaylists);
});

app.post("/api/playlists", async (req, res) => {
  const { name } = req.body;
  if (isDbConnected) {
    try {
      const db = getPrisma();
      const maxIdResult = await db.playlist.aggregate({ _max: { playlist_id: true } });
      const nextId = (maxIdResult._max.playlist_id || 0) + 1;

      const created = await db.playlist.create({
        data: {
          playlist_id: nextId,
          name: name
        }
      });
      return res.json({
        id: created.playlist_id,
        name: created.name,
        trackCount: 0,
        isCustom: true
      });
    } catch (err: any) {
      handleRouteError(res, err, "create-playlist");
    }
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
    try {
      const db = getPrisma();
      await db.playlist_track.deleteMany({
        where: { playlist_id: id }
      });
      await db.playlist.delete({
        where: { playlist_id: id }
      });
      return res.json({ success: true });
    } catch (err: any) {
      handleRouteError(res, err, "delete-playlist");
    }
  }
  mockPlaylists = mockPlaylists.filter(p => p.id !== id);
  delete mockPlaylistTracksMap[id];
  res.json({ success: true });
});

// ---------------------- GENRES API ----------------------
app.get("/api/genres", async (req, res) => {
  if (isDbConnected) {
    try {
      const db = getPrisma();
      const dbGenres = await db.genre.findMany({
        orderBy: { name: "asc" }
      });
      const mapped = dbGenres.map(g => ({
        id: g.genre_id,
        name: g.name || "General"
      }));
      return res.json(mapped);
    } catch (err: any) {
      handleRouteError(res, err, "genres");
    }
  }
  res.json(mockGenres);
});

// Vite Dev Server Middleware integration or Production static assets pipeline
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("[DEV ENVIRONMENT] Mounted Vite Dev Server middleware");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("[PROD ENVIRONMENT] Serving compiled client static asset logs");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVE] MusicStore Web running successfully on http://0.0.0.0:${PORT}`);
  });
};

startServer().catch(err => {
  console.error("Critical server bootstrap error:", err);
});
