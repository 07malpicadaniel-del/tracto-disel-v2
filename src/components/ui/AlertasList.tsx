import { PackageX, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Usamos la misma estructura de producto
export interface ProductoAlerta {
  id: string;
  no_parte: string;
  nombre: string;
  stock: number;
  minimo: number;
}

interface AlertasListProps {
  productos: ProductoAlerta[];
  cargando: boolean;
}

export default function AlertasList({ productos, cargando }: AlertasListProps) {
  // Filtramos la lógica matemática aquí para dejar el page.tsx limpio
  const agotados = productos.filter(p => p.stock === 0);
  const stockBajo = productos.filter(p => p.stock > 0 && p.stock <= p.minimo);

  if (cargando) {
    return (
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-12 flex items-center justify-center">
        <span className="text-slate-500 font-medium animate-pulse">Escaneando inventario...</span>
      </div>
    );
  }

  if (agotados.length === 0 && stockBajo.length === 0) {
    return (
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
          <AlertTriangle size={32} />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-white">Inventario Saludable</h3>
          <p className="text-slate-400 mt-1">No hay piezas por debajo de su límite mínimo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-8 pb-6">
      
      {/* SECCIÓN 1: AGOTADOS (Prioridad Roja) */}
      {agotados.length > 0 && (
        <section>
          <h2 className="text-red-500 font-bold uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
            <PackageX size={18} />
            Refacciones Agotadas ({agotados.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {agotados.map(prod => (
              <div key={prod.id} className="bg-slate-900 border border-red-500/30 p-5 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                <span className="text-[10px] font-bold text-slate-500">{prod.no_parte}</span>
                <h3 className="font-bold text-white leading-tight mt-1 mb-3">{prod.nombre}</h3>
                <div className="flex items-center justify-between">
                  <span className="bg-red-500/10 text-red-400 text-xs font-bold px-2 py-1 rounded-md">Stock: 0</span>
                  <Link href="/inventario" className="text-slate-400 hover:text-white transition-colors">
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECCIÓN 2: STOCK BAJO (Prioridad Amarilla) */}
      {stockBajo.length > 0 && (
        <section>
          <h2 className="text-amber-500 font-bold uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
            <AlertTriangle size={18} />
            Por debajo del mínimo ({stockBajo.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {stockBajo.map(prod => (
              <div key={prod.id} className="bg-slate-900 border border-amber-500/30 p-5 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                <span className="text-[10px] font-bold text-slate-500">{prod.no_parte}</span>
                <h3 className="font-bold text-white leading-tight mt-1 mb-3">{prod.nombre}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="bg-amber-500/10 text-amber-400 text-xs font-bold px-2 py-1 rounded-md">Stock: {prod.stock}</span>
                    <span className="bg-slate-800 text-slate-400 text-xs font-bold px-2 py-1 rounded-md">Mín: {prod.minimo}</span>
                  </div>
                  <Link href="/inventario" className="text-slate-400 hover:text-white transition-colors">
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}