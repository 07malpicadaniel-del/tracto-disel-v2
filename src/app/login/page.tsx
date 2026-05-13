"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Lock, Mail, Truck, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Acceso autorizado. Bienvenido.');
      router.push('/'); // Redirigimos al Dashboard
    } catch (error: any) {
      console.error(error);
      toast.error('Credenciales incorrectas. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 selection:bg-blue-500/30">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-500">
        
        <div className="flex flex-col items-center justify-center mb-8 gap-3">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Truck size={32} className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-white tracking-tight">Tracto<span className="text-blue-500">-disel</span></h1>
            <p className="text-sm font-medium text-slate-400 mt-1">Panel de Administración B2B</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" 
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-blue-500 transition-colors"
                placeholder="admin@tractodisel.com"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-blue-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={cargando || !email || !password}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
          >
            {cargando ? <Loader2 className="animate-spin" size={20} /> : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="text-center text-xs font-medium text-slate-600 mt-8">
          Sistema de Acceso Restringido.
        </p>
      </div>
    </div>
  );
}