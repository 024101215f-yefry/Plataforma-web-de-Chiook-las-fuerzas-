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
  
  // Calculate client metrics in Peruvian Soles (S/.)
  const totalSpent = invoices.reduce((acc, inv) => acc + inv.total, 0);
  const totalTracksPurchased = invoices.reduce((acc, inv) => 
    acc + inv.lines.reduce((lAcc, l) => lAcc + l.quantity, 0), 0
  );

  const playlistCount = playlists.length;
  const latestInvoice = invoices.length > 0 ? invoices[invoices.length - 1] : null;

  const kpis = [
    {
      id: 'spent',
      label: 'Monto Comprado',
      value: `S/. ${totalSpent.toFixed(2)}`,
      desc: 'Licencias en Chinook',
      icon: DollarSign,
      color: 'bg-emerald-50/50 border-emerald-100 text-emerald-600',
      iconColor: 'text-emerald-600 bg-white border border-emerald-100',
    },
    {
      id: 'purchased',
      label: 'Temas Adquiridos',
      value: `${totalTracksPurchased} pistas`,
      desc: 'Alta calidad digital',
      icon: Music,
      color: 'bg-blue-50/50 border-blue-105 text-blue-600',
      iconColor: 'text-blue-600 bg-white border border-blue-100',
    },
    {
      id: 'playlists',
      label: 'Mis Playlists',
      value: `${playlistCount} Colecciones`,
      desc: 'Listas personalizadas',
      icon: ListMusic,
      color: 'bg-amber-50/50 border-amber-100 text-amber-600',
      iconColor: 'text-amber-600 bg-white border border-amber-100',
    },
    {
      id: 'invoices',
      label: 'Última Factura',
      value: latestInvoice ? `S/. ${latestInvoice.total.toFixed(2)}` : 'S/. 0.00',
      desc: latestInvoice ? latestInvoice.id : 'Sin compras aún',
      icon: FileText,
      color: 'bg-purple-50/50 border-purple-100 text-[#7F77DD]',
      iconColor: 'text-purple-600 bg-white border border-purple-100',
    },
  ];

  const popularGenres = [
    { name: 'Rock alternativo & Metal', percent: 45, count: 11, color: 'bg-red-500' },
    { name: 'Modern & Classic Jazz', percent: 25, count: 6, color: 'bg-blue-500' },
    { name: 'Música Electrónica / Synth', percent: 20, count: 5, color: 'bg-indigo-500' },
    { name: 'Música Clásica', percent: 10, count: 4, color: 'bg-amber-500' },
  ];

  return (
    <div id="client-dashboard-view" className="space-y-6 font-sans">
      
      {/* Welcome Hero Panel with rich blue styling */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-650 rounded-3xl p-7 text-white shadow-md relative shadow-blue-100 select-none">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-white/5 blur-[50px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-2xl text-left">
          <span className="text-[10px] font-bold text-blue-100 tracking-wider uppercase bg-white/10 px-3 py-1 rounded-full border border-white/10">
            Socio MusicStore VIP
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-3 leading-tight tracking-tight">
            Accede al catálogo global de Chinook DB
          </h2>
          <p className="text-blue-100 mt-2 text-xs sm:text-sm max-w-lg leading-relaxed">
            Bienvenido a tu panel de control de sonido digital. Escucha y administra tus canciones del catálogo académico, genera facturas virtuales en soles peruanos con descarga de audio.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('music-catalog')}
              className="px-4 py-2.5 bg-white hover:bg-gray-100 cursor-pointer text-blue-750 text-blue-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition duration-150 shadow-sm"
            >
              Explorar Catálogo
              <ArrowUpRight className="w-4 h-4 text-blue-650" />
            </button>
            <button
              onClick={() => onNavigate('my-playlists')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 cursor-pointer text-white rounded-xl text-xs transition font-semibold"
            >
              Mis Playlists Personales
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
              className={`p-5 rounded-2xl bg-white border ${kpi.color} shadow-sm flex items-center justify-between group hover:shadow-md transition text-left`}
            >
              <div>
                <span className="text-[11px] font-bold text-gray-500 block mb-1 uppercase tracking-wider">{kpi.label}</span>
                <span className="text-2xl font-black text-gray-900 block tracking-tight">{kpi.value}</span>
                <span className="text-[10px] font-bold text-gray-400 mt-0.5 block">{kpi.desc}</span>
              </div>
              <div className={`p-2.5 rounded-xl ${kpi.iconColor} group-hover:scale-105 transition duration-300 shrink-0 shadow-sm`}>
                <Icon className="w-5 h-5" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recommended & Recent Activity & Popular genres Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recommended Tracks Panel */}
        <div className="col-span-1 lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2 select-none">
                <Star className="w-4.5 h-4.5 text-blue-600" />
                Recomendaciones Temáticas para Ti
              </h3>
              <span className="text-xs text-gray-450 font-semibold bg-gray-100 px-2.5 py-0.5 rounded-full text-gray-600 select-none">Chinook Best-Sellers</span>
            </div>

            <div className="space-y-3">
              {recommendedTracks.map((track, i) => {
                const isAlreadyInCart = cartItems.some((c) => c.id === track.id);
                return (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-150 hover:bg-slate-100/50 transition-all group text-left"
                  >
                    <div className="flex items-center gap-3 pr-2 truncate">
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-250/60 text-gray-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold group-hover:text-blue-600 select-none">
                        {i + 1}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-gray-905 text-gray-900 truncate">{track.name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{track.composer || 'Desconocido'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-gray-400 pr-2 border-r border-gray-200 font-mono select-none">{track.duration}</span>
                      <span className="text-xs font-bold text-blue-600 font-mono pr-2">S/. {track.unitPrice.toFixed(2)}</span>
                      
                      {/* Play Action */}
                      <button
                        onClick={() => onPlayTrack(track)}
                        className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                        title="Escuchar muestra"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>

                      {/* Buy Component */}
                      <button
                        onClick={() => onAddTrackToCart(track)}
                        disabled={isAlreadyInCart}
                        className={`p-1.5 rounded-lg transition cursor-pointer border ${
                          isAlreadyInCart 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100'
                        }`}
                        title={isAlreadyInCart ? "En el carrito de compras" : "Agregar canción"}
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
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1.5 mx-auto transition cursor-pointer"
            >
              Ver menú de catálogo completo y aplicar filtros
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sidebar Info columns */}
        <div className="space-y-6">
          
          {/* Plan Premium promotion card */}
          <div className="bg-white border border-purple-200 rounded-3xl p-5 relative overflow-hidden bg-gradient-to-b from-purple-50/50 to-white shadow-sm text-left select-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 blur-[45px] pointer-events-none rounded-full" />
            <div className="flex gap-2 items-center mb-3">
              <Sparkles className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
              <span className="font-extrabold text-[10px] uppercase tracking-wider text-amber-600">MENSUALIDAD PREMIUM CHINOOK GOLD</span>
            </div>
            <p className="text-sm font-bold text-gray-900 mb-1.5">Descargas ilimitadas de por vida</p>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Por un abono académico único de <strong>S/. 19.90</strong>, accede a descargas de MP3 premium de 320 kbps y FLAC de todas las canciones disponibles en Chinook.
            </p>
            <button
              onClick={() => {
                alert("¡Felicidades! Se ha activado la simulación Premium Gold para tu cuenta. Disfruta del audio de alta definición.");
              }}
              className="w-full text-center py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-gray-950 font-extrabold text-xs rounded-xl shadow transition-all cursor-pointer border border-transparent"
            >
              Activar Plan VIP
            </button>
          </div>

          {/* Popular Genres breakdown */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-left select-none">
            <h3 className="font-bold text-sm text-gray-900 mb-4">Consumición por Categorías</h3>
            <div className="space-y-3.5">
              {popularGenres.map((genre) => (
                <div key={genre.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-600 truncate">{genre.name}</span>
                    <span className="text-gray-400 font-mono font-bold">{genre.percent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden block">
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
