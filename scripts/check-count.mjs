import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const [tracks, customers, employees, invoices, playlists, albums] = await Promise.all([
  p.track.count(), p.customer.count(), p.employee.count(),
  p.invoice.count(), p.playlist.count(), p.album.count()
]);
console.log({ albums, tracks, customers, employees, invoices, playlists });
await p.$disconnect();
