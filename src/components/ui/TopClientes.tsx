// src/components/ui/TopClientes.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function TopClientes() {
  const [deudores, setDeudores] = useState<any[]>([]);

  useEffect(() => {
    const fetchDeudores = async () => {
      const { data } = await supabase
        .from('clientes')
        .select('nombre, deuda_actual')
        .gt('deuda_actual', 0)
        .order('deuda_actual', { ascending: false })
        .limit(5);
      if (data) setDeudores(data);
    };
    fetchDeudores();
  }, []);

  return (
    <div className="space-y-4">
      {deudores.map((c, i) => (
        <div key={i} className="flex justify-between items-center p-3 bg-slate-950 rounded-2xl border border-slate-800">
          <span className="text-slate-300 font-bold text-sm truncate max-w-[150px]">{c.nombre}</span>
          <span className="text-red-400 font-black text-sm">${c.deuda_actual.toLocaleString()}</span>
        </div>
      ))}
      {deudores.length === 0 && <p className="text-slate-500 text-sm text-center">No hay cuentas pendientes.</p>}
    </div>
  );
}