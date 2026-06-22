import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

const db = new PrismaClient();

async function run() {
  console.log("--- Testing Artists Query ---");
  try {
    const dbArtists = await db.artist.findMany({
      take: 300,
      orderBy: { name: "asc" }
    });
    console.log(`✅ Artists succeeded! Found count: ${dbArtists.length}`);
  } catch (err: any) {
    console.error("❌ Artists failed:", err.message);
  }

  console.log("--- Testing Albums Query ---");
  try {
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
    console.log(`✅ Albums succeeded! Found count: ${dbAlbums.length}`);
  } catch (err: any) {
    console.error("❌ Albums failed:", err.message);
  }

  console.log("--- Testing Tracks Query ---");
  try {
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
    console.log(`✅ Tracks succeeded! Found count: ${dbTracks.length}`);
  } catch (err: any) {
    console.error("❌ Tracks failed:", err.message);
  }

  console.log("--- Testing Clients/Customers Query ---");
  try {
    const dbClients = await db.customer.findMany({
      orderBy: { last_name: "asc" }
    });
    console.log(`✅ Clients succeeded! Found count: ${dbClients.length}`);
  } catch (err: any) {
    console.error("❌ Clients failed:", err.message);
  }

  console.log("--- Testing Employees Query ---");
  try {
    const dbEmployees = await db.employee.findMany({
      include: {
        employee: true,
        customer: true
      },
      orderBy: { last_name: "asc" }
    });
    console.log(`✅ Employees succeeded! Found count: ${dbEmployees.length}`);
  } catch (err: any) {
    console.error("❌ Employees failed:", err.message);
  }

  console.log("--- Testing Invoices Query ---");
  try {
    const dbInvoices = await db.invoice.findMany({
      include: {
        invoice_line: {
          include: { track: true }
        }
      },
      orderBy: { invoice_date: "desc" }
    });
    console.log(`✅ Invoices succeeded! Found count: ${dbInvoices.length}`);
  } catch (err: any) {
    console.error("❌ Invoices failed:", err.message);
  }

  console.log("--- Testing Playlists Query ---");
  try {
    const dbPlaylists = await db.playlist.findMany({
      include: {
        playlist_track: true
      },
      orderBy: { name: "asc" }
    });
    console.log(`✅ Playlists succeeded! Found count: ${dbPlaylists.length}`);
  } catch (err: any) {
    console.error("❌ Playlists failed:", err.message);
  }

  console.log("--- Testing Genres Query ---");
  try {
    const dbGenres = await db.genre.findMany({
      orderBy: { name: "asc" }
    });
    console.log(`✅ Genres succeeded! Found count: ${dbGenres.length}`);
  } catch (err: any) {
    console.error("❌ Genres failed:", err.message);
  }

  await db.$disconnect();
}

run();
