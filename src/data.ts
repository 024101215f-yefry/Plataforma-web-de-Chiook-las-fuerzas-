import { Album, Track, Client, Invoice, Employee, Playlist, Artist, Genre } from './types';

// Albums data from Chinook database reference + a few modern ones
export const INITIAL_ALBUMS: Album[] = [
  {
    id: 1,
    name: "Kind of Blue",
    artistName: "Miles Davis",
    coverUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=300&auto=format&fit=crop&q=60",
    genre: "Jazz",
    releaseYear: 1959,
    tracksCount: 5,
    price: 4.95,
  },
  {
    id: 2,
    name: "Back in Black",
    artistName: "AC/DC",
    coverUrl: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?w=300&auto=format&fit=crop&q=60",
    genre: "Rock",
    releaseYear: 1980,
    tracksCount: 6,
    price: 5.94,
  },
  {
    id: 3,
    name: "Nevermind",
    artistName: "Nirvana",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=60",
    genre: "Rock",
    releaseYear: 1991,
    tracksCount: 5,
    price: 4.95,
  },
  {
    id: 4,
    name: "Master of Puppets",
    artistName: "Metallica",
    coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop&q=60",
    genre: "Metal",
    releaseYear: 1986,
    tracksCount: 5,
    price: 4.95,
  },
  {
    id: 5,
    name: "Las Cuatro Estaciones",
    artistName: "Vivaldi",
    coverUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=60",
    genre: "Classical",
    releaseYear: 1725,
    tracksCount: 4,
    price: 3.96,
  },
  {
    id: 6,
    name: "Random Access Memories",
    artistName: "Daft Punk",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=60",
    genre: "Electronic",
    releaseYear: 2013,
    tracksCount: 6,
    price: 5.94,
  }
];

// Reference Tracks mapping to Chinook
export const INITIAL_TRACKS: Track[] = [
  // Tracks for Kind of Blue (Album 1)
  { id: 101, name: "So What", composer: "Miles Davis", duration: "09:22", mediaType: "MPEG audio file", unitPrice: 0.99, genre: "Jazz", albumId: 1 },
  { id: 102, name: "Freddie Freeloader", composer: "Miles Davis", duration: "09:49", mediaType: "MPEG audio file", unitPrice: 0.99, genre: "Jazz", albumId: 1 },
  { id: 103, name: "Blue in Green", composer: "Miles Davis", duration: "05:37", mediaType: "MPEG audio file", unitPrice: 0.99, genre: "Jazz", albumId: 1 },
  { id: 104, name: "Flamenco Sketches", composer: "Miles Davis", duration: "09:22", mediaType: "MPEG audio file", unitPrice: 0.99, genre: "Jazz", albumId: 1 },
  { id: 105, name: "All Blues", composer: "Miles Davis", duration: "11:33", mediaType: "MPEG audio file", unitPrice: 0.99, genre: "Jazz", albumId: 1 },

  // Tracks for Back in Black (Album 2)
  { id: 201, name: "Hells Bells", composer: "Angus Young, Malcolm Young, Brian Johnson", duration: "05:12", mediaType: "AAC audio file", unitPrice: 0.99, genre: "Rock", albumId: 2 },
  { id: 202, name: "Shoot to Thrill", composer: "Angus Young, Malcolm Young, Brian Johnson", duration: "05:17", mediaType: "AAC audio file", unitPrice: 0.99, genre: "Rock", albumId: 2 },
  { id: 203, name: "Back in Black", composer: "Angus Young, Malcolm Young, Brian Johnson", duration: "04:15", mediaType: "AAC audio file", unitPrice: 0.99, genre: "Rock", albumId: 2 },
  { id: 204, name: "You Shook Me All Night Long", composer: "Angus Young, Malcolm Young, Brian Johnson", duration: "03:30", mediaType: "AAC audio file", unitPrice: 0.99, genre: "Rock", albumId: 2 },
  { id: 205, name: "Have a Drink on Me", composer: "Angus Young, Malcolm Young, Brian Johnson", duration: "03:58", mediaType: "AAC audio file", unitPrice: 0.99, genre: "Rock", albumId: 2 },
  { id: 206, name: "Rock and Roll Ain't Noise Pollution", composer: "Angus Young, Malcolm Young, Brian Johnson", duration: "04:15", mediaType: "AAC audio file", unitPrice: 0.99, genre: "Rock", albumId: 2 },

  // Tracks for Nevermind (Album 3)
  { id: 301, name: "Smells Like Teen Spirit", composer: "Kurt Cobain, Krist Novoselic, Dave Grohl", duration: "05:01", mediaType: "MPEG audio file", unitPrice: 0.99, genre: "Rock", albumId: 3 },
  { id: 302, name: "In Bloom", composer: "Kurt Cobain", duration: "04:14", mediaType: "MPEG audio file", unitPrice: 0.99, genre: "Rock", albumId: 3 },
  { id: 303, name: "Come as You Are", composer: "Kurt Cobain", duration: "03:39", mediaType: "MPEG audio file", unitPrice: 0.99, genre: "Rock", albumId: 3 },
  { id: 304, name: "Lithium", composer: "Kurt Cobain", duration: "04:17", mediaType: "MPEG audio file", unitPrice: 0.99, genre: "Rock", albumId: 3 },
  { id: 305, name: "Polly", composer: "Kurt Cobain", duration: "02:57", mediaType: "MPEG audio file", unitPrice: 0.99, genre: "Rock", albumId: 3 },

  // Tracks for Master of Puppets (Album 4)
  { id: 401, name: "Battery", composer: "James Hetfield, Lars Ulrich", duration: "05:12", mediaType: "MPEG audio file", unitPrice: 0.99, genre: "Metal", albumId: 4 },
  { id: 402, name: "Master of Puppets", composer: "James Hetfield, Lars Ulrich, Cliff Burton, Kirk Hammett", duration: "08:35", mediaType: "MPEG audio file", unitPrice: 0.99, genre: "Metal", albumId: 4 },
  { id: 403, name: "Welcome Home (Sanitarium)", composer: "James Hetfield, Lars Ulrich, Kirk Hammett", duration: "06:27", mediaType: "MPEG audio file", unitPrice: 0.99, genre: "Metal", albumId: 4 },
  { id: 404, name: "Disposable Heroes", composer: "James Hetfield, Lars Ulrich, Kirk Hammett", duration: "08:16", mediaType: "MPEG audio file", unitPrice: 0.99, genre: "Metal", albumId: 4 },
  { id: 405, name: "Damage, Inc.", composer: "James Hetfield, Lars Ulrich, Cliff Burton, Kirk Hammett", duration: "05:32", mediaType: "MPEG audio file", unitPrice: 0.99, genre: "Metal", albumId: 4 },

  // Tracks for Las Cuatro Estaciones (Album 5)
  { id: 501, name: "La Primavera - Allegro", composer: "Antonio Vivaldi", duration: "03:15", mediaType: "Protected AAC audio file", unitPrice: 0.99, genre: "Classical", albumId: 5 },
  { id: 502, name: "El Verano - Presto", composer: "Antonio Vivaldi", duration: "02:45", mediaType: "Protected AAC audio file", unitPrice: 0.99, genre: "Classical", albumId: 5 },
  { id: 503, name: "El Otoño - Allegro", composer: "Antonio Vivaldi", duration: "03:40", mediaType: "Protected AAC audio file", unitPrice: 0.99, genre: "Classical", albumId: 5 },
  { id: 504, name: "El Invierno - Largo", composer: "Antonio Vivaldi", duration: "02:10", mediaType: "Protected AAC audio file", unitPrice: 0.99, genre: "Classical", albumId: 5 },

  // Tracks for Random Access Memories (Album 6)
  { id: 601, name: "Get Lucky", composer: "Thomas Bangalter, Guy-Manuel de Homem-Christo, Pharrell Williams", duration: "06:09", mediaType: "MPEG audio file", unitPrice: 0.99, genre: "Electronic", albumId: 6 },
  { id: 602, name: "Lose Yourself to Dance", composer: "Thomas Bangalter, Guy-Manuel de Homem-Christo, Pharrell Williams", duration: "05:53", mediaType: "MPEG audio file", unitPrice: 0.99, genre: "Electronic", albumId: 6 },
  { id: 603, name: "Instant Crush", composer: "Thomas Bangalter, Guy-Manuel, Julian Casablancas", duration: "05:37", mediaType: "MPEG audio file", unitPrice: 0.99, genre: "Electronic", albumId: 6 },
  { id: 604, name: "Give Life Back to Music", composer: "Thomas Bangalter, Guy-Manuel de Homem-Christo", duration: "04:34", mediaType: "MPEG audio file", unitPrice: 0.99, genre: "Electronic", albumId: 6 },
  { id: 605, name: "Giorgio by Moroder", composer: "Thomas Bangalter, Guy-Manuel de Homem-Christo, Giorgio Moroder", duration: "09:04", mediaType: "MPEG audio file", unitPrice: 0.99, genre: "Electronic", albumId: 6 },
  { id: 606, name: "Contact", composer: "Thomas Bangalter, Guy-Manuel de Homem-Christo, Stéphane Quême", duration: "06:23", mediaType: "MPEG audio file", unitPrice: 0.99, genre: "Electronic", albumId: 6 },
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 1,
    firstName: "Eduardo",
    lastName: "Santos",
    email: "eduardo.santos@embraer.com.br",
    company: "Embraer S.A.",
    country: "Brasil",
    phone: "+55 (12) 3927-1000",
    supportRepId: 3,
  },
  {
    id: 2,
    firstName: "Helena",
    lastName: "Holý",
    email: "hholy@gmail.cz",
    company: "",
    country: "República Checa",
    phone: "+420 2 3456 7890",
    supportRepId: 3,
  },
  {
    id: 3,
    firstName: "Luis",
    lastName: "Almeida",
    email: "luis.almeida@jet.com.br",
    company: "Jet Blue",
    country: "Brasil",
    phone: "+55 (21) 3225-8899",
    supportRepId: 4,
  },
  {
    id: 4,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@corporation.com",
    company: "Apple Inc.",
    country: "USA",
    phone: "+1 (408) 996-1010",
    supportRepId: 4,
  },
  {
    id: 5,
    firstName: "François",
    lastName: "Tremblay",
    email: "ftremblay@gmail.ca",
    company: "",
    country: "Canadá",
    phone: "+1 (514) 721-4711",
    supportRepId: 5,
  },
  {
    id: 6,
    firstName: "Mark",
    lastName: "Philips",
    email: "mphilips@yahoo.com",
    company: "Philips Electronics",
    country: "USA",
    phone: "+1 (212) 555-5555",
    supportRepId: 5,
  },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 1,
    firstName: "Andrew",
    lastName: "Adams",
    title: "Gerente General",
    hireDate: "2016-08-14",
    email: "andrew@musicstore.com",
    clientsCount: 0,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    firstName: "Nancy",
    lastName: "Edwards",
    title: "Gerente de Ventas",
    reportsToId: 1,
    reportsToName: "Andrew Adams",
    hireDate: "2016-10-01",
    email: "nancy@musicstore.com",
    clientsCount: 0,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    firstName: "Jane",
    lastName: "Peacock",
    title: "Agente de Soporte de Ventas",
    reportsToId: 2,
    reportsToName: "Nancy Edwards",
    hireDate: "2017-04-01",
    email: "jane@musicstore.com",
    clientsCount: 2,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60",
  },
  {
    id: 4,
    firstName: "Margaret",
    lastName: "Park",
    title: "Agente de Soporte de Ventas",
    reportsToId: 2,
    reportsToName: "Nancy Edwards",
    hireDate: "2017-05-03",
    email: "margaret@musicstore.com",
    clientsCount: 2,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60",
  },
  {
    id: 5,
    firstName: "Steve",
    lastName: "Johnson",
    title: "Agente de Soporte de Ventas",
    reportsToId: 2,
    reportsToName: "Nancy Edwards",
    hireDate: "2017-10-17",
    email: "steve@musicstore.com",
    clientsCount: 2,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60",
  },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: "INV-00104",
    invoiceDate: "2025-05-12",
    billingCity: "São José dos Campos",
    billingCountry: "Brasil",
    total: 3.96,
    lines: [
      { id: 501, trackName: "So What", unitPrice: 0.99, quantity: 1 },
      { id: 502, trackName: "Blue in Green", unitPrice: 0.99, quantity: 1 },
      { id: 503, trackName: "Giorgio by Moroder", unitPrice: 0.99, quantity: 1 },
      { id: 504, trackName: "Get Lucky", unitPrice: 0.99, quantity: 1 },
    ],
  },
  {
    id: "INV-00105",
    invoiceDate: "2025-05-14",
    billingCity: "Praga",
    billingCountry: "República Checa",
    total: 2.97,
    lines: [
      { id: 505, trackName: "Smells Like Teen Spirit", unitPrice: 0.99, quantity: 1 },
      { id: 506, trackName: "Come as You Are", unitPrice: 0.99, quantity: 1 },
      { id: 507, trackName: "Lithium", unitPrice: 0.99, quantity: 1 },
    ],
  },
  {
    id: "INV-00106",
    invoiceDate: "2025-05-18",
    billingCity: "São José dos Campos",
    billingCountry: "Brasil",
    total: 4.95,
    lines: [
      { id: 508, trackName: "Battery", unitPrice: 0.99, quantity: 1 },
      { id: 509, trackName: "Master of Puppets", unitPrice: 0.99, quantity: 1 },
      { id: 510, trackName: "Welcome Home (Sanitarium)", unitPrice: 0.99, quantity: 1 },
      { id: 511, trackName: "Disposable Heroes", unitPrice: 0.99, quantity: 1 },
      { id: 512, trackName: "Damage, Inc.", unitPrice: 0.99, quantity: 1 },
    ],
  },
  {
    id: "INV-00107",
    invoiceDate: "2025-05-20",
    billingCity: "Cupertino",
    billingCountry: "USA",
    total: 1.98,
    lines: [
      { id: 513, trackName: "Hells Bells", unitPrice: 0.99, quantity: 1 },
      { id: 514, trackName: "Back in Black", unitPrice: 0.99, quantity: 1 },
    ],
  },
  {
    id: "INV-00108",
    invoiceDate: "2025-05-22",
    billingCity: "Montreal",
    billingCountry: "Canadá",
    total: 3.96,
    lines: [
      { id: 515, trackName: "La Primavera - Allegro", unitPrice: 0.99, quantity: 1 },
      { id: 516, trackName: "El Verano - Presto", unitPrice: 0.99, quantity: 1 },
      { id: 517, trackName: "El Otoño - Allegro", unitPrice: 0.99, quantity: 1 },
      { id: 518, trackName: "El Invierno - Largo", unitPrice: 0.99, quantity: 1 },
    ],
  },
];

// Playlists structure
export const INITIAL_PLAYLISTS: Playlist[] = [
  { id: 1, name: "Midnight Jazz", trackCount: 4 },
  { id: 2, name: "Favoritos de Rock", trackCount: 3 },
  { id: 3, name: "Coding Focus", trackCount: 5 },
  { id: 4, name: "Clásicos del Metal", trackCount: 2 },
];

export const PLAYLIST_TRACKS_MAP: Record<number, number[]> = {
  1: [101, 102, 103, 104], // Jazz tracks
  2: [201, 203, 301],      // Hells Bells, Back in Black, Teen Spirit
  3: [601, 603, 604, 103, 501], // Electro, Jazz & Classical
  4: [401, 402],           // Metal tracks
};

export const INITIAL_ARTISTS: Artist[] = [
  { id: 1, name: "Miles Davis" },
  { id: 2, name: "AC/DC" },
  { id: 3, name: "Nirvana" },
  { id: 4, name: "Metallica" },
  { id: 5, name: "Vivaldi" },
  { id: 6, name: "Daft Punk" },
  { id: 7, name: "Led Zeppelin" },
  { id: 8, name: "Coldplay" },
  { id: 9, name: "Deep Purple" },
];

export const INITIAL_GENRES: Genre[] = [
  { id: 1, name: "Rock" },
  { id: 2, name: "Jazz" },
  { id: 3, name: "Metal" },
  { id: 4, name: "Classical" },
  { id: 5, name: "Electronic" },
  { id: 6, name: "Pop" },
  { id: 7, name: "Blues" },
  { id: 8, name: "Reggae" },
];
