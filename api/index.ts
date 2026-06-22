import express from "express";
import path from "path";

const app = express();
app.use(express.json());

let prisma: any = null;
let isDbConnected = false;

// Fix Neon URL: ensure sslmode=require is present
function fixDbUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (!url.includes('sslmode=')) {
    url += (url.includes('?') ? '&' : '?') + 'sslmode=require';
  }
  return url;
}

// Dynamic Prisma import — fails gracefully if @prisma/client not available
async function initDb() {
  const dbUrl = fixDbUrl(process.env.DATABASE_URL);
  if (!dbUrl) return;
  // Set the fixed URL so PrismaClient picks it up
  process.env.DATABASE_URL = dbUrl;
  try {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });
    await prisma.$connect();
    isDbConnected = true;
    console.log("[API] Neon DB connected");
  } catch (e: any) {
    isDbConnected = false;
    console.warn("[API] DB unavailable, using mock data");
  }
}
initDb();

// Shared mock data (minimal but functional)
const images = ["https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=300&auto=format&fit=crop&q=60","https://images.unsplash.com/photo-1549417229-aa67d3263c09?w=300&auto=format&fit=crop&q=60","https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=60","https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop&q=60","https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=60","https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=60","https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=60","https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&auto=format&fit=crop&q=60"];

let mockArtists = Array.from({length: 275}, (_, i) => ({ id: i + 1, name: `Artist ${i + 1}` }));
let mockGenres = [{id:1,name:"Rock"},{id:2,name:"Jazz"},{id:3,name:"Metal"},{id:4,name:"Classical"},{id:5,name:"Electronic"},{id:6,name:"Pop"},{id:7,name:"Blues"},{id:8,name:"Reggae"}];
let mockAlbums = Array.from({length: 50}, (_, i) => ({ id: i + 1, name: `Album ${i + 1}`, artistName: `Artist ${(i % 20) + 1}`, coverUrl: images[i % images.length], genre: "Rock", releaseYear: 2000 + (i % 24), tracksCount: 5, price: 4.99 }));
let mockTracks = Array.from({length: 100}, (_, i) => ({ id: i + 1, name: `Track ${i + 1}`, composer: "Unknown", duration: "04:00", mediaType: "MPEG audio file", unitPrice: 0.99, genre: "Rock", albumId: (i % 50) + 1 }));
let mockClients = Array.from({length: 10}, (_, i) => ({ id: i + 1, firstName: `Client${i+1}`, lastName: `Last${i+1}`, email: `client${i+1}@mail.com`, company: "Company", country: "Perú", phone: "999-000-000", supportRepId: 3 }));
let mockEmployees = [{id:1,firstName:"Andrew",lastName:"Adams",title:"General Manager",hireDate:"2016-08-14",email:"andrew@musicstore.com",clientsCount:0,avatarUrl:"https://api.dicebear.com/7.x/adventurer/svg?seed=Andrew"},{id:2,firstName:"Nancy",lastName:"Edwards",title:"Sales Manager",reportsToId:1,reportsToName:"Andrew Adams",hireDate:"2016-10-01",email:"nancy@musicstore.com",clientsCount:0,avatarUrl:"https://api.dicebear.com/7.x/adventurer/svg?seed=Nancy"},{id:3,firstName:"Jane",lastName:"Peacock",title:"Sales Support Agent",reportsToId:2,reportsToName:"Nancy Edwards",hireDate:"2017-04-01",email:"jane@musicstore.com",clientsCount:2,avatarUrl:"https://api.dicebear.com/7.x/adventurer/svg?seed=Jane"},{id:4,firstName:"Margaret",lastName:"Park",title:"Sales Support Agent",reportsToId:2,reportsToName:"Nancy Edwards",hireDate:"2017-05-03",email:"margaret@musicstore.com",clientsCount:2,avatarUrl:"https://api.dicebear.com/7.x/adventurer/svg?seed=Margaret"},{id:5,firstName:"Steve",lastName:"Johnson",title:"Sales Support Agent",reportsToId:2,reportsToName:"Nancy Edwards",hireDate:"2017-10-17",email:"steve@musicstore.com",clientsCount:2,avatarUrl:"https://api.dicebear.com/7.x/adventurer/svg?seed=Steve"}];
let mockInvoices = Array.from({length: 5}, (_, i) => ({ id: `INV-00${105+i}`, invoiceDate: "2025-05-12", billingCity: "Cusco", billingCountry: "Perú", total: 9.99, lines: [{ id: i*10+1, trackName: "Track 1", unitPrice: 0.99, quantity: 1 }] }));
let mockPlaylists = [{id:1,name:"Favorites",trackCount:3},{id:2,name:"Rock Classics",trackCount:2}];
let mockPlaylistTracksMap: Record<number,number[]> = {1:[1,2,3],2:[4,5]};

const fmt = (ms: number) => `${Math.floor(ms/60000).toString().padStart(2,"0")}:${Math.floor((ms%60000)/1000).toString().padStart(2,"0")}`;

app.get("/api/db-status", (req, res) => res.json({ connected: isDbConnected, mode: isDbConnected?"production-neon":"sandbox-mock", dbUrlConfigured: !!process.env.DATABASE_URL, localTime: new Date().toISOString() }));

// ─── HELPERS ───────────────────────────────────────────
function q(name: string) { return name?.toLowerCase(); }

// ─── ARTISTS ───────────────────────────────────────────
app.get("/api/artists", async (req, res) => {
  if (isDbConnected) try { return res.json((await prisma.artist.findMany({take:300,orderBy:{name:"asc"}})).map((a:any)=>({id:a.artist_id,name:a.name||"Unknown"}))); } catch {}
  res.json(mockArtists);
});

// ─── GENRES ────────────────────────────────────────────
app.get("/api/genres", async (req, res) => {
  if (isDbConnected) try { return res.json((await prisma.genre.findMany({orderBy:{name:"asc"}})).map((g:any)=>({id:g.genre_id,name:g.name||"General"}))); } catch {}
  res.json(mockGenres);
});

// ─── ALBUMS ────────────────────────────────────────────
app.get("/api/albums", async (req, res) => {
  if (isDbConnected) try {
    const db = await prisma.album.findMany({take:300,include:{artist:true,track:{select:{track_id:true}}},orderBy:{title:"asc"}});
    return res.json(db.map((al:any)=>({id:al.album_id,name:al.title,artistName:al.artist?.name||"Unknown",coverUrl:images[al.album_id%images.length],genre:q(al.title)?.includes("rock")?"Rock":"Varios",releaseYear:2025-(al.album_id%30),tracksCount:al.track.length,price:3.99+(al.album_id%5)})));
  } catch {}
  res.json(mockAlbums);
});

// ─── TRACKS ────────────────────────────────────────────
app.get("/api/tracks", async (req, res) => {
  if (isDbConnected) try {
    const db = await prisma.track.findMany({take:300,include:{album:{include:{artist:true}},genre:true,media_type:true}});
    return res.json(db.map((t:any)=>({id:t.track_id,name:t.name,composer:t.composer||"Unknown",duration:fmt(t.milliseconds),mediaType:t.media_type?.name||"Audio",unitPrice:Number(t.unit_price),genre:t.genre?.name||"General",albumId:t.album_id||0})));
  } catch {}
  res.json(mockTracks);
});

// ─── CLIENTS ───────────────────────────────────────────
app.get("/api/clients", async (req, res) => {
  if (isDbConnected) try {
    const db = await prisma.customer.findMany({orderBy:{last_name:"asc"}});
    return res.json(db.map((c:any)=>({id:c.customer_id,firstName:c.first_name,lastName:c.last_name,email:c.email,company:c.company||"Personal",country:c.country||"Perú",phone:c.phone||"S/N",supportRepId:c.support_rep_id||0})));
  } catch {}
  res.json(mockClients);
});

app.post("/api/clients", async (req, res) => {
  const {firstName,lastName,email,company,country,phone,supportRepId}=req.body;
  if (isDbConnected) try {
    const db = prisma; const max=await db.customer.aggregate({_max:{customer_id:true}});
    const nc=await db.customer.create({data:{customer_id:(max._max.customer_id||0)+1,first_name:firstName,last_name:lastName,email,company:company||"",country:country||"Perú",phone:phone||"",support_rep_id:supportRepId||null}});
    return res.json({id:nc.customer_id,firstName:nc.first_name,lastName:nc.last_name,email:nc.email,company:nc.company||"",country:nc.country||"",phone:nc.phone||"",supportRepId:nc.support_rep_id||0});
  } catch {}
  const id=mockClients.reduce((m,c)=>c.id>m?c.id:m,0)+1; const cr={id,firstName,lastName,email,company,country,phone,supportRepId}; mockClients.push(cr); res.json(cr);
});

app.put("/api/clients/:id", async (req, res) => {
  const id=Number(req.params.id); const {firstName,lastName,email,company,country,phone,supportRepId}=req.body;
  if (isDbConnected) try {
    const u=await prisma.customer.update({where:{customer_id:id},data:{first_name:firstName,last_name:lastName,email,company,country,phone,support_rep_id:supportRepId||null}});
    return res.json({id:u.customer_id,firstName:u.first_name,lastName:u.last_name,email:u.email,company:u.company||"",country:u.country||"",phone:u.phone||"",supportRepId:u.support_rep_id||0});
  } catch {}
  mockClients=mockClients.map(c=>c.id===id?{...c,firstName,lastName,email,company,country,phone,supportRepId}:c); res.json({id,firstName,lastName,email,company,country,phone,supportRepId});
});

app.delete("/api/clients/:id", async (req, res) => {
  const id=Number(req.params.id);
  if (isDbConnected) try { await prisma.customer.delete({where:{customer_id:id}}); return res.json({success:true}); } catch {}
  mockClients=mockClients.filter(c=>c.id!==id); res.json({success:true});
});

// ─── EMPLOYEES ─────────────────────────────────────────
app.get("/api/employees", async (req, res) => {
  if (isDbConnected) try {
    const db=await prisma.employee.findMany({include:{employee:true,customer:true},orderBy:{last_name:"asc"}});
    return res.json(db.map((e:any)=>({id:e.employee_id,firstName:e.first_name,lastName:e.last_name,title:e.title||"Agent",reportsToId:e.reports_to||undefined,reportsToName:e.employee?`${e.employee.first_name} ${e.employee.last_name}`:undefined,hireDate:e.hire_date?e.hire_date.toISOString().split("T")[0]:"2024-01-01",email:e.email||"",clientsCount:e.customer?e.customer.length:0,avatarUrl:`https://api.dicebear.com/7.x/adventurer/svg?seed=${e.first_name}`})));
  } catch {}
  res.json(mockEmployees);
});

// ─── INVOICES ──────────────────────────────────────────
app.get("/api/invoices", async (req, res) => {
  if (isDbConnected) try {
    const db=await prisma.invoice.findMany({include:{invoice_line:{include:{track:true}}},orderBy:{invoice_date:"desc"}});
    return res.json(db.map((inv:any)=>({id:`INV-00${inv.invoice_id}`,invoiceDate:inv.invoice_date.toISOString().split("T")[0],billingCity:inv.billing_city||"Cusco",billingCountry:inv.billing_country||"Perú",total:Number(inv.total),lines:inv.invoice_line.map((l:any)=>({id:l.invoice_line_id,trackName:l.track?.name||"Track",unitPrice:Number(l.unit_price),quantity:l.quantity}))})));
  } catch {}
  res.json(mockInvoices);
});

app.post("/api/invoices", async (req, res) => {
  const {id_cliente,billingCity,billingCountry,cartItems}=req.body;
  const total=cartItems.reduce((acc:number,item:any)=>acc+Number(item.unitPrice),0);
  if (isDbConnected) try {
    const db=prisma; const maxInv=await db.invoice.aggregate({_max:{invoice_id:true}}); const maxLine=await db.invoiceLine.aggregate({_max:{invoice_line_id:true}});
    const inv=await db.invoice.create({data:{invoice_id:(maxInv._max.invoice_id||0)+1,customer_id:id_cliente||1,invoice_date:new Date(),billing_city:billingCity||"Cusco",billing_country:billingCountry||"Perú",total,invoice_line:{create:cartItems.map((item:any,idx:number)=>({invoice_line_id:(maxLine._max.invoice_line_id||0)+1+idx,track_id:item.id,unit_price:item.unitPrice,quantity:1}))}},include:{invoice_line:{include:{track:true}}}});
    return res.json({id:`INV-00${inv.invoice_id}`,invoiceDate:inv.invoice_date.toISOString().split("T")[0],billingCity:inv.billing_city||"",billingCountry:inv.billing_country||"",total:Number(inv.total),lines:inv.invoice_line.map((l:any)=>({id:l.invoice_line_id,trackName:l.track?.name||"Track",unitPrice:Number(l.unit_price),quantity:l.quantity}))});
  } catch {}
  const idNum=mockInvoices.length+105; const lines=cartItems.map((t:any,i:number)=>({id:9000+i+idNum,trackName:t.name,unitPrice:t.unitPrice,quantity:1}));
  const inv={id:`INV-00${idNum}`,invoiceDate:new Date().toISOString().split("T")[0],billingCity:billingCity||"Cusco",billingCountry:billingCountry||"Perú",total:Number(total.toFixed(2)),lines};
  mockInvoices.unshift(inv); res.json(inv);
});

// ─── PLAYLISTS ─────────────────────────────────────────
app.get("/api/playlists", async (req, res) => {
  if (isDbConnected) try {
    const db=await prisma.playlist.findMany({include:{playlist_track:true},orderBy:{name:"asc"}});
    return res.json(db.map((p:any)=>({id:p.playlist_id,name:p.name||"List",trackCount:p.playlist_track.length})));
  } catch {}
  res.json(mockPlaylists);
});

app.post("/api/playlists", async (req, res) => {
  const {name}=req.body;
  if (isDbConnected) try {
    const db=prisma; const max=await db.playlist.aggregate({_max:{playlist_id:true}});
    const c=await db.playlist.create({data:{playlist_id:(max._max.playlist_id||0)+1,name}});
    return res.json({id:c.playlist_id,name:c.name,trackCount:0,isCustom:true});
  } catch {}
  const id=mockPlaylists.reduce((m,p)=>p.id>m?p.id:m,0)+1; mockPlaylists.push({id,name,trackCount:0,isCustom:true}); mockPlaylistTracksMap[id]=[]; res.json({id,name,trackCount:0,isCustom:true});
});

app.delete("/api/playlists/:id", async (req, res) => {
  const id=Number(req.params.id);
  if (isDbConnected) try { await prisma.playlist_track.deleteMany({where:{playlist_id:id}}); await prisma.playlist.delete({where:{playlist_id:id}}); return res.json({success:true}); } catch {}
  mockPlaylists=mockPlaylists.filter(p=>p.id!==id); delete mockPlaylistTracksMap[id]; res.json({success:true});
});

// ─── STATIC FILES ──────────────────────────────────────
app.use(express.static(path.join(process.cwd(),"dist")));
app.get("*", (req, res) => res.sendFile(path.join(process.cwd(),"dist","index.html")));

export default app;
