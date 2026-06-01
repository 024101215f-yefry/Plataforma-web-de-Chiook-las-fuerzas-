import { LayoutDashboard, Users, BarChart3, Briefcase } from 'lucide-react';
import { ViewType } from '../types';

interface AdminSidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

export default function AdminSidebar({ currentView, onNavigate }: AdminSidebarProps) {
  const menuItems = [
    {
      view: 'admin-dashboard' as ViewType,
      label: 'Panel KPI',
      description: 'Métricas de Tienda',
      icon: LayoutDashboard,
    },
    {
      view: 'client-management' as ViewType,
      label: 'Gestión Clientes',
      description: 'Cartera y Soporte',
      icon: Users,
    },
    {
      view: 'sales-report' as ViewType,
      label: 'Reportes Ventas',
      description: 'Gráficos e Ingresos',
      icon: BarChart3,
    },
    {
      view: 'employee-management' as ViewType,
      label: 'Gestión Empleados',
      description: 'Directorio Interno',
      icon: Briefcase,
    },
  ];

  return (
    <aside className="w-64 bg-[#111125] border-r border-white/10 shrink-0 h-[calc(100vh-72px)] sticky top-[72px] py-6 px-4 flex flex-col justify-between overflow-y-auto">
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 block mb-4">
            Módulos Administrativos
          </span>
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              return (
                <button
                  id={`side-${item.view}`}
                  key={item.view}
                  onClick={() => onNavigate(item.view)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer text-left transition-all ${
                    isActive
                      ? 'bg-[#7F77DD]/10 border border-[#7F77DD]/30 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-[#7F77DD] text-white' : 'bg-white/5 text-gray-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold leading-tight">{item.label}</p>
                    <p className="text-[10px] text-gray-500 font-medium">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="bg-[#161630] border border-white/5 rounded-xl p-3 text-[10px] text-gray-400">
        <p className="font-semibold text-white mb-1">Chinook DB Live Context</p>
        <p>Conectado al servidor de producción musical. Nodos operativos en tiempo real.</p>
      </div>
    </aside>
  );
}
