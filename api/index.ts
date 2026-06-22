import express from "express";
import path from "path";
import pg from "pg";

const app = express();
app.use(express.json());

const { Pool } = pg;
let pool: pg.Pool | null = null;
let isDbConnected = false;

function fixDbUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (!url.includes('sslmode=')) {
    url += (url.includes('?') ? '&' : '?') + 'sslmode=require';
  }
  return url;
}

async function ensureDb() {
  const dbUrl = fixDbUrl(process.env.DATABASE_URL);
  if (!dbUrl) return false;
  if (pool && isDbConnected) return true;
  try {
    if (!pool) pool = new Pool({ connectionString: dbUrl, max: 1, idleTimeoutMillis: 8000, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 5000 });
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    isDbConnected = true;
    return true;
  } catch (e: any) {
    isDbConnected = false;
    return false;
  }
}
ensureDb();

function q(s: string) { return `'${s.replace(/'/g, "''")}'`; }

const images = ["https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=300&auto=format&fit=crop&q=60","https://images.unsplash.com/photo-1549417229-aa67d3263c09?w=300&auto=format&fit=crop&q=60","https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=60","https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop&q=60","https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=60","https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=60","https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=60","https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&auto=format&fit=crop&q=60"];

let mockArtists = [{id:1,name:"AC/DC"},{id:2,name:"Accept"},{id:3,name:"Aerosmith"},{id:4,name:"Alanis Morissette"},{id:5,name:"Alice In Chains"}];
let mockGenres = [{id:1,name:"Rock"},{id:2,name:"Jazz"},{id:3,name:"Metal"},{id:4,name:"Classical"},{id:5,name:"Electronic"}];
let mockAlbums = Array.from({length:20},(_,i)=>({id:i+1,name:`Album ${i+1}`,artistName:`Artist ${(i%5)+1}`,coverUrl:images[i%images.length],genre:"Rock",releaseYear:2000+(i%24),tracksCount:10,price:4.99}));
let mockTracks = Array.from({length:50},(_,i)=>({id:i+1,name:`Track ${i+1}`,composer:"Unknown",duration:"04:00",mediaType:"MPEG audio file",unitPrice:0.99,genre:"Rock",albumId:(i%20)+1}));
let mockClients = [{id:1,firstName:"Luís",lastName:"Gonçalves",email:"luisg@embraer.com.br",company:"Embraer",country:"Brasil",phone:"+55 (12) 3923-5555",supportRepId:3},{id:2,firstName:"Leonie",lastName:"Köhler",email:"leonekohler@surfeu.de",company:"",country:"Germany",phone:"+49 30 2345 6789",supportRepId:3}];
let mockEmployees = [{id:1,firstName:"Andrew",lastName:"Adams",title:"General Manager",hireDate:"2016-08-14",email:"andrew@chinookcorp.com",clientsCount:0,avatarUrl:"https://api.dicebear.com/7.x/adventurer/svg?seed=Andrew"},{id:2,firstName:"Nancy",lastName:"Edwards",title:"Sales Manager",reportsToId:1,reportsToName:"Andrew Adams",hireDate:"2016-10-01",email:"nancy@chinookcorp.com",clientsCount:0,avatarUrl:"https://api.dicebear.com/7.x/adventurer/svg?seed=Nancy"},{id:3,firstName:"Jane",lastName:"Peacock",title:"Sales Support Agent",reportsToId:2,reportsToName:"Nancy Edwards",hireDate:"2017-04-01",email:"jane@chinookcorp.com",clientsCount:0,avatarUrl:"https://api.dicebear.com/7.x/adventurer/svg?seed=Jane"},{id:4,firstName:"Margaret",lastName:"Park",title:"Sales Support Agent",reportsToId:2,reportsToName:"Nancy Edwards",hireDate:"2017-05-03",email:"margaret@chinookcorp.com",clientsCount:0,avatarUrl:"https://api.dicebear.com/7.x/adventurer/svg?seed=Margaret"},{id:5,firstName:"Steve",lastName:"Johnson",title:"Sales Support Agent",reportsToId:2,reportsToName:"Nancy Edwards",hireDate:"2017-10-17",email:"steve@chinookcorp.com",clientsCount:0,avatarUrl:"https://api.dicebear.com/7.x/adventurer/svg?seed=Steve"}];
let mockInvoices = [{id:"INV-00101",invoiceDate:"2025-05-01",billingCity:"Cusco",billingCountry:"Perú",total:9.99,lines:[{id:1,trackName:"Track 1",unitPrice:0.99,quantity:1}]}];
let mockPlaylists = [{id:1,name:"Music",trackCount:0},{id:2,name:"Favorites",trackCount:0}];
let mockPlaylistTracksMap: Record<number,number[]> = {};

async function dbQuery(text: string, params?: any[]) {
  if (!(await ensureDb())) return null;
  try {
    const r = await pool!.query(text, params);
    return r;
  } catch (e: any) {
    return null;
  }
}

function fmt(ms: number) { return `${Math.floor(ms/60000).toString().padStart(2,"0")}:${Math.floor((ms%60000)/1000).toString().padStart(2,"0")}`; }

app.get("/api/db-status", async (req, res) => {
  const ok = await ensureDb();
  res.json({ connected: ok, mode: ok?"production-neon":"sandbox-mock", dbUrlConfigured: !!process.env.DATABASE_URL, localTime: new Date().toISOString() });
});

// ─── ARTISTS ───────────────────────────────────────────
app.get("/api/artists", async (req, res) => {
  const r = await dbQuery('SELECT artist_id AS id, name FROM artist ORDER BY name LIMIT 300');
  if (r && r.rows.length) return res.json(r.rows.map((a:any)=>({id:a.id,name:a.name||"Unknown"})));
  res.json(mockArtists);
});

// ─── GENRES ────────────────────────────────────────────
app.get("/api/genres", async (req, res) => {
  const r = await dbQuery('SELECT genre_id AS id, name FROM genre ORDER BY name');
  if (r && r.rows.length) return res.json(r.rows.map((g:any)=>({id:g.id,name:g.name||"General"})));
  res.json(mockGenres);
});

// ─── ALBUMS ────────────────────────────────────────────
app.get("/api/albums", async (req, res) => {
  const r = await dbQuery('SELECT a.album_id AS id, a.title AS name, ar.name AS artistname FROM album a JOIN artist ar ON a.artist_id = ar.artist_id ORDER BY a.title LIMIT 300');
  if (r && r.rows.length) return res.json(r.rows.map((a:any)=>({id:a.id,name:a.name,artistName:a.artistname,coverUrl:images[a.id%images.length],genre:"Varios",releaseYear:2000+(a.id%24),tracksCount:10,price:4.99+(a.id%5)})));
  res.json(mockAlbums);
});

// ─── TRACKS ────────────────────────────────────────────
app.get("/api/tracks", async (req, res) => {
  const r = await dbQuery('SELECT t.track_id AS id, t.name, t.composer, t.milliseconds, t.unit_price AS unitprice, t.album_id AS albumid, g.name AS genre, mt.name AS mediatype FROM track t LEFT JOIN genre g ON t.genre_id = g.genre_id LEFT JOIN media_type mt ON t.media_type_id = mt.media_type_id ORDER BY t.track_id LIMIT 300');
  if (r && r.rows.length) return res.json(r.rows.map((t:any)=>({id:t.id,name:t.name,composer:t.composer||"Unknown",duration:fmt(t.milliseconds),mediaType:t.mediatype||"Audio",unitPrice:Number(t.unitprice),genre:t.genre||"General",albumId:t.albumid||0})));
  res.json(mockTracks);
});

// ─── CLIENTS ───────────────────────────────────────────
app.get("/api/clients", async (req, res) => {
  const r = await dbQuery('SELECT customer_id AS id, first_name AS firstname, last_name AS lastname, email, company, country, phone, support_rep_id AS supportrepid FROM customer ORDER BY last_name');
  if (r && r.rows.length) return res.json(r.rows.map((c:any)=>({id:c.id,firstName:c.firstname,lastName:c.lastname,email:c.email,company:c.company||"Personal",country:c.country||"Perú",phone:c.phone||"S/N",supportRepId:c.supportrepid||0})));
  res.json(mockClients);
});

app.post("/api/clients", async (req, res) => {
  const {firstName,lastName,email,company,country,phone,supportRepId}=req.body;
  const r = await dbQuery("SELECT COALESCE(MAX(customer_id),0)+1 AS next FROM customer");
  if (r && r.rows.length) {
    const nextId = r.rows[0].next;
    await dbQuery("INSERT INTO customer(customer_id,first_name,last_name,email,company,country,phone,support_rep_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",[nextId,firstName,lastName,email,company||"",country||"Perú",phone||"",supportRepId||null]).catch(()=>{});
    if (isDbConnected) return res.json({id:nextId,firstName,lastName,email,company,country,phone,supportRepId});
  }
  const id=mockClients.reduce((m,c)=>c.id>m?c.id:m,0)+1; const cr={id,firstName,lastName,email,company,country,phone,supportRepId}; mockClients.push(cr); res.json(cr);
});

app.put("/api/clients/:id", async (req, res) => {
  const id=Number(req.params.id); const {firstName,lastName,email,company,country,phone,supportRepId}=req.body;
  const r = await dbQuery("UPDATE customer SET first_name=$1,last_name=$2,email=$3,company=$4,country=$5,phone=$6,support_rep_id=$7 WHERE customer_id=$8",[firstName,lastName,email,company,country,phone,supportRepId||null,id]);
  if (r && r.rowCount && r.rowCount>0) return res.json({id,firstName,lastName,email,company,country,phone,supportRepId});
  mockClients=mockClients.map(c=>c.id===id?{...c,firstName,lastName,email,company,country,phone,supportRepId}:c); res.json({id,firstName,lastName,email,company,country,phone,supportRepId});
});

app.delete("/api/clients/:id", async (req, res) => {
  const id=Number(req.params.id);
  const r = await dbQuery("DELETE FROM customer WHERE customer_id=$1",[id]);
  if (r && r.rowCount && r.rowCount>0) return res.json({success:true});
  mockClients=mockClients.filter(c=>c.id!==id); res.json({success:true});
});

// ─── EMPLOYEES ─────────────────────────────────────────
app.get("/api/employees", async (req, res) => {
  const r = await dbQuery("SELECT e.employee_id AS id, e.first_name AS firstname, e.last_name AS lastname, e.title, e.reports_to AS reportsto, e.hire_date AS hiredate, e.email, (SELECT COUNT(*) FROM customer c WHERE c.support_rep_id=e.employee_id) AS clientscount, m.first_name AS mgrfirst, m.last_name AS mgrlast FROM employee e LEFT JOIN employee m ON e.reports_to=m.employee_id ORDER BY e.last_name");
  if (r && r.rows.length) return res.json(r.rows.map((e:any)=>({id:e.id,firstName:e.firstname,lastName:e.lastname,title:e.title||"Agent",reportsToId:e.reportsto||undefined,reportsToName:e.mgrfirst?`${e.mgrfirst} ${e.mgrlast}`:undefined,hireDate:e.hiredate?new Date(e.hiredate).toISOString().split("T")[0]:"2024-01-01",email:e.email||"",clientsCount:Number(e.clientscount),avatarUrl:`https://api.dicebear.com/7.x/adventurer/svg?seed=${e.firstname}`})));
  res.json(mockEmployees);
});

// ─── INVOICES ──────────────────────────────────────────
app.get("/api/invoices", async (req, res) => {
  const r = await dbQuery("SELECT i.invoice_id AS id, i.invoice_date AS invdate, i.billing_city AS city, i.billing_country AS country, i.total FROM invoice i ORDER BY i.invoice_date DESC LIMIT 100");
  if (r && r.rows.length) {
    const invoices = [];
    for (const inv of r.rows) {
      const lr = await dbQuery("SELECT il.invoice_line_id AS lid, t.name AS tname, il.unit_price AS uprice, il.quantity AS qty FROM invoice_line il JOIN track t ON il.track_id=t.track_id WHERE il.invoice_id=$1",[inv.id]).catch(()=>null);
      invoices.push({id:`INV-00${inv.id}`,invoiceDate:new Date(inv.invdate).toISOString().split("T")[0],billingCity:inv.city||"Cusco",billingCountry:inv.country||"Perú",total:Number(inv.total),lines:lr?lr.rows.map((l:any)=>({id:l.lid,trackName:l.tname,unitPrice:Number(l.uprice),quantity:l.qty})):[]});
    }
    return res.json(invoices);
  }
  res.json(mockInvoices);
});

app.post("/api/invoices", async (req, res) => {
  const {id_cliente,billingCity,billingCountry,cartItems}=req.body;
  const total=cartItems.reduce((acc:number,item:any)=>acc+Number(item.unitPrice),0);
  const r = await dbQuery("SELECT COALESCE(MAX(invoice_id),0)+1 AS next FROM invoice");
  if (r && r.rows.length && isDbConnected) {
    const nextId=r.rows[0].next;
    await dbQuery("INSERT INTO invoice(invoice_id,customer_id,invoice_date,billing_city,billing_country,total) VALUES($1,$2,NOW(),$3,$4,$5)",[nextId,id_cliente||1,billingCity||"Cusco",billingCountry||"Perú",total]).catch(()=>{});
    for (let i=0;i<cartItems.length;i++) {
      await dbQuery("INSERT INTO invoice_line(invoice_line_id,invoice_id,track_id,unit_price,quantity) VALUES($1,$2,$3,$4,1)",[nextId*100+i,nextId,cartItems[i].id,cartItems[i].unitPrice]).catch(()=>{});
    }
    return res.json({id:`INV-00${nextId}`,invoiceDate:new Date().toISOString().split("T")[0],billingCity:billingCity||"Cusco",billingCountry:billingCountry||"Perú",total:Number(total.toFixed(2)),lines:cartItems.map((t:any,i:number)=>({id:nextId*100+i,trackName:t.name,unitPrice:t.unitPrice,quantity:1}))});
  }
  const idNum=mockInvoices.length+105; const lines=cartItems.map((t:any,i:number)=>({id:9000+i+idNum,trackName:t.name,unitPrice:t.unitPrice,quantity:1}));
  const inv={id:`INV-00${idNum}`,invoiceDate:new Date().toISOString().split("T")[0],billingCity:billingCity||"Cusco",billingCountry:billingCountry||"Perú",total:Number(total.toFixed(2)),lines};
  mockInvoices.unshift(inv); res.json(inv);
});

// ─── PLAYLISTS ─────────────────────────────────────────
app.get("/api/playlists", async (req, res) => {
  const r = await dbQuery("SELECT p.playlist_id AS id, p.name, (SELECT COUNT(*) FROM playlist_track pt WHERE pt.playlist_id=p.playlist_id) AS trackcount FROM playlist p ORDER BY p.name");
  if (r && r.rows.length) return res.json(r.rows.map((p:any)=>({id:p.id,name:p.name||"List",trackCount:Number(p.trackcount)})));
  res.json(mockPlaylists);
});

app.post("/api/playlists", async (req, res) => {
  const {name}=req.body;
  const r = await dbQuery("SELECT COALESCE(MAX(playlist_id),0)+1 AS next FROM playlist");
  if (r && r.rows.length && isDbConnected) {
    const nextId=r.rows[0].next;
    await dbQuery("INSERT INTO playlist(playlist_id,name) VALUES($1,$2)",[nextId,name]).catch(()=>{});
    return res.json({id:nextId,name,trackCount:0,isCustom:true});
  }
  const id=mockPlaylists.reduce((m,p)=>p.id>m?p.id:m,0)+1; const np:any={id,name,trackCount:0,isCustom:true}; mockPlaylists.push(np); mockPlaylistTracksMap[id]=[]; res.json(np);
});

app.delete("/api/playlists/:id", async (req, res) => {
  const id=Number(req.params.id);
  await dbQuery("DELETE FROM playlist_track WHERE playlist_id=$1",[id]).catch(()=>{});
  const dr = await dbQuery("DELETE FROM playlist WHERE playlist_id=$1",[id]);
  if (dr && dr.rowCount && dr.rowCount>0) return res.json({success:true});
  mockPlaylists=mockPlaylists.filter(p=>p.id!==id); delete mockPlaylistTracksMap[id]; res.json({success:true});
});

// ─── STATIC FILES ──────────────────────────────────────
app.use(express.static(path.join(process.cwd(),"dist")));
app.get("*", (req, res) => res.sendFile(path.join(process.cwd(),"dist","index.html")));

export default app;
