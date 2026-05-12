import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Definimos la estructura de datos
export interface Producto {
  id: string;
  no_parte: string;
  nombre: string;
  precio_publico: number;
  stock: number;
}

interface CatalogoProps {
  onAgregar: (producto: Producto) => void;
}

export default function CatalogoPOS({ onAgregar }: CatalogoProps) {
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  // Efecto para buscar en Supabase en tiempo real
  useEffect(() => {
    const buscarProductos = async () => {
      setCargando(true);
      try {
        let query = supabase.from('productos').select('*').limit(20);
        
        if (busqueda) {
          // Busca coincidencias en número de parte o nombre (ilike es insensible a mayúsculas)
          query = query.or(`no_parte.ilike.%${busqueda}%,nombre.ilike.%${busqueda}%`);
        }

        const { data } = await query;
        if (data) setProductos(data);
      } catch (error) {
        console.error("Error buscando productos:", error);
      } finally {
        setCargando(false);
      }
    };

    // Pequeño retraso (debounce) para no saturar la base de datos al teclear rápido
    const timeoutId = setTimeout(() => buscarProductos(), 300);
    return () => clearTimeout(timeoutId);
  }, [busqueda]);

  return (
    <div className="w-full lg:w-3/5 flex flex-col gap-4 h-full">
      {/* Buscador */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm">
        <h2 className="text-xl font-black text-white mb-4">Catálogo de Refacciones</h2>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Buscar por número de parte o nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 transition-all font-medium placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Resultados */}
      <div className="flex-1 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm overflow-y-auto">
        {cargando ? (
          <div className="text-center text-slate-500 mt-10 font-medium animate-pulse">Buscando...</div>
        ) : productos.length === 0 ? (
          <div className="text-center text-slate-500 mt-10 font-medium">No se encontraron piezas.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productos.map((prod) => (
              <div key={prod.id} className="p-4 border border-slate-800 bg-slate-950 rounded-2xl hover:border-blue-500/50 transition-colors flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-500">{prod.no_parte}</span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${prod.stock > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      Stock: {prod.stock}
                    </span>
                  </div>
                  <h3 className="font-bold text-white leading-tight mt-2">{prod.nombre}</h3>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-black text-blue-400">${(prod.precio_publico || 0).toFixed(2)}</span>
                  <button 
                    onClick={() => onAgregar(prod)}
                    disabled={prod.stock <= 0}
                    className="bg-slate-800 hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-slate-800 text-slate-300 hover:text-white p-2 rounded-xl transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}