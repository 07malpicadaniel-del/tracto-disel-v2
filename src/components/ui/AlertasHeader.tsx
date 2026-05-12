import { BellRing, ShieldAlert } from 'lucide-react';

interface AlertasHeaderProps {
  totalAlertas: number;
}

export default function AlertasHeader({ totalAlertas }: AlertasHeaderProps) {
  return (
    <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
          Centro de Alertas
          {totalAlertas > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              {totalAlertas} activas
            </span>
          )}
        </h1>
        <p className="text-slate-400 font-medium text-sm mt-1">Monitoreo automático de inventario crítico y piezas agotadas.</p>
      </div>
      <div className={`p-4 rounded-2xl flex items-center justify-center ${totalAlertas > 0 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
        {totalAlertas > 0 ? <ShieldAlert size={28} /> : <BellRing size={28} />}
      </div>
    </div>
  );
}