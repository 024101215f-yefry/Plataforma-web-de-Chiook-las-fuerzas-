import { useState, useMemo } from 'react';
import { 
  BarChart3, Globe, Compass, Calendar, Search, 
  MapPin, PieChart, ShieldCheck, Download, CalendarCheck, HelpCircle
} from 'lucide-react';

export default function SalesReport() {
  const [selectedCountry, setSelectedCountry] = useState('Todos');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [dateFrom, setDateFrom] = useState('2025-01-01');
  const [dateTo, setDateTo] = useState('2025-12-31');

  // Static Territory Revenue (Spanish: Ingresos por Territorio)
  const territoryRevenues = [
    { country: 'USA', revenue: 523.50, licenses: 530, percent: 35, color: '#7F77DD' },
    { country: 'Canadá', revenue: 388.40, licenses: 390, percent: 27, color: '#a19bf1' },
    { country: 'Brasil', revenue: 212.10, licenses: 215, percent: 14, color: '#38bdf8' },
    { country: 'Alemania', revenue: 195.30, licenses: 198, percent: 13, color: '#34d399' },
    { country: 'Francia', revenue: 165.20, licenses: 165, percent: 11, color: '#fbbf24' },
  ];

  // Best selling tracks ranking list (Spanish: Pistas más vendidas)
  const bestSellingTracks = [
    { id: 1, name: 'Hells Bells', album: 'Back in Black', genre: 'Rock', quantity: 94, totalAmount: 93.06 },
    { id: 2, name: 'Smells Like Teen Spirit', album: 'Nevermind', genre: 'Rock', quantity: 82, totalAmount: 81.18 },
    { id: 3, name: 'Get Lucky', album: 'Random Access Memories', genre: 'Electronic', quantity: 74, totalAmount: 73.26 },
    { id: 4, name: 'Enter Sandman', album: 'Metallica', genre: 'Metal', quantity: 68, totalAmount: 67.32 },
    { id: 5, name: 'Blue in Green', album: 'Kind of Blue', genre: 'Jazz', quantity: 51, totalAmount: 50.49 },
  ];

  // Monthly Sales trend metrics for Line chart
  const salesTrend = [
    { label: 'Ene', value: 160, x: 20, y: 151 },
    { label: 'Mar', value: 240, x: 100, y: 115 },
    { label: 'May', value: 310, x: 180, y: 70 },
    { label: 'Jul', value: 280, x: 260, y: 92 },
    { label: 'Set', value: 380, x: 340, y: 35 },
    { label: 'Dic', value: 410, x: 420, y: 15 },
  ];

  // Filters computed lists
  const countries = ['Todos', 'USA', 'Canadá', 'Brasil', 'Alemania', 'Francia'];
  const genres = ['Todos', 'Rock', 'Jazz', 'Metal', 'Electronic', 'Classical'];

  const filteredTerritories = useMemo(() => {
    if (selectedCountry === 'Todos') return territoryRevenues;
    return territoryRevenues.filter((t) => t.country === selectedCountry);
  }, [selectedCountry]);

  const handleDownloadSheet = () => {
    alert("[Simulación CSV Excel] Exportando bases de datos Chinook a Microsoft Excel de forma nativa. Licencia registrada por la UAC.");
  };

  return (
    <div id="sales-report-view" className="space-y-8 font-sans">
      
      {/* Header title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Reporte Financiero y de Ventas</h2>
          <p className="text-xs text-gray-400 mt-1 mt-0.5">
            Analítica avanzada de comercialización y distribución de licencias de sonido digital.
          </p>
        </div>

        <button
          onClick={handleDownloadSheet}
          className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#7F77DD] hover:bg-[#6e66c4] px-4 py-2 rounded-xl transition cursor-pointer self-start shadow"
        >
          <Download className="w-4 h-4" />
          Exportar Excel (.xlsx)
        </button>
      </div>

      {/* Date and Territory Filters Panel */}
      <div className="bg-[#111125] border border-white/5 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end select-none">
        
        {/* Date From */}
        <div className="space-y-1.5 text-left">
          <label className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Fecha Desde
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full bg-[#161630] border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#7F77DD]"
          />
        </div>

        {/* Date To */}
        <div className="space-y-1.5 text-left">
          <label className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <CalendarCheck className="w-3.5 h-3.5" />
            Fecha Hasta
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full bg-[#161630] border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#7F77DD]"
          />
        </div>

        {/* Country filter select */}
        <div className="space-y-1.5 text-left">
          <label className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" />
            País de Cobro
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full bg-[#161630] border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#7F77DD] cursor-pointer"
          >
            {countries.map((c) => (
              <option key={c} value={c} className="bg-[#111125]">{c}</option>
            ))}
          </select>
        </div>

        {/* Genre filter select */}
        <div className="space-y-1.5 text-left">
          <label className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            Categoría / Género
          </label>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full bg-[#161630] border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#7F77DD] cursor-pointer"
          >
            {genres.map((g) => (
              <option key={g} value={g} className="bg-[#111125]">{g}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Interactive Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Trend line SVG Chart (7 columns) */}
        <div className="col-span-1 lg:col-span-7 bg-[#111125] border border-white/5 rounded-2xl p-5 md:p-6 shadow-md flex flex-col justify-between select-none">
          <div>
            <h3 className="font-semibold text-base text-white flex items-center gap-2 mb-4">
              <Compass className="w-4.5 h-4.5 text-[#7F77DD]" />
              Evolución de Ventas Semestral
            </h3>
            
            {/* Custom vector line chart with SVG */}
            <div className="h-60 w-full relative pt-4 border-b border-white/5 flex items-end">
              <svg className="w-full h-full" viewBox="0 0 450 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Grid guidelines */}
                <line x1="0" y1="30" x2="450" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="80" x2="450" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="130" x2="450" y2="130" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                
                {/* Path Area under line */}
                <path
                  d="M 20 151 L 100 115 L 180 70 L 260 92 L 340 35 L 420 15 L 420 180 L 20 180 Z"
                  fill="url(#purpleGlowShader)"
                  opacity="0.15"
                />

                {/* Line trend */}
                <path
                  d="M 20 151 L 100 115 L 180 70 L 260 92 L 340 35 L 420 15"
                  stroke="#7F77DD"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Dots / circles on top */}
                {salesTrend.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r="5" fill="#7F77DD" stroke="#111125" strokeWidth="2" className="cursor-pointer hover:r-7 transition-all duration-200" />
                    <text x={p.x - 10} y={p.y - 12} fill="#d1d5db" fontSize="9" fontWeight="bold" fontFamily="monospace">
                      ${p.value}
                    </text>
                  </g>
                ))}

                {/* Shaders definition */}
                <defs>
                  <linearGradient id="purpleGlowShader" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7F77DD" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="flex justify-between items-center px-4 pt-4 text-[10.5px] font-mono text-gray-500">
            {salesTrend.map((p) => (
              <span key={p.label}>{p.label}</span>
            ))}
          </div>
        </div>

        {/* Territory breakdown details list (5 columns) */}
        <div className="col-span-1 lg:col-span-5 bg-[#111125] border border-white/5 rounded-2xl p-5 shadow-md flex flex-col justify-between select-none">
          <div>
            <h3 className="font-semibold text-base text-white flex items-center gap-1.5 mb-5">
              <Globe className="w-4.5 h-4.5 text-[#7F77DD]" />
              Ingresos por Territorio
            </h3>

            <div className="space-y-3.5">
              {filteredTerritories.map((item) => (
                <div key={item.country} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 text-left">
                      <span className="w-2.5 h-2.5 rounded-full block shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-white font-medium">{item.country}</span>
                    </div>
                    <span className="font-mono font-bold text-gray-400">
                      ${item.revenue.toFixed(2)} USD ({item.percent}%)
                    </span>
                  </div>

                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden block">
                    <div className="h-full rounded-full block" style={{ width: `${item.percent}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-gray-500 leading-normal text-left">
            <p className="font-semibold text-gray-400">Territorio líder: USA</p>
            <p>La base de datos Chinook registra transacciones internacionales auditables.</p>
          </div>
        </div>

      </div>

      {/* Top Selling Tracks Ranking List */}
      <div className="bg-[#111125] border border-white/5 rounded-2xl p-5 md:p-6 shadow-md">
        <h3 className="font-semibold text-base text-white mb-4">Pistas Más Vendidas en la Tienda</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10.5px] font-semibold text-gray-400 uppercase tracking-widest select-none">
                <th className="pb-3 text-center w-12">Rango</th>
                <th className="pb-3 pl-2">Título de la Canción</th>
                <th className="pb-3">Álbum</th>
                <th className="pb-3 hidden sm:table-cell">Género</th>
                <th className="pb-3 text-center w-24">Cantidad Vendida</th>
                <th className="pb-3 text-right pr-6 font-mono w-28">Facturado Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bestSellingTracks.map((song, i) => (
                <tr key={song.id} className="text-gray-300 hover:bg-[#161630]/60 transition">
                  <td className="py-3 text-center">
                    <span className="font-mono font-bold text-[#10101e] bg-amber-400 w-5 h-5 rounded-full flex items-center justify-center mx-auto shadow text-[10px]">
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-3 pl-2 font-medium text-white truncate max-w-[200px] sm:max-w-none">{song.name}</td>
                  <td className="py-3 text-gray-400 truncate max-w-[150px]">{song.album}</td>
                  <td className="py-3 text-gray-400 hidden sm:table-cell">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] border border-white/5 font-medium">
                      {song.genre}
                    </span>
                  </td>
                  <td className="py-3 text-center font-mono font-bold text-gray-400">{song.quantity} lic.</td>
                  <td className="py-3 text-right pr-6 font-mono text-emerald-400 font-bold">${song.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
