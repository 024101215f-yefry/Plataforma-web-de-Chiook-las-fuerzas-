import { LayoutDashboard, Users, BarChart3, Briefcase, Disc, Music, Tag, User } from 'lucide-react';
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
    {
      view: 'admin-albums' as ViewType,
      label: 'Gestión Álbumes',
      description: 'Directorio de Álbumes',
      icon: Disc,
    },
    {
      view: 'admin-artists' as ViewType,
      label: 'Gestión Artistas',
      description: 'Directorio de Artistas',
      icon: User,
    },
    {
      view: 'admin-genres' as ViewType,
      label: 'Gestión Géneros',
      description: 'Categorías de Sonido',
      icon: Tag,
    },
    {
      view: 'admin-tracks' as ViewType,
      label: 'Gestión Canciones',
      description: 'Canciones y Pistas',
      icon: Music,
    },
  ];

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 shrink-0 h-[calc(100vh-72px)] sticky top-[72px] py-6 px-4 flex flex-col justify-between overflow-y-auto">
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
                      ? 'bg-blue-50 border border-blue-200/50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/85 border border-transparent'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold leading-tight">{item.label}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="bg-gray-100 border border-gray-200 rounded-xl p-3 text-[10px] text-gray-500">
        <p className="font-semibold text-gray-700 mb-1">Chinook DB Live Context</p>
        <p>Conectado al servidor de producción musical. Nodos operativos en tiempo real.</p>
      </div>
    </aside>
  );
}
