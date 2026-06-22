import { useState, useEffect } from 'react';
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
} from './data';
import { UserSession, ViewType, Track, Album, Client, Invoice, Employee, Playlist, Artist, Genre } from './types';
import NavBar from './components/NavBar';
import AdminSidebar from './components/AdminSidebar';
import Login from './components/Login';
import ClientDashboard from './components/ClientDashboard';
import MusicCatalog from './components/MusicCatalog';
import AlbumDetail from './components/AlbumDetail';
import MyInvoices from './components/MyInvoices';
import MyPlaylists from './components/MyPlaylists';
import AdminDashboard from './components/AdminDashboard';
import ClientManagement from './components/ClientManagement';
import SalesReport from './components/SalesReport';
import EmployeeManagement from './components/EmployeeManagement';
import AdminAlbums from './components/AdminAlbums';
import AdminArtists from './components/AdminArtists';
import AdminGenres from './components/AdminGenres';
import AdminTracks from './components/AdminTracks';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  // Session states
  const [session, setSession] = useState<UserSession | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('login');
  
  // Database mock states to enable complete local CRUD persistence of lists
  const [albums, setAlbums] = useState<Album[]>(INITIAL_ALBUMS);
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);
  const [playlistTracksMap, setPlaylistTracksMap] = useState<Record<number, number[]>>(PLAYLIST_TRACKS_MAP);
  const [artists, setArtists] = useState<Artist[]>(INITIAL_ARTISTS);
  const [genres, setGenres] = useState<Genre[]>(INITIAL_GENRES);

  // Database Connection Indicator
  const [dbStatus, setDbStatus] = useState({ connected: false, mode: 'sandbox-mock' });

  // Load resources from Neon Postgres database via server-side APIs on mount
  useEffect(() => {
    fetch('/api/db-status')
      .then(res => res.json())
      .then(status => {
        setDbStatus(status);
        console.log(`[MusicStore Web] Database connection status:`, status);
      })
      .catch(() => {});

    Promise.all([
      fetch('/api/artists').then(r => r.ok ? r.json() : null),
      fetch('/api/albums').then(r => r.ok ? r.json() : null),
      fetch('/api/tracks').then(r => r.ok ? r.json() : null),
      fetch('/api/clients').then(r => r.ok ? r.json() : null),
      fetch('/api/employees').then(r => r.ok ? r.json() : null),
      fetch('/api/invoices').then(r => r.ok ? r.json() : null),
      fetch('/api/playlists').then(r => r.ok ? r.json() : null),
      fetch('/api/genres').then(r => r.ok ? r.json() : null)
    ])
    .then(([artistsData, albumsData, tracksData, clientsData, employeesData, invoicesData, playlistsData, genresData]) => {
      if (artistsData && artistsData.length > 0) setArtists(artistsData);
      if (albumsData && albumsData.length > 0) setAlbums(albumsData);
      if (tracksData && tracksData.length > 0) setTracks(tracksData);
      if (clientsData && clientsData.length > 0) setClients(clientsData);
      if (employeesData && employeesData.length > 0) setEmployees(employeesData);
      if (invoicesData && invoicesData.length > 0) setInvoices(invoicesData);
      if (playlistsData && playlistsData.length > 0) setPlaylists(playlistsData);
      if (genresData && genresData.length > 0) setGenres(genresData);
    })
    .catch(err => {
      console.warn('Backend connection unavailable. Operating on sandbox mock states.', err);
    });
  }, []);

  // Cart and Audio Player states
  const [cartItems, setCartItems] = useState<Track[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);
  const [nowPlaying, setNowPlaying] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Authorization routing trigger
  const handleLogin = (user: UserSession) => {
    setSession(user);
    if (user.role === 'cliente') {
      setCurrentView('client-dashboard');
    } else {
      setCurrentView('admin-dashboard');
    }
  };

  const handleLogout = () => {
    setSession(null);
    setCurrentView('login');
    setCartItems([]);
    setNowPlaying(null);
    setIsPlaying(false);
  };

  // Nav actions
  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
  };

  const handleSelectAlbum = (albumId: number) => {
    setSelectedAlbumId(albumId);
    setCurrentView('album-detail');
  };

  // Cart operations
  const handleAddTrackToCart = (track: Track) => {
    const alreadyInCart = cartItems.some((item) => item.id === track.id);
    if (alreadyInCart) return;
    setCartItems([...cartItems, track]);
  };

  const handleRemoveFromCart = (trackId: number) => {
    setCartItems(cartItems.filter((item) => item.id !== trackId));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_cliente: 1, // Default customer ID
        billingCity: "Cusco",
        billingCountry: "Perú",
        cartItems: cartItems
      })
    })
    .then(r => r.json())
    .then(newInvoice => {
      setInvoices([newInvoice, ...invoices]);
      
      // Auto-update playlists with purchased tracks
      if (playlists.length > 1) {
        const targetPlId = 2; // Favoritos del Rock by default
        const listTrackIds = playlistTracksMap[targetPlId] || [];
        const newIds = cartItems.map(c => c.id).filter(id => !listTrackIds.includes(id));
        
        if (newIds.length > 0) {
          const updatedMap = {
            ...playlistTracksMap,
            [targetPlId]: [...listTrackIds, ...newIds]
          };
          setPlaylistTracksMap(updatedMap);
          setPlaylists(playlists.map(p => p.id === targetPlId ? { ...p, trackCount: p.trackCount + newIds.length } : p));
        }
      }

      setCartItems([]);
      alert(`¡Compra procesada con éxito! Se ha generado tu comprobante ${newInvoice.id} en el historial de facturas.`);
      setCurrentView('my-invoices');
    })
    .catch(() => {
      const total = cartItems.reduce((acc, item) => acc + item.unitPrice, 0);
      const invoiceIdNum = invoices.length + 105;
      const formattedId = `INV-00${invoiceIdNum}`;

      const newInvoiceLines = cartItems.map((track, i) => ({
        id: 5000 + i + invoiceIdNum,
        trackName: track.name,
        unitPrice: track.unitPrice,
        quantity: 1,
      }));

      const newInvoice: Invoice = {
        id: formattedId,
        invoiceDate: new Date().toISOString().split('T')[0],
        billingCity: "Cusco",
        billingCountry: "Perú",
        total: Number(total.toFixed(2)),
        lines: newInvoiceLines,
      };

      setInvoices([newInvoice, ...invoices]);
      setCartItems([]);
      alert(`¡Compra procesada con éxito en modo Sandbox! Se ha generado tu comprobante ${formattedId} en el historial.`);
      setCurrentView('my-invoices');
    });
  };

  // Playlist state mutations
  const handleCreatePlaylist = (name: string) => {
    fetch('/api/playlists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    .then(r => r.json())
    .then(newPl => {
      setPlaylists([...playlists, newPl]);
      setPlaylistTracksMap({
        ...playlistTracksMap,
        [newPl.id]: [],
      });
    })
    .catch(() => {
      const nextId = playlists.reduce((max, p) => p.id > max ? p.id : max, 0) + 1;
      const newList: Playlist = {
        id: nextId,
        name,
        trackCount: 0,
        isCustom: true,
      };
      setPlaylists([...playlists, newList]);
      setPlaylistTracksMap({
        ...playlistTracksMap,
        [nextId]: [],
      });
    });
  };

  const handleDeletePlaylist = (id: number) => {
    fetch(`/api/playlists/${id}`, { method: 'DELETE' })
    .then(() => {
      setPlaylists(playlists.filter((p) => p.id !== id));
      const newMap = { ...playlistTracksMap };
      delete newMap[id];
      setPlaylistTracksMap(newMap);
    })
    .catch(() => {
      setPlaylists(playlists.filter((p) => p.id !== id));
      const newMap = { ...playlistTracksMap };
      delete newMap[id];
      setPlaylistTracksMap(newMap);
    });
  };

  const handleRemoveTrackFromPlaylist = (playlistId: number, trackId: number) => {
    const tracksList = playlistTracksMap[playlistId] || [];
    const updatedList = tracksList.filter((id) => id !== trackId);
    setPlaylistTracksMap({
      ...playlistTracksMap,
      [playlistId]: updatedList,
    });
    setPlaylists(
      playlists.map((p) =>
        p.id === playlistId ? { ...p, trackCount: updatedList.length } : p
      )
    );
  };

  // Audio Playback simulation
  const handlePlayTrack = (track: Track) => {
    setNowPlaying(track);
    setIsPlaying(true);
  };

  const handleTogglePlaySim = () => {
    if (!nowPlaying && tracks.length > 0) {
      setNowPlaying(tracks[0]);
      setIsPlaying(true);
      return;
    }
    setIsPlaying(!isPlaying);
  };

  // Admin Client operations
  const handleAddClient = (client: Client) => {
    fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client)
    })
    .then(r => r.json())
    .then(newClient => {
      setClients([...clients, newClient]);
    })
    .catch(() => {
      setClients([...clients, client]);
    });
  };

  const handleUpdateClient = (updated: Client) => {
    fetch(`/api/clients/${updated.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
    .then(r => r.json())
    .then(updatedClient => {
      setClients(clients.map((c) => (c.id === updatedClient.id ? updatedClient : c)));
    })
    .catch(() => {
      setClients(clients.map((c) => (c.id === updated.id ? updated : c)));
    });
  };

  const handleDeleteClient = (id: number) => {
    fetch(`/api/clients/${id}`, { method: 'DELETE' })
    .then(() => {
      setClients(clients.filter((c) => c.id !== id));
    })
    .catch(() => {
      setClients(clients.filter((c) => c.id !== id));
    });
  };

  // Admin Album operations
  const handleAddAlbum = (album: Album) => {
    setAlbums([...albums, album]);
  };

  const handleUpdateAlbum = (updated: Album) => {
    setAlbums(albums.map((a) => (a.id === updated.id ? updated : a)));
  };

  const handleDeleteAlbum = (id: number) => {
    setAlbums(albums.filter((a) => a.id !== id));
  };

  // Admin Artist operations
  const handleAddArtist = (artist: Artist) => {
    setArtists([...artists, artist]);
  };

  const handleUpdateArtist = (updated: Artist) => {
    setArtists(artists.map((a) => (a.id === updated.id ? updated : a)));
  };

  const handleDeleteArtist = (id: number) => {
    setArtists(artists.filter((a) => a.id !== id));
  };

  // Admin Genre operations
  const handleAddGenre = (genre: Genre) => {
    setGenres([...genres, genre]);
  };

  const handleUpdateGenre = (updated: Genre) => {
    setGenres(genres.map((g) => (g.id === updated.id ? updated : g)));
  };

  const handleDeleteGenre = (id: number) => {
    setGenres(genres.filter((g) => g.id !== id));
  };

  // Admin Track operations
  const handleAddTrack = (track: Track) => {
    setTracks([...tracks, track]);
    setAlbums(albums.map(al => al.id === track.albumId ? { ...al, tracksCount: al.tracksCount + 1 } : al));
  };

  const handleUpdateTrack = (updated: Track) => {
    setTracks(tracks.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleDeleteTrack = (id: number) => {
    const track = tracks.find(t => t.id === id);
    setTracks(tracks.filter((t) => t.id !== id));
    if (track) {
      setAlbums(albums.map(al => al.id === track.albumId ? { ...al, tracksCount: Math.max(0, al.tracksCount - 1) } : al));
    }
  };

  // Admin Employee operations
  const handleAddEmployee = (emp: Employee) => {
    setEmployees([...employees, emp]);
  };

  const handleDeleteEmployee = (id: number) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  // Select recommended tracks for client dashboard
  const clientRecommendedTracks = tracks.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Upper Navigation Menu */}
      <NavBar
        currentView={currentView}
        onNavigate={handleNavigate}
        session={session}
        onLogout={handleLogout}
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {/* Main Container */}
      <div className={`flex-1 flex flex-col ${session ? 'pt-[72px]' : ''}`}>
        {session && session.role === 'admin' ? (
          /* Admin views with fixed Sidebar */
          <div className="w-full max-w-[1440px] mx-auto flex flex-row items-stretch flex-1">
            <AdminSidebar currentView={currentView} onNavigate={handleNavigate} />
            <main className="flex-1 p-6 md:p-8 bg-[#f8fafc] overflow-x-hidden min-h-[calc(100vh-142px)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  {currentView === 'admin-dashboard' && (
                    <AdminDashboard
                      invoices={invoices}
                      clients={clients}
                      tracks={tracks}
                      employees={employees}
                      onNavigate={handleNavigate}
                    />
                  )}
                  {currentView === 'client-management' && (
                    <ClientManagement
                      clients={clients}
                      employees={employees}
                      invoices={invoices}
                      onAddClient={handleAddClient}
                      onUpdateClient={handleUpdateClient}
                      onDeleteClient={handleDeleteClient}
                    />
                  )}
                  {currentView === 'sales-report' && <SalesReport />}
                  {currentView === 'employee-management' && (
                    <EmployeeManagement
                      employees={employees}
                      onAddEmployee={handleAddEmployee}
                      onDeleteEmployee={handleDeleteEmployee}
                    />
                  )}
                  {currentView === 'admin-albums' && (
                    <AdminAlbums
                      albums={albums}
                      artists={artists}
                      onAddAlbum={handleAddAlbum}
                      onUpdateAlbum={handleUpdateAlbum}
                      onDeleteAlbum={handleDeleteAlbum}
                    />
                  )}
                  {currentView === 'admin-artists' && (
                    <AdminArtists
                      artists={artists}
                      onAddArtist={handleAddArtist}
                      onUpdateArtist={handleUpdateArtist}
                      onDeleteArtist={handleDeleteArtist}
                    />
                  )}
                  {currentView === 'admin-genres' && (
                    <AdminGenres
                      genres={genres}
                      onAddGenre={handleAddGenre}
                      onUpdateGenre={handleUpdateGenre}
                      onDeleteGenre={handleDeleteGenre}
                    />
                  )}
                  {currentView === 'admin-tracks' && (
                    <AdminTracks
                      tracks={tracks}
                      albums={albums}
                      genres={genres}
                      onAddTrack={handleAddTrack}
                      onUpdateTrack={handleUpdateTrack}
                      onDeleteTrack={handleDeleteTrack}
                      onPlayTrack={handlePlayTrack}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        ) : (
          /* Client or Unauthenticated (Login) views */
          <main className={`flex-1 ${session ? 'p-6 md:p-8 w-full max-w-[1440px] mx-auto' : ''}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {currentView === 'login' && <Login onLogin={handleLogin} />}
                
                {currentView === 'client-dashboard' && (
                  <ClientDashboard
                    invoices={invoices}
                    playlists={playlists}
                    recommendedTracks={clientRecommendedTracks}
                    onPlayTrack={handlePlayTrack}
                    onAddTrackToCart={handleAddTrackToCart}
                    onNavigate={handleNavigate}
                    cartItems={cartItems}
                  />
                )}
                {currentView === 'music-catalog' && (
                  <MusicCatalog
                    albums={albums}
                    onSelectAlbum={handleSelectAlbum}
                    onNavigate={handleNavigate}
                  />
                )}
                {currentView === 'album-detail' && (
                  <AlbumDetail
                    albumId={selectedAlbumId}
                    albums={albums}
                    tracks={tracks}
                    onPlayTrack={handlePlayTrack}
                    onAddTrackToCart={handleAddTrackToCart}
                    onNavigate={handleNavigate}
                    cartItems={cartItems}
                  />
                )}
                {currentView === 'my-invoices' && (
                  <MyInvoices invoices={invoices} />
                )}
                {currentView === 'my-playlists' && (
                  <MyPlaylists
                    playlists={playlists}
                    tracks={tracks}
                    playlistTracksMap={playlistTracksMap}
                    onCreatePlaylist={handleCreatePlaylist}
                    onDeletePlaylist={handleDeletePlaylist}
                    onRemoveTrackFromPlaylist={handleRemoveTrackFromPlaylist}
                    onPlayTrack={handlePlayTrack}
                    nowPlaying={nowPlaying}
                    onTogglePlay={handleTogglePlaySim}
                    isPlaying={isPlaying}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        )}
      </div>

      {/* Global Footer (Universidad Andina del Cusco Required) */}
      <footer className="py-4 bg-white border-t border-gray-200 text-center text-xs text-gray-500 font-sans z-10 select-none shrink-0">
        <div className="w-full max-w-[1440px] mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>MusicStore Web © 2025 | Universidad Andina del Cusco</span>
          <span className="text-[10px] text-gray-400 font-semibold font-mono">Simulación de Producción Académica • Chinook Database</span>
        </div>
      </footer>
    </div>
  );
}
