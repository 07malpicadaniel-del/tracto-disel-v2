import { Search, Plus, Sparkles } from 'lucide-react';

interface InventarioHeaderProps {
  busqueda: string;
  setBusqueda: (valor: string) => void;
  onNuevoProducto: () => void;
}

export default function InventarioHeader({ busqueda, setBusqueda, onNuevoProducto }: InventarioHeaderProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera y Controles */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Catálogo de Productos</h1>
          <p className="text-slate-400 font-medium text-sm mt-1">Gestiona refacciones, existencias y precios.</p>
        </div>
        <button 
          onClick={onNuevoProducto}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20 whitespace-nowrap"
        >
          <Plus size={20} />
          Nuevo Producto
        </button>
      </div>

      {/* Buscador de Alta Velocidad */}
      <div className="flex gap-3">
        <div className="relative group flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Buscar por número de parte o aplicación..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-white rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500 transition-all font-medium placeholder:text-slate-500 shadow-sm"
          />
        </div>
        <button className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 px-6 rounded-2xl font-bold transition-colors flex items-center gap-2">
          <Sparkles size={20} />
          <span className="hidden sm:inline">Búsqueda IA</span>
        </button>
      </div>
    </div>
  );
}