import { useState } from 'react';
import { 
  INITIAL_ALBUMS, 
  INITIAL_TRACKS, 
  INITIAL_CLIENTS, 
  INITIAL_EMPLOYEES, 
  INITIAL_INVOICES, 
  INITIAL_PLAYLISTS, 
  PLAYLIST_TRACKS_MAP 
} from './data';
import { UserSession, ViewType, Track, Album, Client, Invoice, Employee, Playlist } from './types';
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
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  // Session states
  const [session, setSession] = useState<UserSession | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('login');
  
  // Database mock states to enable complete local CRUD persistence of lists
  const [albums] = useState<Album[]>(INITIAL_ALBUMS);
  const [tracks] = useState<Track[]>(INITIAL_TRACKS);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);
  const [playlistTracksMap, setPlaylistTracksMap] = useState<Record<number, number[]>>(PLAYLIST_TRACKS_MAP);

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
      billingCity: "São José dos Campos",
      billingCountry: "Brasil",
      total: Number(total.toFixed(2)),
      lines: newInvoiceLines,
    };

    setInvoices([...invoices, newInvoice]);
    
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
    alert(`¡Compra procesada con éxito! Se ha generado tu comprobante ${formattedId} en el historial de facturas.`);
    setCurrentView('my-invoices');
  };

  // Playlist state mutations
  const handleCreatePlaylist = (name: string) => {
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
  };

  const handleDeletePlaylist = (id: number) => {
    setPlaylists(playlists.filter((p) => p.id !== id));
    const newMap = { ...playlistTracksMap };
    delete newMap[id];
    setPlaylistTracksMap(newMap);
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
    setClients([...clients, client]);
  };

  const handleUpdateClient = (updated: Client) => {
    setClients(clients.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteClient = (id: number) => {
    setClients(clients.filter((c) => c.id !== id));
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
    <div className="min-h-screen bg-[#1a1a2e] text-white flex flex-col font-sans selection:bg-[#7F77DD] selection:text-white">
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
            <main className="flex-1 p-6 md:p-8 bg-[#15152a] overflow-x-hidden min-h-[calc(100vh-142px)]">
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
      <footer className="py-4 bg-[#10101e] border-t border-white/5 text-center text-xs text-gray-500 font-sans z-10 select-none shrink-0">
        <div className="w-full max-w-[1440px] mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>MusicStore Web © 2025 | Universidad Andina del Cusco</span>
          <span className="text-[10px] text-gray-600 font-mono">Simulación de Producción Académica • Chinook Database</span>
        </div>
      </footer>
    </div>
  );
}
