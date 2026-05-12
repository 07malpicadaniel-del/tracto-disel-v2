"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Truck, 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  AlertTriangle, 
  Undo2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // Función para evaluar si la ruta está activa
  const isActive = (path: string) => pathname === path;

  // Clases CSS reutilizables para los botones del menú con transiciones ultrasuaves
  const linkClass = (path: string) => `
    flex items-center gap-4 px-3 py-3.5 rounded-xl transition-all duration-300 ease-in-out group relative cursor-pointer overflow-hidden
    ${isActive(path) ? 'bg-blue-600/10 text-blue-400' : 'hover:bg-slate-900 hover:text-slate-100'}
  `;

  return (
    <aside
      className={`bg-slate-950 text-slate-300 h-screen flex flex-col relative z-20 border-r border-slate-800 transition-all duration-500 ease-in-out ${isCollapsed ? 'w-20' : 'w-72'}`}
    >
      {/* Botón para colapsar/expandir */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-8 bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 z-30"
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Logo */}
      <div className="h-24 flex items-center justify-center border-b border-slate-800/50 mb-6 px-4">
        <div className="flex items-center gap-3 w-full justify-center">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/20 shrink-0 transition-transform duration-300 hover:scale-105">
            <Truck className="text-white" size={28} />
          </div>
          <h1 
            className={`text-xl font-black text-white tracking-tight whitespace-nowrap transition-all duration-300 ease-in-out origin-left
            ${isCollapsed ? 'opacity-0 scale-0 w-0' : 'opacity-100 scale-100 w-auto'}`}
          >
            Tracto-disel
          </h1>
        </div>
      </div>

      {/* Navegación (Hardcodeada para evitar bugs de React 19) */}
      <nav className="flex-1 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
        
        <Link href="/">
          <div className={linkClass('/')}>
            {isActive('/') && <div className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full" />}
            <LayoutDashboard size={22} className={`shrink-0 transition-colors duration-300 ${isActive('/') ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
            <span className={`font-semibold text-sm whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 translate-x-4 w-0' : 'opacity-100 translate-x-0 w-auto'}`}>Dashboard</span>
          </div>
        </Link>

        <Link href="/punto-venta">
          <div className={linkClass('/punto-venta')}>
            {isActive('/punto-venta') && <div className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full" />}
            <ShoppingCart size={22} className={`shrink-0 transition-colors duration-300 ${isActive('/punto-venta') ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
            <span className={`font-semibold text-sm whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 translate-x-4 w-0' : 'opacity-100 translate-x-0 w-auto'}`}>Punto de Venta</span>
          </div>
        </Link>

        <Link href="/inventario">
          <div className={linkClass('/inventario')}>
            {isActive('/inventario') && <div className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full" />}
            <Package size={22} className={`shrink-0 transition-colors duration-300 ${isActive('/inventario') ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
            <span className={`font-semibold text-sm whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 translate-x-4 w-0' : 'opacity-100 translate-x-0 w-auto'}`}>Inventario</span>
          </div>
        </Link>

        <Link href="/clientes">
          <div className={linkClass('/clientes')}>
            {isActive('/clientes') && <div className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full" />}
            <Users size={22} className={`shrink-0 transition-colors duration-300 ${isActive('/clientes') ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
            <span className={`font-semibold text-sm whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 translate-x-4 w-0' : 'opacity-100 translate-x-0 w-auto'}`}>Clientes</span>
          </div>
        </Link>

        <Link href="/alertas">
          <div className={linkClass('/alertas')}>
            {isActive('/alertas') && <div className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full" />}
            <AlertTriangle size={22} className={`shrink-0 transition-colors duration-300 ${isActive('/alertas') ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
            <span className={`font-semibold text-sm whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 translate-x-4 w-0' : 'opacity-100 translate-x-0 w-auto'}`}>Alertas</span>
          </div>
        </Link>

        <Link href="/devoluciones">
          <div className={linkClass('/devoluciones')}>
            {isActive('/devoluciones') && <div className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full" />}
            <Undo2 size={22} className={`shrink-0 transition-colors duration-300 ${isActive('/devoluciones') ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
            <span className={`font-semibold text-sm whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 translate-x-4 w-0' : 'opacity-100 translate-x-0 w-auto'}`}>Devoluciones</span>
          </div>
        </Link>

      </nav>

      {/* Footer del usuario */}
      <div className="p-4 border-t border-slate-800/50 mt-auto overflow-hidden">
        <div className={`flex items-center gap-3 transition-all duration-300 ${isCollapsed ? 'justify-center' : 'bg-slate-900 p-3 rounded-xl'}`}>
          <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
            <span className="text-blue-400 font-bold">A</span>
          </div>
          <div className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            <p className="text-sm font-bold text-white truncate">Administración</p>
            <p className="text-xs text-slate-500 truncate">Gerencia General</p>
          </div>
        </div>
      </div>
    </aside>
  );
}