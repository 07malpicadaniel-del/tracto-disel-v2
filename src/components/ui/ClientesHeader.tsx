import { Search, UserPlus } from 'lucide-react';

interface ClientesHeaderProps {
  busqueda: string;
  setBusqueda: (valor: string) => void;
  onNuevoCliente: () => void;
}

export default function ClientesHeader({ busqueda, setBusqueda, onNuevoCliente }: ClientesHeaderProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Directorio de Clientes</h1>
          <p className="text-slate-400 font-medium text-sm mt-1">Gestiona créditos, deudas y datos de contacto de transportistas.</p>
        </div>
        <button 
          onClick={onNuevoCliente}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20 whitespace-nowrap"
        >
          <UserPlus size={20} />
          Nuevo Cliente
        </button>
      </div>

      <div className="relative group w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
        <input
          type="text"
          placeholder="Buscar transportista por nombre o teléfono..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 text-white rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500 transition-all font-medium placeholder:text-slate-500 shadow-sm"
        />
      </div>
    </div>
  );
}