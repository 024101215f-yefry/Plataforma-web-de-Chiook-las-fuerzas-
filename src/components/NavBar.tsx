import { motion } from 'motion/react';
import { Music, LogOut, ShoppingCart, User, Disc, ShoppingBag, Trash2 } from 'lucide-react';
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

  // For Admin, they can also use the top-bar or internal sidebar links
  const adminLinks = [
    { view: 'admin-dashboard' as ViewType, label: 'Panel KPI' },
    { view: 'client-management' as ViewType, label: 'Clientes' },
    { view: 'sales-report' as ViewType, label: 'Ventas' },
    { view: 'employee-management' as ViewType, label: 'Empleados' },
  ];

  const currentLinks = isClient ? clientLinks : adminLinks;

  const cartTotal = cartItems.reduce((acc, item) => acc + item.unitPrice, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#111125]/90 border-b border-white/10 backdrop-blur-md h-[72px] flex items-center px-6 transition-all">
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate(isClient ? 'client-dashboard' : 'admin-dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#7F77DD]/20 border border-[#7F77DD]/35 flex items-center justify-center text-[#7F77DD] group-hover:bg-[#7F77DD]/30 transition">
            <Disc className="w-5 h-5 animate-[spin_4s_linear_infinite]" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight group-hover:text-[#7f77dd] transition">MusicStore</span>
            <span className="text-xs text-gray-400 block -mt-1 font-mono">Web v2025</span>
          </div>
        </div>

        {/* Global Nav Menu Links */}
        <nav className="hidden md:flex items-center gap-1">
          {currentLinks.map((link) => {
            const isActive = currentView === link.view;
            return (
              <button
                id={`nav-${link.view}`}
                key={link.view}
                onClick={() => onNavigate(link.view)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                  isActive ? 'text-[#7F77DD]' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-[#7F77DD]/10 border-b-2 border-[#7F77DD] rounded-lg -z-10"
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
                className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer border border-white/5 focus:outline-none"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#7F77DD] text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-[0_0_8px_rgba(127,119,221,0.5)]">
                    {cartItems.length}
                  </span>
                )}
              </button>

              {/* Cart Dropdown Menu */}
              {showCartDropdown && (
                <div id="cart-dropdown" className="absolute right-0 mt-3 w-80 bg-[#161630] border border-white/10 rounded-xl shadow-2xl p-4 z-50 text-white font-sans origin-top-right animate-in fade-in slide-in-from-top-2 duration-120">
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <h4 className="font-semibold text-sm flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-[#7F77DD]" />
                      Carrito de Música
                    </h4>
                    <span className="text-xs text-gray-400 font-mono">({cartItems.length} items)</span>
                  </div>

                  {cartItems.length === 0 ? (
                    <div className="py-8 text-center text-gray-500 text-xs text-pretty">
                      Tu carrito de compra está vacío. ¡Explora el catálogo para agregar canciones!
                    </div>
                  ) : (
                    <>
                      <div className="max-h-52 overflow-y-auto divide-y divide-white/5 py-1 pr-1">
                        {cartItems.map((item, index) => (
                          <div key={`${item.id}-${index}`} className="flex justify-between items-center py-2.5 text-xs text-gray-200">
                            <div className="pr-2 truncate">
                              <p className="font-medium text-white truncate">{item.name}</p>
                              <p className="text-[10px] text-gray-400 truncate">{item.composer || 'Desconocido'}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-mono text-[#7F77DD]">${item.unitPrice.toFixed(2)}</span>
                              <button
                                onClick={() => onRemoveFromCart(item.id)}
                                className="text-gray-500 hover:text-red-400 p-1 transition cursor-pointer"
                                title="Eliminar del carrito"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center text-sm">
                        <span className="text-gray-400">Total Solicitado</span>
                        <span className="font-mono font-bold text-[#7F77DD] text-lg">${cartTotal.toFixed(2)}</span>
                      </div>

                      <button
                        id="checkout-btn"
                        onClick={() => {
                          onCheckout();
                          setShowCartDropdown(false);
                        }}
                        className="w-full mt-3 py-2 bg-[#7F77DD] hover:bg-[#6e66c4] cursor-pointer text-white text-xs font-semibold rounded-lg text-center shadow-lg transition-all"
                      >
                        Comprar & Generar Factura
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* User badge */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-xs font-semibold text-white/90">{session.name}</span>
              <span className="text-[10px] text-gray-400 capitalize bg-white/5 px-1.5 py-0.5 rounded border border-white/5 self-end">
                {session.role === 'admin' ? 'Administrador' : 'Membresía Cliente'}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#7F77DD] to-purple-500 flex items-center justify-center font-bold text-white shadow shadow-[#7F77DD]/40 text-sm">
              {session.name.charAt(0)}
            </div>
          </div>

          {/* Logout Action */}
          <button
            id="logout-btn"
            onClick={onLogout}
            className="p-2 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-900/10 text-red-400 hover:text-white transition cursor-pointer"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
