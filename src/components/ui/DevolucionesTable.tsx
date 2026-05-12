import { PackageOpen, CheckCircle2, XCircle, Clock } from 'lucide-react';

export interface Devolucion {
  id: string;
  folio_ticket: string;
  cliente: string;
  producto: string;
  motivo: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  fecha: string;
}

interface DevolucionesTableProps {
  devoluciones: Devolucion[];
  cargando: boolean;
}

export default function DevolucionesTable({ devoluciones, cargando }: DevolucionesTableProps) {
  
  // Helpers para pintar los estados visualmente
  const estadoConfig = {
    pendiente: { color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: Clock, texto: 'Pendiente' },
    aprobada: { color: 'text-green-400 bg-green-500/10 border-green-500/20', icon: CheckCircle2, texto: 'Aprobada' },
    rechazada: { color: 'text-red-400 bg-red-500/10 border-red-500/20', icon: XCircle, texto: 'Rechazada' }
  };

  return (
    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
              <th className="p-4 font-bold">Ticket</th>
              <th className="p-4 font-bold">Cliente / Producto</th>
              <th className="p-4 font-bold">Motivo</th>
              <th className="p-4 font-bold text-center">Estado</th>
              <th className="p-4 font-bold text-right">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {cargando ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 font-medium animate-pulse">
                  Cargando registros...
                </td>
              </tr>
            ) : devoluciones.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-500">
                    <PackageOpen size={48} className="text-slate-700" />
                    <p className="font-medium text-lg text-slate-400">Sin devoluciones registradas.</p>
                  </div>
                </td>
              </tr>
            ) : (
              devoluciones.map((dev) => {
                const config = estadoConfig[dev.estado];
                const Icono = config.icon;

                return (
                  <tr key={dev.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-bold text-blue-400">#{dev.folio_ticket}</td>
                    <td className="p-4">
                      <p className="font-bold text-white">{dev.cliente}</p>
                      <p className="text-xs text-slate-400 mt-1">{dev.producto}</p>
                    </td>
                    <td className="p-4 font-medium text-slate-300">{dev.motivo}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${config.color}`}>
                        <Icono size={14} />
                        {config.texto}
                      </span>
                    </td>
                    <td className="p-4 text-right font-medium text-slate-500">
                      {new Date(dev.fecha).toLocaleDateString('es-MX')}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}