import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Neo n database with full Chinook data...\n');

  const data = JSON.parse(readFileSync('src/chinook-data.json', 'utf-8'));

  // Seed MediaTypes
  const mediaTypes = [
    { media_type_id: 1, name: 'MPEG audio file' },
    { media_type_id: 2, name: 'Protected AAC audio file' },
    { media_type_id: 3, name: 'Protected MPEG-4 video file' },
    { media_type_id: 4, name: 'Purchased AAC audio file' },
    { media_type_id: 5, name: 'AAC audio file' },
  ];
  for (const mt of mediaTypes) {
    await prisma.mediaType.upsert({ where: { media_type_id: mt.media_type_id }, update: mt, create: mt });
  }
  console.log(`  ✓ ${mediaTypes.length} MediaTypes`);

  // Seed Genres
  for (const g of data.genres) {
    await prisma.genre.upsert({ where: { genre_id: g.id }, update: { name: g.name }, create: { genre_id: g.id, name: g.name } });
  }
  console.log(`  ✓ ${data.genres.length} Genres`);

  // Seed Artists
  for (const a of data.artists) {
    await prisma.artist.upsert({ where: { artist_id: a.id }, update: { name: a.name }, create: { artist_id: a.id, name: a.name } });
  }
  console.log(`  ✓ ${data.artists.length} Artists`);

  // Seed Albums
  let albumCount = 0;
  for (const al of data.albums) {
    try {
      await prisma.album.upsert({
        where: { album_id: al.id },
        update: { title: al.name, artist_id: data.artists.find(a => a.name === al.artistName)?.id || 1 },
        create: { album_id: al.id, title: al.name, artist_id: data.artists.find(a => a.name === al.artistName)?.id || 1 }
      });
      albumCount++;
    } catch (e) { /* skip */ }
  }
  console.log(`  ✓ ${albumCount} Albums`);

  // Seed Tracks
  let trackCount = 0;
  for (const t of data.tracks) {
    try {
      const genreId = data.genres.find(g => g.name === t.genre)?.id || null;
      await prisma.track.upsert({
        where: { track_id: t.id },
        update: {
          name: t.name, album_id: t.albumId || null, media_type_id: 1,
          genre_id: genreId, composer: t.composer || null, milliseconds: 0, bytes: null, unit_price: t.unitPrice
        },
        create: {
          track_id: t.id, name: t.name, album_id: t.albumId || null, media_type_id: 1,
          genre_id: genreId, composer: t.composer || null, milliseconds: 0, bytes: null, unit_price: t.unitPrice
        }
      });
      trackCount++;
    } catch (e) { /* skip */ }
  }
  console.log(`  ✓ ${trackCount} Tracks`);

  // Seed Employees
  const employees = [
    { id: 1, first_name: 'Andrew', last_name: 'Adams', title: 'General Manager', reports_to: null, email: 'andrew@chinookcorp.com' },
    { id: 2, first_name: 'Nancy', last_name: 'Edwards', title: 'Sales Manager', reports_to: 1, email: 'nancy@chinookcorp.com' },
    { id: 3, first_name: 'Jane', last_name: 'Peacock', title: 'Sales Support Agent', reports_to: 2, email: 'jane@chinookcorp.com' },
    { id: 4, first_name: 'Margaret', last_name: 'Park', title: 'Sales Support Agent', reports_to: 2, email: 'margaret@chinookcorp.com' },
    { id: 5, first_name: 'Steve', last_name: 'Johnson', title: 'Sales Support Agent', reports_to: 2, email: 'steve@chinookcorp.com' },
    { id: 6, first_name: 'Michael', last_name: 'Mitchell', title: 'IT Manager', reports_to: 1, email: 'michael@chinookcorp.com' },
    { id: 7, first_name: 'Robert', last_name: 'King', title: 'IT Staff', reports_to: 6, email: 'robert@chinookcorp.com' },
    { id: 8, first_name: 'Laura', last_name: 'Callahan', title: 'IT Staff', reports_to: 6, email: 'laura@chinookcorp.com' },
  ];
  for (const e of employees) {
    await prisma.employee.upsert({
      where: { employee_id: e.id },
      update: { first_name: e.first_name, last_name: e.last_name, title: e.title, reports_to: e.reports_to, email: e.email },
      create: { employee_id: e.id, first_name: e.first_name, last_name: e.last_name, title: e.title, reports_to: e.reports_to, email: e.email }
    });
  }
  console.log(`  ✓ ${employees.length} Employees`);

  // Seed Customers
  let customerCount = 0;
  for (const c of data.clients) {
    try {
      await prisma.customer.upsert({
        where: { customer_id: c.id },
        update: { first_name: c.firstName, last_name: c.lastName, email: c.email, company: c.company, country: c.country, phone: c.phone, support_rep_id: c.supportRepId || null },
        create: { customer_id: c.id, first_name: c.firstName, last_name: c.lastName, email: c.email, company: c.company, country: c.country, phone: c.phone, support_rep_id: c.supportRepId || null }
      });
      customerCount++;
    } catch (e) { /* skip */ }
  }
  console.log(`  ✓ ${customerCount} Customers`);

  console.log('\n✅ Database seeded successfully!');
}

main().catch((e) => { console.error('Seed failed:', e); process.exit(1); }).finally(() => prisma.$disconnect());
