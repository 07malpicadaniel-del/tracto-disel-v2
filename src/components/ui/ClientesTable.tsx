import { Edit, Trash2, UserX } from 'lucide-react';

export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  limite_credito: number;
  deuda_actual: number;
}

interface ClientesTableProps {
  clientes: Cliente[];
  cargando: boolean;
  onEliminar: (id: string) => void;
  onEditar: (cliente: Cliente) => void;
}

export default function ClientesTable({ clientes, cargando, onEliminar, onEditar }: ClientesTableProps) {
  return (
    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
              <th className="p-4 font-bold">Nombre del Cliente</th>
              <th className="p-4 font-bold">Teléfono</th>
              <th className="p-4 font-bold text-right">Límite de Crédito</th>
              <th className="p-4 font-bold text-right">Deuda Actual</th>
              <th className="p-4 font-bold text-center">Estado</th>
              <th className="p-4 font-bold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {cargando ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500 font-medium animate-pulse">
                  Cargando directorio...
                </td>
              </tr>
            ) : clientes.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-500">
                    <UserX size={48} className="text-slate-700" />
                    <p className="font-medium text-lg text-slate-400">No hay clientes registrados.</p>
                  </div>
                </td>
              </tr>
            ) : (
              clientes.map((cliente) => {
                const creditoExcedido = cliente.deuda_actual > cliente.limite_credito;
                
                return (
                  <tr key={cliente.id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="p-4 font-bold text-white">{cliente.nombre}</td>
                    <td className="p-4 font-medium text-slate-400">{cliente.telefono || 'Sin registro'}</td>
                    <td className="p-4 text-right font-medium text-slate-300">
                      ${(cliente.limite_credito || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`p-4 text-right font-black ${cliente.deuda_actual > 0 ? 'text-amber-500' : 'text-slate-500'}`}>
                      ${(cliente.deuda_actual || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        creditoExcedido 
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                          : cliente.deuda_actual > 0 
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-green-500/10 text-green-400 border border-green-500/20'
                      }`}>
                        {creditoExcedido ? 'Excedido' : cliente.deuda_actual > 0 ? 'Con Deuda' : 'Al Corriente'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEditar(cliente)}
                          className="p-2 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => onEliminar(cliente.id)}
                          className="p-2 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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