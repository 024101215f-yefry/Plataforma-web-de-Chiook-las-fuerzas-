import chinookData from './chinook-data.json';
import { Album, Track, Client, Invoice, Employee, Playlist, Artist, Genre } from './types';

const data = chinookData as {
  artists: Artist[];
  genres: Genre[];
  albums: Album[];
  tracks: Track[];
  clients: Client[];
  employees: Employee[];
  invoices: Invoice[];
  playlists: (Omit<Playlist, 'isCustom'>)[];
  playlistTracksMap: Record<number, number[]>;
};

export const INITIAL_ALBUMS: Album[] = data.albums;
export const INITIAL_TRACKS: Track[] = data.tracks;
export const INITIAL_CLIENTS: Client[] = data.clients;
export const INITIAL_EMPLOYEES: Employee[] = data.employees;
export const INITIAL_INVOICES: Invoice[] = data.invoices;
export const INITIAL_PLAYLISTS: Playlist[] = data.playlists;
export const PLAYLIST_TRACKS_MAP: Record<number, number[]> = data.playlistTracksMap;
export const INITIAL_ARTISTS: Artist[] = data.artists;
export const INITIAL_GENRES: Genre[] = data.genres;
