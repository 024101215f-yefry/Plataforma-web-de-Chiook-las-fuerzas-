import { motion } from 'motion/react';
import { LogOut, ShoppingCart, Disc, ShoppingBag, Trash2 } from 'lucide-react';
import { ViewType, UserSession, Track } from '../types';
import { useState } from 'react';

interface NavBarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  session: UserSession | null;
  onLogout: () => void;
  cartItems: Track[];
  onRemoveFromCart: (trackId: number) => void;
  onCheckout: () => void;
}

export default function NavBar({
  currentView,
  onNavigate,
  session,
  onLogout,
  cartItems,
  onRemoveFromCart,
  onCheckout,
}: NavBarProps) {
  const [showCartDropdown, setShowCartDropdown] = useState(false);

  if (!session) return null;

  const isClient = session.role === 'cliente';
  
  // Navigation lists corresponding to role
  const clientLinks = [
    { view: 'client-dashboard' as ViewType, label: 'Dashboard' },
    { view: 'music-catalog' as ViewType, label: 'Catálogo Digital' },
    { view: 'my-invoices' as ViewType, label: 'Mis Facturas' },
    { view: 'my-playlists' as ViewType, label: 'Mis Playlists' },
  ];

  // For Admin, standard pages but can also jump to tables
  const adminLinks = [
    { view: 'admin-dashboard' as ViewType, label: 'Panel KPI' },
    { view: 'client-management' as ViewType, label: 'Clientes' },
    { view: 'sales-report' as ViewType, label: 'Ventas' },
    { view: 'employee-management' as ViewType, label: 'Empleados' },
  ];

  const currentLinks = isClient ? clientLinks : adminLinks;

  const cartTotal = cartItems.reduce((acc, item) => acc + item.unitPrice, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 border-b border-gray-200 backdrop-blur-md h-[72px] flex items-center px-6 transition-all select-none">
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate(isClient ? 'client-dashboard' : 'admin-dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition shadow-sm">
            <Disc className="w-5 h-5 animate-[spin_4s_linear_infinite]" />
          </div>
          <div>
            <span className="text-lg font-extrabold text-gray-900 tracking-tight group-hover:text-blue-600 transition">MusicStore</span>
            <span className="text-[9.5px] text-gray-400 block -mt-1 font-mono font-bold uppercase tracking-wider">UAC • Chinook</span>
          </div>
        </div>

        {/* Global Nav Menu Links */}
        <nav className="hidden md:flex items-center gap-1">
          {currentLinks.map((link) => {
            const isActive = currentView === link.view || 
              (link.view === 'client-management' && [
                'client-management', 'admin-albums', 'admin-artists', 'admin-genres', 'admin-tracks'
              ].includes(currentView));
            return (
              <button
                id={`nav-${link.view}`}
                key={link.view}
                onClick={() => onNavigate(link.view)}
                className={`relative px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-blue-50 border-b-2 border-blue-600 rounded-lg -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Side Actions: Cart (if client), Profile, Logout */}
        <div className="flex items-center gap-4">
          
          {/* Cart Icon Dropdown (Client Only) */}
          {isClient && (
            <div className="relative">
              <button
                id="cart-icon-btn"
                onClick={() => setShowCartDropdown(!showCartDropdown)}
                className="relative p-2.5 rounded-xl bg-gray-100 hover:bg-gray-250/70 text-gray-700 hover:text-gray-900 transition cursor-pointer border border-gray-200 focus:outline-none"
              >
                <ShoppingCart className="w-4 h-4" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[9px] font-extrabold shadow-md">
                    {cartItems.length}
                  </span>
                )}
              </button>

              {/* Cart Dropdown Menu */}
              {showCartDropdown && (
                <div id="cart-dropdown" className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 z-50 text-gray-800 font-sans origin-top-right animate-in fade-in slide-in-from-top-2 duration-120">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-150">
                    <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1.5 uppercase tracking-wide">
                      <ShoppingBag className="w-4 h-4 text-blue-600" />
                      Canasta de Compras
                    </h4>
                    <span className="text-[10px] text-gray-400 font-mono font-semibold">({cartItems.length} tracks)</span>
                  </div>

                  {cartItems.length === 0 ? (
                    <div className="py-8 text-center text-gray-400 text-xs">
                      Tu carrito de compra está vacío.
                    </div>
                  ) : (
                    <>
                      <div className="max-h-52 overflow-y-auto divide-y divide-gray-100 py-1 pr-1">
                        {cartItems.map((item, index) => (
                          <div key={`${item.id}-${index}`} className="flex justify-between items-center py-2.5 text-xs text-gray-700">
                            <div className="pr-2 truncate">
                              <p className="font-bold text-gray-900 truncate">{item.name}</p>
                              <p className="text-[10px] text-gray-400 truncate">{item.composer || 'Desconocido'}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-mono font-semibold text-blue-600 text-[11px]">S/. {item.unitPrice.toFixed(2)}</span>
                              <button
                                onClick={() => onRemoveFromCart(item.id)}
                                className="text-gray-400 hover:text-red-550 p-1 transition cursor-pointer"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center text-xs font-bold">
                        <span className="text-gray-500">Monto Total</span>
                        <span className="font-mono text-blue-600 text-base">S/. {cartTotal.toFixed(2)}</span>
                      </div>

                      <button
                        id="checkout-btn"
                        onClick={() => {
                          onCheckout();
                          setShowCartDropdown(false);
                        }}
                        className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white text-xs font-bold rounded-xl text-center shadow transition-all"
                      >
                        Confirmar Compra
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* User badge */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-xs font-bold text-gray-800">{session.name}</span>
              <span className="text-[9px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 self-end uppercase leading-none tracking-wider">
                {session.role === 'admin' ? 'Administrador' : 'Cliente Premium'}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow shadow-blue-200 text-sm">
              {session.name.charAt(0)}
            </div>
          </div>

          {/* Logout Action */}
          <button
            id="logout-btn"
            onClick={onLogout}
            className="p-2 rounded-xl bg-red-50 hover:bg-red-150 border border-red-100 text-red-650 hover:text-red-750 transition cursor-pointer"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
