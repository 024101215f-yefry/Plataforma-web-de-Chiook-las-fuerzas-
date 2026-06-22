import { useState, useMemo } from 'react';
import { 
  Globe, Compass, Calendar, 
  Download, CalendarCheck 
} from 'lucide-react';

export default function SalesReport() {
  const [selectedCountry, setSelectedCountry] = useState('Todos');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [dateFrom, setDateFrom] = useState('2025-01-01');
  const [dateTo, setDateTo] = useState('2025-12-31');

  // Static Territory Income in Peruvian Soles (S/.)
  const territoryRevenues = [
    { country: 'USA', revenue: 1832.25, licenses: 530, percent: 35, color: '#2563eb' },
    { country: 'Canadá', revenue: 1359.40, licenses: 390, percent: 27, color: '#4f46e5' },
    { country: 'Brasil', revenue: 742.35, licenses: 215, percent: 14, color: '#0284c7' },
    { country: 'Alemania', revenue: 683.55, licenses: 198, percent: 13, color: '#10b981' },
    { country: 'Francia', revenue: 578.20, licenses: 165, percent: 11, color: '#f59e0b' },
  ];

  // Best selling tracks ranking list in Peruvian Soles (S/.)
  const bestSellingTracks = [
    { id: 1, name: 'Hells Bells', album: 'Back in Black', genre: 'Rock', quantity: 94, totalAmount: 325.71 },
    { id: 2, name: 'Smells Like Teen Spirit', album: 'Nevermind', genre: 'Rock', quantity: 82, totalAmount: 284.13 },
    { id: 3, name: 'Get Lucky', album: 'Random Access Memories', genre: 'Electronic', quantity: 74, totalAmount: 256.41 },
    { id: 4, name: 'Enter Sandman', album: 'Metallica', genre: 'Metal', quantity: 68, totalAmount: 235.62 },
    { id: 5, name: 'Blue in Green', album: 'Kind of Blue', genre: 'Jazz', quantity: 51, totalAmount: 176.71 },
  ];

  // Monthly Sales trend metrics for Line chart in Peruvian Soles (S/.)
  const salesTrend = [
    { label: 'Ene', value: 560, x: 20, y: 151 },
    { label: 'Mar', value: 840, x: 100, y: 115 },
    { label: 'May', value: 1085, x: 180, y: 70 },
    { label: 'Jul', value: 980, x: 260, y: 92 },
    { label: 'Set', value: 1330, x: 340, y: 35 },
    { label: 'Dic', value: 1435, x: 420, y: 15 },
  ];

  // Filters computed lists
  const countries = ['Todos', 'USA', 'Canadá', 'Brasil', 'Alemania', 'Francia'];
  const genres = ['Todos', 'Rock', 'Jazz', 'Metal', 'Electronic', 'Classical'];

  const filteredTerritories = useMemo(() => {
    if (selectedCountry === 'Todos') return territoryRevenues;
    return territoryRevenues.filter((t) => t.country === selectedCountry);
  }, [selectedCountry]);

  const handleDownloadSheet = () => {
    alert("[Simulación CSV Excel] Exportando data Chinook a Microsoft Excel de forma nativa. Licencia UAC Cusco válida.");
  };

  return (
    <div id="sales-report-view" className="space-y-6 font-sans">
      
      {/* Header title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-950 tracking-tight">Reporte de Auditoría y Ventas</h2>
          <p className="text-xs text-gray-500 mt-1">
            Analítica de consumo de licencias, facturación mundial y recaudación consolidada en soles peruanos.
          </p>
        </div>

        <button
          onClick={handleDownloadSheet}
          className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl transition cursor-pointer self-start shadow shadow-blue-105"
        >
          <Download className="w-4 h-4" />
          Exportar Datos UAC (.xlsx)
        </button>
      </div>

      {/* Date and Territory Filters Panel */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end select-none shadow-sm">
        
        {/* Date From */}
        <div className="space-y-1.5 text-left">
          <label className="text-[10.5px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-blue-650" />
            Fecha Desde
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-sans"
          />
        </div>

        {/* Date To */}
        <div className="space-y-1.5 text-left">
          <label className="text-[10.5px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <CalendarCheck className="w-3.5 h-3.5 text-blue-650" />
            Fecha Hasta
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-sans"
          />
        </div>

        {/* Country filter select */}
        <div className="space-y-1.5 text-left">
          <label className="text-[10.5px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-blue-650" />
            País Emisor
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-sans cursor-pointer"
          >
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Genre filter select */}
        <div className="space-y-1.5 text-left">
          <label className="text-[10.5px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-blue-650" />
            Género Musical
          </label>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-sans cursor-pointer"
          >
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Interactive Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Trend line SVG Chart (7 columns) */}
        <div className="col-span-1 lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col justify-between select-none">
          <div>
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2 mb-4 text-left">
              <Compass className="w-4.5 h-4.5 text-blue-600" />
              Tendencia de Ventas Semestrales (S/.)
            </h3>
            
            {/* Custom vector line chart with SVG */}
            <div className="h-60 w-full relative pt-4 border-b border-gray-150 flex items-end">
              <svg className="w-full h-full" viewBox="0 0 450 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Grid guidelines */}
                <line x1="0" y1="30" x2="450" y2="30" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                <line x1="0" y1="80" x2="450" y2="80" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                <line x1="0" y1="130" x2="450" y2="130" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                
                {/* Path Area under line */}
                <path
                  d="M 20 151 L 100 115 L 180 70 L 260 92 L 340 35 L 420 15 L 420 180 L 20 180 Z"
                  fill="url(#blueGlowShader)"
                  opacity="0.1"
                />

                {/* Line trend */}
                <path
                  d="M 20 151 L 100 115 L 180 70 L 260 92 L 340 35 L 420 15"
                  stroke="#2563eb"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Dots / circles on top */}
                {salesTrend.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" className="cursor-pointer hover:r-6 transition-all duration-200 shadow-sm" />
                    <text x={p.x - 12} y={p.y - 12} fill="#374151" fontSize="9" fontWeight="bold" fontFamily="monospace">
                      S/. {p.value}
                    </text>
                  </g>
                ))}

                {/* Shaders definition */}
                <defs>
                  <linearGradient id="blueGlowShader" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="flex justify-between items-center px-4 pt-4 text-[10.5px] font-mono font-bold text-gray-400">
            {salesTrend.map((p) => (
              <span key={p.label}>{p.label}</span>
            ))}
          </div>
        </div>

        {/* Territory breakdown details list (5 columns) */}
        <div className="col-span-1 lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between select-none">
          <div>
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-1.5 mb-5 text-left">
              <Globe className="w-4.5 h-4.5 text-blue-600" />
              Ingresos por País Emisor
            </h3>

            <div className="space-y-4">
              {filteredTerritories.map((item) => (
                <div key={item.country} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 text-left">
                      <span className="w-2.5 h-2.5 rounded-full block shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-900 font-bold">{item.country}</span>
                    </div>
                    <span className="font-mono font-bold text-gray-500">
                      S/. {item.revenue.toFixed(2)} ({item.percent}%)
                    </span>
                  </div>

                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden block border border-gray-150/40">
                    <div className="h-full rounded-full block" style={{ width: `${item.percent}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-150 text-[10px] text-gray-400 leading-normal text-left font-semibold">
            <p className="font-bold text-gray-600">Mercado Destacado: EEUU (USA)</p>
            <p>La base de datos Chinook refleja la internacionalización de la música física y digital.</p>
          </div>
        </div>

      </div>

      {/* Top Selling Tracks Ranking List */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
        <h3 className="font-bold text-base text-gray-900 mb-4 text-left select-none">Pistas de Alta Rotación Comercial</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-[10.5px] font-bold text-gray-505 uppercase tracking-widest bg-gray-50 text-gray-500 select-none">
                <th className="py-2.5 px-3 text-center w-12">Puesto</th>
                <th className="py-2.5 px-3 pl-2">Track Nominado</th>
                <th className="py-2.5 px-3">Álbum</th>
                <th className="py-2.5 px-3 hidden sm:table-cell">Género</th>
                <th className="py-2.5 px-3 text-center w-28">Copias Licenciadas</th>
                <th className="py-2.5 px-3 text-right pr-6 font-mono w-32">Monto Neto (S/.)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bestSellingTracks.map((song, i) => (
                <tr key={song.id} className="text-gray-700 hover:bg-slate-50 transition">
                  <td className="py-3 px-3 text-center">
                    <span className="font-mono font-black text-gray-950 bg-amber-400 w-5 h-5 rounded-full flex items-center justify-center mx-auto shadow-sm text-[10px]">
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-3 px-3 pl-2 font-bold text-gray-950 truncate max-w-[200px] sm:max-w-none text-left">{song.name}</td>
                  <td className="py-3 px-3 text-gray-550 truncate max-w-[150px] text-left">{song.album}</td>
                  <td className="py-3 px-3 text-gray-550 hidden sm:table-cell text-left">
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-[10px] border border-gray-200 font-semibold select-none text-gray-600">
                      {song.genre}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-gray-500">{song.quantity} lic.</td>
                  <td className="py-3 px-3 text-right pr-6 font-mono text-blue-600 font-extrabold">S/. {song.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
