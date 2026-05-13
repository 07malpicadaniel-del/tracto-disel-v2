"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, ShieldCheck, UserMinus, UserPlus, Mail, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarUsuarios = async () => {
    setCargando(true);
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .select('*')
        .order('nombre', { ascending: true });

      if (error) throw error;
      setUsuarios(data || []);
    } catch (error) {
      toast.error("No tienes permisos para ver esta sección");
    } finally {
      setCargando(false);
    }
  };

  const cambiarRol = async (id: string, nuevoRol: string) => {
    try {
      const { error } = await supabase
        .from('perfiles')
        .update({ rol: nuevoRol })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Permisos actualizados a ${nuevoRol}`);
      cargarUsuarios();
    } catch (error) {
      toast.error("Error al actualizar permisos");
    }
  };

  const eliminarAcceso = async (id: string) => {
    if (!window.confirm("¿Estás seguro de revocar el acceso a este usuario?")) return;
    
    try {
      // Nota: Aquí eliminamos el perfil, pero el usuario en Auth debe borrarse desde Supabase Auth
      const { error } = await supabase.from('perfiles').delete().eq('id', id);
      if (error) throw error;
      toast.success("Acceso revocado");
      cargarUsuarios();
    } catch (error) {
      toast.error("Error al eliminar usuario");
    }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  return (
    <div className="flex flex-col gap-6 h-full animate-in fade-in duration-500">
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Gestión de Personal</h1>
          <p className="text-slate-400 font-medium text-sm mt-1">Control de accesos y niveles de seguridad.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20">
          <UserPlus size={20} />
          Registrar Nuevo Empleado
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cargando ? (
          <div className="col-span-full p-12 text-center text-slate-500 font-bold animate-pulse">Sincronizando seguridad...</div>
        ) : usuarios.map((user) => (
          <div key={user.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-colors ${user.rol === 'Admin' ? 'bg-amber-500' : 'bg-blue-500'}`} />
            
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${user.rol === 'Admin' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                {user.rol === 'Admin' ? <ShieldCheck size={28} /> : <Users size={28} />}
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">{user.nombre}</h3>
                <div className="flex items-center gap-1 text-slate-500 text-xs font-bold uppercase">
                  <Mail size={12} /> {user.email}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nivel de Acceso</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => cambiarRol(user.id, 'Cajero')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${user.rol === 'Cajero' ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-500 hover:text-white'}`}
                >
                  Cajero
                </button>
                <button 
                  onClick={() => cambiarRol(user.id, 'Admin')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${user.rol === 'Admin' ? 'bg-amber-500 text-white' : 'bg-slate-950 text-slate-500 hover:text-white'}`}
                >
                  Admin
                </button>
              </div>
            </div>

            <button 
              onClick={() => eliminarAcceso(user.id)}
              className="mt-2 flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-500 hover:text-red-500 transition-colors"
            >
              <UserMinus size={14} /> Revocar Acceso
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}