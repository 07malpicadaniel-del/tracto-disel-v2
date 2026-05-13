"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Undo2, 
  History, 
  ShieldCheck, 
  LogOut 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter(); // Instanciamos el router para poder redirigir
  const [rol, setRol] = useState<string | null>(null);

  useEffect(() => {
    const obtenerRol = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('perfiles')
          .select('rol')
          .eq('id', user.id)
          .single();
        
        if (data) setRol(data.rol);
      }
    };
    obtenerRol();
  }, []);

  const allItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/' },
    { icon: <ShoppingCart size={20} />, label: 'Punto de Venta', href: '/punto-venta' },
    { icon: <Package size={20} />, label: 'Inventario', href: '/inventario' },
    { icon: <Users size={20} />, label: 'Clientes', href: '/clientes' },
    { icon: <History size={20} />, label: 'Historial', href: '/historial' },
    { icon: <Undo2 size={20} />, label: 'Devoluciones', href: '/devoluciones' },
    { icon: <ShieldCheck size={20} />, label: 'Personal', href: '/usuarios', adminOnly: true },
  ];

  const menuItems = allItems.filter(item => {
    if (item.adminOnly && rol !== 'Admin') return false;
    return true;
  });

  // 🔥 FUNCIÓN PARA CERRAR SESIÓN
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Sesión cerrada correctamente');
      
      // Refrescamos el estado del servidor y mandamos al login
      router.refresh();
      router.push('/login');
    } catch (error) {
      toast.error('Hubo un error al cerrar sesión');
    }
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full hidden md:flex">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg leading-none mt-[-2px]">T</span>
          </div>
          Tracto<span className="text-blue-500">-disel</span>
        </h1>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}