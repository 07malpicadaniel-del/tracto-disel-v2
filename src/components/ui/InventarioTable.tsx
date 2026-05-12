import { Edit, Trash2, PackageOpen } from 'lucide-react';
import { Producto } from '../../app/inventario/page'; // Importamos la interfaz del padre

interface InventarioTableProps {
  productos: Producto[];
  cargando: boolean;
  onEliminar: (id: string) => void;
  onEditar: (producto: Producto) => void;
}

export default function InventarioTable({ productos, cargando, onEliminar, onEditar }: InventarioTableProps) {
  return (
    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
              <th className="p-4 font-bold">No. Parte</th>
              <th className="p-4 font-bold">Nombre / Aplicación</th>
              <th className="p-4 font-bold text-center">Stock</th>
              <th className="p-4 font-bold text-right">Costo (Secreto)</th>
              <th className="p-4 font-bold text-right">Precio Público</th>
              <th className="p-4 font-bold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {cargando ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500 font-medium animate-pulse">
                  Cargando inventario...
                </td>
              </tr>
            ) : productos.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-500">
                    <PackageOpen size={48} className="text-slate-700" />
                    <p className="font-medium text-lg text-slate-400">El catálogo está vacío.</p>
                    <p className="text-sm">Agrega tu primer producto para comenzar a vender.</p>
                  </div>
                </td>
              </tr>
            ) : (
              productos.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="p-4 font-bold text-slate-300">{prod.no_parte}</td>
                  <td className="p-4">
                    <p className="font-bold text-white">{prod.nombre}</p>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      prod.stock <= prod.minimo 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                        : 'bg-green-500/10 text-green-400 border border-green-500/20'
                    }`}>
                      {prod.stock} {prod.stock <= prod.minimo && ' (Bajo)'}
                    </span>
                  </td>
                  <td className="p-4 text-right font-medium text-slate-500">
                    ${(prod.costo || 0).toFixed(2)}
                  </td>
                  <td className="p-4 text-right font-black text-blue-400">
                    ${(prod.precio_publico || 0).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEditar(prod)}
                        className="p-2 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => onEliminar(prod.id)}
                        className="p-2 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}