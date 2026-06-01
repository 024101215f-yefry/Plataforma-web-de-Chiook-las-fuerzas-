export interface Track {
  id: number;
  name: string;
  composer: string;
  duration: string; // "MM:SS" format
  mediaType: string;
  unitPrice: number;
  genre: string;
  albumId: number;
}

export interface Album {
  id: number;
  name: string;
  artistName: string;
  coverUrl: string;
  genre: string;
  releaseYear: number;
  tracksCount: number;
  price: number;
}

export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  country: string;
  phone: string;
  supportRepId: number; // reference to Employee ID
}

export interface InvoiceLine {
  id: number;
  trackName: string;
  unitPrice: number;
  quantity: number;
}

export interface Invoice {
  id: string; // #INV-XXXX
  invoiceDate: string;
  billingCity: string;
  billingCountry: string;
  total: number;
  lines: InvoiceLine[];
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  title: string;
  reportsToId?: number;
  reportsToName?: string;
  hireDate: string;
  email: string;
  clientsCount: number;
  avatarUrl: string;
}

export interface Playlist {
  id: number;
  name: string;
  trackCount: number;
  isCustom?: boolean;
}

export type ViewType =
  | 'login'
  | 'client-dashboard'
  | 'music-catalog'
  | 'album-detail'
  | 'my-invoices'
  | 'my-playlists'
  | 'admin-dashboard'
  | 'client-management'
  | 'sales-report'
  | 'employee-management';

export interface UserSession {
  role: 'cliente' | 'admin';
  name: string;
}
