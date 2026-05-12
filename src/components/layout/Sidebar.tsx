"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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

const menuItems = [
  { name: 'Dashboard', Icon: LayoutDashboard, path: '/' },
  { name: 'Punto de Venta', Icon: ShoppingCart, path: '/punto-venta' },
  { name: 'Inventario', Icon: Package, path: '/inventario' },
  { name: 'Clientes', Icon: Users, path: '/clientes' },
  { name: 'Alertas', Icon: AlertTriangle, path: '/alertas' },
  { name: 'Devoluciones', Icon: Undo2, path: '/devoluciones' },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-slate-950 text-slate-300 h-screen flex flex-col relative z-20 border-r border-slate-800"
    >
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-8 bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded-full shadow-lg transition-colors z-30"
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Logo Section */}
      <div className="h-24 flex items-center justify-center border-b border-slate-800/50 mb-6">
        <div className="flex items-center gap-3 px-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/20">
            <Truck className="text-white shrink-0" size={28} />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.h1 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-xl font-black text-white tracking-tight whitespace-nowrap"
              >
                Tracto-disel
              </motion.h1>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.Icon; // Referencia al componente en mayúscula
          
          return (
            <Link key={item.path} href={item.path}>
              <div className={`
                flex items-center gap-4 px-3 py-3.5 rounded-xl transition-all group relative cursor-pointer
                ${isActive ? 'bg-blue-600/10 text-blue-400' : 'hover:bg-slate-900 hover:text-slate-100'}
              `}>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <Icon size={22} className={`shrink-0 ${isActive ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
                
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="font-semibold text-sm whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}