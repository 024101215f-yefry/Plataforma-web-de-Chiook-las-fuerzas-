import { motion } from 'motion/react';
import { DollarSign, Music, ListMusic, FileText, ArrowUpRight, Play, Star, Sparkles, Plus, Check } from 'lucide-react';
import { Invoice, Playlist, Track, ViewType } from '../types';

interface ClientDashboardProps {
  invoices: Invoice[];
  playlists: Playlist[];
  recommendedTracks: Track[];
  onPlayTrack: (track: Track) => void;
  onAddTrackToCart: (track: Track) => void;
  onNavigate: (view: ViewType) => void;
  cartItems: Track[];
}

export default function ClientDashboard({
  invoices,
  playlists,
  recommendedTracks,
  onPlayTrack,
  onAddTrackToCart,
  onNavigate,
  cartItems,
}: ClientDashboardProps) {
  
  // Calculate client metrics based on actual state
  const totalSpent = invoices.reduce((acc, inv) => acc + inv.total, 0);
  const totalTracksPurchased = invoices.reduce((acc, inv) => 
    acc + inv.lines.reduce((lAcc, l) => lAcc + l.quantity, 0), 0
  );

  const playlistCount = playlists.length;
  const latestInvoice = invoices.length > 0 ? invoices[invoices.length - 1] : null;

  const kpis = [
    {
      id: 'spent',
      label: 'Total Invertido',
      value: `$${totalSpent.toFixed(2)}`,
      desc: 'En música digital',
      icon: DollarSign,
      color: 'from-emerald-500/20 to-teal-500/5',
      textColor: 'text-emerald-400',
    },
    {
      id: 'purchased',
      label: 'Pistas Adquiridas',
      value: `${totalTracksPurchased} tracks`,
      desc: 'Formato FLAC / MP3',
      icon: Music,
      color: 'from-[#7F77DD]/20 to-purple-500/5',
      textColor: 'text-[#7F77DD]',
    },
    {
      id: 'playlists',
      label: 'Mis Playlists',
      value: `${playlistCount} Listas`,
      desc: 'Biblioteca personal',
      icon: ListMusic,
      color: 'from-amber-500/20 to-orange-500/5',
      textColor: 'text-amber-400',
    },
    {
      id: 'invoices',
      label: 'Última Factura',
      value: latestInvoice ? `$${latestInvoice.total.toFixed(2)}` : 'Ninguna',
      desc: latestInvoice ? latestInvoice.id : 'Sin compras aún',
      icon: FileText,
      color: 'from-blue-500/20 to-indigo-500/5',
      textColor: 'text-blue-400',
    },
  ];

  const popularGenres = [
    { name: 'Rock alternativo & Metal', percent: 45, count: 11, color: 'bg-red-500' },
    { name: 'Modern & Classic Jazz', percent: 25, count: 6, color: 'bg-[#7F77DD]' },
    { name: 'Música Electrónica / Synth', percent: 20, count: 5, color: 'bg-indigo-500' },
    { name: 'Música Clásica', percent: 10, count: 4, color: 'bg-amber-500' },
  ];

  return (
    <div id="client-dashboard-view" className="space-y-8 font-sans">
      
      {/* Welcome Hero Panel */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#171735] to-[#121226] border border-white/5 rounded-2xl p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-[#7F77DD]/10 blur-[90px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-semibold text-[#7F77DD] tracking-wider uppercase bg-[#7F77DD]/10 px-2.5 py-1 rounded-full border border-[#7F77DD]/20">
            Miembro MusicStore Gold
          </span>
          <h2 className="text-3xl font-bold text-white mt-3 leading-tight leading-none tracking-tight">
            ¡Tu biblioteca de sonido es infinita, explórala!
          </h2>
          <p className="text-gray-400 mt-2 text-sm max-w-lg">
            Bienvenido a tu panel de control de sonido digital. Escucha y administra tus playlists importadas de la base de datos Chinook, y descarga nuevas pistas con máxima fidelidad.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('music-catalog')}
              className="px-5 py-2.5 bg-[#7F77DD] hover:bg-[#6e66c4] cursor-pointer text-white font-medium rounded-xl text-xs shadow-lg flex items-center gap-2 transition-all"
            >
              Explorar Catálogo de Música
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('my-playlists')}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 cursor-pointer text-gray-300 hover:text-white rounded-xl border border-white/10 text-xs transition"
            >
              Ver mis Listas de Reproducción
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              key={kpi.id}
              className={`p-5 rounded-2xl bg-gradient-to-br ${kpi.color} border border-white/5 shadow-md flex items-center justify-between group hover:border-[#7F77DD]/20 transition`}
            >
              <div>
                <span className="text-xs font-medium text-gray-400 block mb-1">{kpi.label}</span>
                <span className="text-2xl font-bold text-white block tracking-tight">{kpi.value}</span>
                <span className="text-[10px] text-gray-400 mt-1 block">{kpi.desc}</span>
              </div>
              <div className={`p-3 rounded-xl bg-white/5 ${kpi.textColor} group-hover:scale-110 transition duration-300`}>
                <Icon className="w-5 h-5" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recommended & Recent Activity & Popular genres Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recommended Tracks Panel */}
        <div className="col-span-1 lg:col-span-2 bg-[#111125] border border-white/5 rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-[#7F77DD]" />
                Canciones Recomendadas para Ti
              </h3>
              <span className="text-xs text-gray-400 italic">Basado en tu historial</span>
            </div>

            <div className="space-y-3">
              {recommendedTracks.map((track, i) => {
                const isAlreadyInCart = cartItems.some((c) => c.id === track.id);
                return (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#161630] border border-white/5 hover:border-white/10 hover:bg-[#1b1b3a] transition-all group"
                  >
                    <div className="flex items-center gap-3 pr-2 truncate">
                      <div className="w-8 h-8 rounded-lg bg-[#111122] flex items-center justify-center text-gray-500 shrink-0 font-mono text-xs font-semibold group-hover:text-[#7F77DD]">
                        {i + 1}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-white truncate">{track.name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{track.composer || 'Desconocido'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-gray-500 pr-2 border-r border-white/5 font-mono">{track.duration}</span>
                      <span className="text-xs font-bold text-[#7F77DD] font-mono pr-2">${track.unitPrice.toFixed(2)}</span>
                      
                      {/* Play Action */}
                      <button
                        onClick={() => onPlayTrack(track)}
                        className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-[#7F77DD] transition cursor-pointer"
                        title="Reproducir pista"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>

                      {/* Buy Component */}
                      <button
                        onClick={() => onAddTrackToCart(track)}
                        disabled={isAlreadyInCart}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          isAlreadyInCart 
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' 
                            : 'bg-white/5 text-gray-300 hover:bg-[#7F77DD] hover:text-white'
                        }`}
                        title={isAlreadyInCart ? "En el carrito" : "Agregar canción"}
                      >
                        {isAlreadyInCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 text-center">
            <button
              onClick={() => onNavigate('music-catalog')}
              className="text-xs font-semibold text-[#7F77DD] hover:text-white flex items-center justify-center gap-1.5 mx-auto transition cursor-pointer"
            >
              Ver catálogo completo y filtrar por artista o género
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Sidebar Info column */}
        <div className="space-y-6">
          
          {/* Update to Gold / Premium CTA card */}
          <div className="bg-[#1a1a2e]/60 border border-purple-500/20 rounded-2xl p-5 relative overflow-hidden bg-gradient-to-b from-[#1c1c3a] to-[#121223] shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7F77DD]/20 blur-[40px] pointer-events-none rounded-full" />
            <div className="flex gap-2.5 items-center mb-3">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              <span className="font-bold text-xs uppercase tracking-wider text-amber-400">PLAN PREMIUM CHINOOK GOLD</span>
            </div>
            <p className="text-sm font-bold text-white mb-1.5">Descargas ilimitadas de por vida</p>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Por un pago único de <strong>$19.90</strong>, accede a descargas de FLAC premium de 24 bits de más de 3,000 pistas disponibles en el modelo de base de datos.
            </p>
            <button
              onClick={() => {
                alert("¡Felicidades! Se ha activado la simulación Premium Gold para tu cuenta. Disfruta de la calidad de audio.");
              }}
              className="w-full text-center py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-[#10101e] font-bold text-xs rounded-lg shadow-md transition-all cursor-pointer"
            >
              Adquirir ahora
            </button>
          </div>

          {/* Popular Genres breakdown */}
          <div className="bg-[#111125] border border-white/5 rounded-2xl p-5 shadow-md">
            <h3 className="font-semibold text-sm text-white mb-4">Géneros Populares de tu cuenta</h3>
            <div className="space-y-4">
              {popularGenres.map((genre) => (
                <div key={genre.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-300 font-medium truncate">{genre.name}</span>
                    <span className="text-gray-400 font-mono">{genre.percent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden block">
                    <div className={`h-full rounded-full ${genre.color}`} style={{ width: `${genre.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
