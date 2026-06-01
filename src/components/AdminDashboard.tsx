import { ViewType, Invoice, Client, Track, Employee } from '../types';
import { motion } from 'motion/react';
import { 
  TrendingUp, Users, Music, Briefcase, FileSpreadsheet, ArrowUpRight, 
  ChevronRight, ArrowDownRight, Award, DollarSign
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

  // Compute metrics
  const totalSales = useMemo(() => {
    return invoices.reduce((acc, inv) => acc + inv.total, 0);
  }, [invoices]);

  const activeClientsCount = clients.length;
  const songsCount = tracks.length;
  const employeesCount = employees.length;

  // Monthly sales calculation
  const monthlySales = [
    { month: 'Ene', amount: 140.50 },
    { month: 'Feb', amount: 98.20 },
    { month: 'Mar', amount: 165.40 },
    { month: 'Abr', amount: 210.15 },
    { month: 'May', amount: 315.60 },
    { month: 'Jun', amount: 184.20 },
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
      value: `$${totalSales.toFixed(2)}`,
      desc: '+12.4% vs mes anterior',
      icon: DollarSign,
      color: 'border-purple-500/10 text-[#7F77DD] bg-purple-500/5',
      trend: 'up',
    },
    {
      id: 'clients',
      label: 'Clientes Activos',
      value: `${activeClientsCount} Clientes`,
      desc: 'Registrados en Chinook',
      icon: Users,
      color: 'border-emerald-500/10 text-emerald-400 bg-emerald-500/5',
      trend: 'up',
    },
    {
      id: 'songs',
      label: 'Canciones Cargadas',
      value: `${songsCount} Temas`,
      desc: '6 Álbumes activos',
      icon: Music,
      color: 'border-blue-500/10 text-blue-400 bg-blue-500/5',
      trend: 'neutral',
    },
    {
      id: 'employees',
      label: 'Equipo Interno',
      value: `${employeesCount} Empleados`,
      desc: 'Soporte y Operación',
      icon: Briefcase,
      color: 'border-amber-500/10 text-amber-400 bg-amber-500/5',
      trend: 'neutral',
    },
  ];

  return (
    <div id="admin-dashboard-view" className="space-y-8 font-sans">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Consola de Control del Administrador</h2>
          <p className="text-xs text-gray-400 mt-1">Monitorea ingresos, clientes activos y KPIs del negocio en tiempo real.</p>
        </div>

        <button
          onClick={() => onNavigate('sales-report')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#7F77DD] bg-[#7F77DD]/10 border border-[#7F77DD]/20 px-4 py-2 rounded-xl hover:bg-[#7F77DD]/20 transition cursor-pointer self-start"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Ver Reporte General de Venta
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
              className={`p-5 rounded-2xl bg-[#111125] border ${kpi.color} shadow-lg hover:border-white/10 transition-all flex items-center justify-between group`}
            >
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-gray-500 block">{kpi.label}</span>
                <span className="text-2xl font-extrabold text-white block tracking-tight font-sans">{kpi.value}</span>
                <div className="flex items-center gap-1 text-[10px] font-medium text-gray-400">
                  {kpi.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{kpi.desc}</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 transition duration-300 group-hover:scale-110">
                <Icon className="w-5 h-5" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts & Rankings Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left column: Sales Chart Module (7 cols) */}
        <div className="col-span-1 lg:col-span-7 bg-[#111125] border border-white/5 rounded-2xl p-5 md:p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-semibold text-base text-white">Facturación Mensual</h3>
                <p className="text-[10px] text-gray-400">Expresado en dólares americanos (USD)</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-900/30">
                +18.3% Histórico
              </span>
            </div>

            {/* Custom interactive SVG Bar Chart */}
            <div className="h-64 flex items-end justify-between relative pt-8 px-4 border-b border-white/10 select-none">
              
              {/* Grid guide Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[8px] font-mono text-gray-600">
                <span className="border-t border-white/5 pt-1 w-full pl-2">Max $400.00</span>
                <span className="border-t border-white/5 pt-1 w-full pl-2">$300.00</span>
                <span className="border-t border-white/5 pt-1 w-full pl-2">$200.00</span>
                <span className="border-t border-white/5 pt-1 w-full pl-2">$100.00</span>
                <span className="w-full pl-2 py-1">Base $0.00</span>
              </div>

              {/* Bars render */}
              {monthlySales.map((item, idx) => {
                const maxVal = 400.00;
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
                    <div className={`text-[10px] font-mono font-bold text-[#7F77DD] bg-white/5 px-1.5 py-0.5 rounded border border-white/5 transition-opacity ${
                      isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                    }`}>
                      ${item.amount.toFixed(1)}
                    </div>

                    {/* Bar graphic */}
                    <div className="w-8 bg-white/5 hover:bg-white/10 rounded-t-lg transition-all h-48 flex items-end overflow-hidden border border-white/5">
                      <div
                        className="w-full bg-[#7F77DD] rounded-t-md transition-all duration-500 group-hover:bg-[#a19bf1] group-hover:shadow-[0_0_12px_rgba(127,119,221,0.5)] block"
                        style={{ height: `${percentage}%` }}
                      />
                    </div>

                    <span className="text-[10.5px] font-mono font-medium text-gray-500 group-hover:text-white transition">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[10px] text-gray-500 italic mt-4 text-center">
            Pasa el mouse sobre las barras para ver las ventas exactas generadas por mes.
          </p>
        </div>

        {/* Right column: Top Tracks ranking (5 cols) */}
        <div className="col-span-1 lg:col-span-5 bg-[#111125] border border-white/5 rounded-2xl p-5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-base text-white flex items-center gap-1.5">
                <Award className="w-4.5 h-4.5 text-[#7F77DD]" />
                Pistas Más Populares
              </h3>
              <span className="text-xs text-gray-400">Top 5</span>
            </div>

            <div className="space-y-3">
              {topTracks.map((song) => (
                <div
                  key={song.rank}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#161630] border border-white/5 hover:border-white/10 transition"
                >
                  <div className="flex items-center gap-3 pr-2 truncate">
                    <span className="text-xs font-mono font-bold text-gray-500 bg-[#111122] w-6 h-6 rounded flex items-center justify-center">
                      {song.rank}
                    </span>
                    <div className="truncate text-left">
                      <p className="text-xs font-semibold text-white truncate">{song.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{song.artist}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="block text-xs font-bold text-[#7F77DD] font-mono leading-none">
                      {song.sales} sales
                    </span>
                    <span className="text-[9px] text-[#7F77DD]/80 font-semibold uppercase tracking-wider block mt-0.5">
                      ★ {song.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 text-center">
            <button
              onClick={() => onNavigate('sales-report')}
              className="text-xs font-semibold text-[#7F77DD] hover:text-white inline-flex items-center gap-1 transition cursor-pointer"
            >
              Ver reporte detallado por territorio
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Recent Invoices Table section */}
      <div className="bg-[#111125] border border-white/5 rounded-2xl p-5 md:p-6 shadow-md">
        <h3 className="font-semibold text-base text-white mb-4">Últimas Transacciones Registradas</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left font-serif text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10.5px] font-semibold text-gray-400 uppercase tracking-wider select-none">
                <th className="pb-3 w-32">ID Factura</th>
                <th className="pb-3 pl-2">Fecha de Emisión</th>
                <th className="pb-3">Ciudad de Cobro</th>
                <th className="pb-3 hidden sm:table-cell">País de Destino</th>
                <th className="pb-3 text-right pr-6 font-mono w-24">Importe (USD)</th>
                <th className="pb-3 text-center w-28">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {invoices.map((inv) => (
                <tr key={inv.id} className="text-gray-300 hover:bg-[#161630]/60 transition">
                  <td className="py-3 font-mono font-bold text-white">{inv.id}</td>
                  <td className="py-3 pl-2 font-mono text-gray-400">{inv.invoiceDate}</td>
                  <td className="py-3 font-semibold text-gray-200">{inv.billingCity}</td>
                  <td className="py-3 text-gray-400 hidden sm:table-cell">{inv.billingCountry}</td>
                  <td className="py-3 text-right pr-6 font-mono text-white font-bold">${inv.total.toFixed(2)}</td>
                  <td className="py-3">
                    <button
                      onClick={() => {
                        // Switch view to invoice history and set selection if helpful
                        onNavigate('my-invoices');
                      }}
                      className="px-3 py-1 bg-white/5 hover:bg-[#7F77DD] text-white text-[10px] font-semibold rounded-lg border border-white/5 hover:border-transparent transition cursor-pointer flex items-center gap-1 mx-auto"
                    >
                      Auditar
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
