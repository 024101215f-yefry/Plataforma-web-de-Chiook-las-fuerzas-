import { ViewType, Invoice, Client, Track, Employee } from '../types';
import { motion } from 'motion/react';
import { 
  TrendingUp, Users, Music, Briefcase, FileSpreadsheet, ArrowUpRight, 
  ChevronRight, Award, DollarSign
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface AdminDashboardProps {
  invoices: Invoice[];
  clients: Client[];
  tracks: Track[];
  employees: Employee[];
  onNavigate: (view: ViewType) => void;
}

export default function AdminDashboard({
  invoices,
  clients,
  tracks,
  employees,
  onNavigate,
}: AdminDashboardProps) {
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Peruvian date formatter helper input: YYYY-MM-DD -> DD/MM/YYYY
  const formatPeruvianDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  // Compute metrics in Peruvian Soles
  const totalSalesSoles = useMemo(() => {
    return invoices.reduce((acc, inv) => acc + inv.total, 0);
  }, [invoices]);

  const activeClientsCount = clients.length;
  const songsCount = tracks.length;
  const employeesCount = employees.length;

  // Monthly sales calculation in Peruvian Soles (S/.)
  const monthlySales = [
    { month: 'Ene', amount: 562.00 },
    { month: 'Feb', amount: 392.80 },
    { month: 'Mar', amount: 661.60 },
    { month: 'Abr', amount: 840.60 },
    { month: 'May', amount: 1262.40 },
    { month: 'Jun', amount: 736.80 },
  ];

  // Top 5 tracks (ranking simulation)
  const topTracks = [
    { rank: 1, name: 'Hells Bells', artist: 'AC/DC', sales: 48, rating: 9.8 },
    { rank: 2, name: 'Smells Like Teen Spirit', artist: 'Nirvana', sales: 45, rating: 9.6 },
    { rank: 3, name: 'Get Lucky', artist: 'Daft Punk', sales: 38, rating: 9.2 },
    { rank: 4, name: 'Blue in Green', artist: 'Miles Davis', sales: 34, rating: 8.9 },
    { rank: 5, name: 'Master of Puppets', artist: 'Metallica', sales: 29, rating: 8.5 },
  ];

  const adminKpis = [
    {
      id: 'sales',
      label: 'Ventas Acumuladas',
      value: `S/. ${totalSalesSoles.toFixed(2)}`,
      desc: '+12.4% vs mes anterior',
      icon: DollarSign,
      color: 'border-blue-100 text-blue-600 bg-blue-50/50',
      trend: 'up',
    },
    {
      id: 'clients',
      label: 'Clientes Activos',
      value: `${activeClientsCount} Clientes`,
      desc: 'Registrados en Chinook',
      icon: Users,
      color: 'border-emerald-100 text-emerald-600 bg-emerald-50/50',
      trend: 'up',
    },
    {
      id: 'songs',
      label: 'Canciones Cargadas',
      value: `${songsCount} Temas`,
      desc: 'Catálogo de Sonidos',
      icon: Music,
      color: 'border-amber-100 text-amber-600 bg-amber-50/50',
      trend: 'neutral',
    },
    {
      id: 'employees',
      label: 'Equipo de Soporte',
      value: `${employeesCount} Empleados`,
      desc: 'Directorio Interno',
      icon: Briefcase,
      color: 'border-purple-100 text-purple-600 bg-purple-50/50',
      trend: 'neutral',
    },
  ];

  return (
    <div id="admin-dashboard-view" className="space-y-6 font-sans">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-950 tracking-tight">Consola de Control de Negocio</h2>
          <p className="text-xs text-gray-500 mt-1">
            Monitoreo en tiempo real de la facturación de licencias, KPIs y volumen en soles peruanos.
          </p>
        </div>

        <button
          onClick={() => onNavigate('sales-report')}
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-4 py-2.5 rounded-xl hover:bg-blue-100 transition cursor-pointer self-start shadow-sm"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Ver Gráficos y Reporte de Ventas
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {adminKpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              key={kpi.id}
              className={`p-5 rounded-2xl bg-white border ${kpi.color} shadow-sm transition-all flex items-center justify-between group`}
            >
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-gray-500 block">{kpi.label}</span>
                <span className="text-2xl font-black text-gray-900 block tracking-tight font-sans">{kpi.value}</span>
                <div className="flex items-center gap-1 text-[10px] font-semibold text-gray-500">
                  {kpi.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{kpi.desc}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white transition duration-300 group-hover:scale-105 border border-gray-100 shadow-sm">
                <Icon className="w-5 h-5 text-gray-700" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts & Rankings Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left column: Sales Chart Module (7 cols) */}
        <div className="col-span-1 lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-base text-gray-900">Facturación Mensual</h3>
                <p className="text-[10px] text-gray-500">Volumen consolidado expresado en Soles Peruanos (S/.)</p>
              </div>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                +18.3% Histórico
              </span>
            </div>

            {/* Custom interactive SVG Bar Chart */}
            <div className="h-64 flex items-end justify-between relative pt-8 px-4 border-b border-gray-150 select-none">
              
              {/* Grid guide Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[8.5px] font-mono font-medium text-gray-400">
                <span className="border-t border-gray-100 pt-1 w-full pl-2">S/. 1,500.00</span>
                <span className="border-t border-gray-100 pt-1 w-full pl-2">S/. 1,000.00</span>
                <span className="border-t border-gray-100 pt-1 w-full pl-2">S/. 500.00</span>
                <span className="w-full pl-2 py-1">Base S/. 0.00</span>
              </div>

              {/* Bars render */}
              {monthlySales.map((item, idx) => {
                const maxVal = 1500.00;
                const percentage = (item.amount / maxVal) * 100;
                const isHovered = hoveredBarIndex === idx;

                return (
                  <div
                    key={item.month}
                    className="flex flex-col items-center gap-2 group w-12 cursor-pointer z-10"
                    onMouseEnter={() => setHoveredBarIndex(idx)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                  >
                    {/* Tooltip on top of bar */}
                    <div className={`text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 transition-opacity ${
                      isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                    }`}>
                      S/. {item.amount.toFixed(0)}
                    </div>

                    {/* Bar graphic */}
                    <div className="w-8 bg-gray-50 hover:bg-gray-100 rounded-t-lg transition-all h-48 flex items-end overflow-hidden border border-gray-100">
                      <div
                        className="w-full bg-blue-600 rounded-t-md transition-all duration-500 group-hover:bg-blue-700 block"
                        style={{ height: `${percentage}%` }}
                      />
                    </div>

                    <span className="text-[10.5px] font-mono font-semibold text-gray-500 group-hover:text-gray-900 transition">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[10px] text-gray-400 italic mt-4 text-center">
            Pasa el mouse sobre las barras para ver las estadísticas exactas generadas por mes.
          </p>
        </div>

        {/* Right column: Top Tracks ranking (5 cols) */}
        <div className="col-span-1 lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-1.5">
                <Award className="w-4.5 h-4.5 text-blue-600" />
                Pistas Más Populares
              </h3>
              <span className="text-xs text-gray-450 font-bold bg-gray-100 px-2.5 py-0.5 rounded-full text-gray-600">Top 5</span>
            </div>

            <div className="space-y-3">
              {topTracks.map((song) => (
                <div
                  key={song.rank}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-150 hover:bg-slate-100/50 transition text-left"
                >
                  <div className="flex items-center gap-3 pr-2 truncate">
                    <span className="text-xs font-mono font-black text-gray-500 bg-white border border-gray-200 w-6 h-6 rounded flex items-center justify-center">
                      {song.rank}
                    </span>
                    <div className="truncate">
                      <p className="text-xs font-bold text-gray-900 truncate">{song.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{song.artist}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="block text-xs font-bold text-blue-600 font-mono leading-none">
                      {song.sales} ventas
                    </span>
                    <span className="text-[9px] text-gray-500 font-bold block mt-1 select-none">
                      Calidad ★ {song.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 text-center">
            <button
              onClick={() => onNavigate('sales-report')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition cursor-pointer"
            >
              Ver reporte detallado por país
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Recent Invoices Table section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
        <h3 className="font-bold text-base text-gray-900 mb-4 select-none">Últimas Compras Auditadas</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-[10.5px] font-semibold text-gray-500 uppercase tracking-wider select-none">
                <th className="py-2.5 px-3 w-32">ID Transacción</th>
                <th className="py-2.5 px-3">Fecha de Pago</th>
                <th className="py-2.5 px-3">Ciudad de Origen</th>
                <th className="py-2.5 px-3 hidden sm:table-cell">País de Factura</th>
                <th className="py-2.5 px-3 text-right pr-6 font-mono w-32">Monto Neto (S/.)</th>
                <th className="py-2.5 px-3 text-center w-28">Auditoría</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-750">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-mono font-bold text-gray-900">{inv.id}</td>
                  <td className="py-3 px-3 font-mono text-gray-500">{formatPeruvianDate(inv.invoiceDate)}</td>
                  <td className="py-3 px-3 font-semibold text-gray-800">{inv.billingCity}</td>
                  <td className="py-3 px-3 text-gray-500 hidden sm:table-cell">{inv.billingCountry}</td>
                  <td className="py-3 px-3 text-right pr-6 font-mono text-gray-900 font-extrabold">S/. {inv.total.toFixed(2)}</td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => {
                        onNavigate('my-invoices');
                      }}
                      className="px-3 py-1 bg-white hover:bg-gray-100 text-blue-600 border border-gray-205 text-[10px] font-bold rounded-lg transition cursor-pointer flex items-center gap-1 mx-auto shadow-sm"
                    >
                      Auditar Comprobante
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
