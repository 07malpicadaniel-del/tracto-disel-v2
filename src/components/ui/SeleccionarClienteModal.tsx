import { useState, useEffect } from 'react';
import { X, Search, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export interface ClienteMinimo {
  id: string;
  nombre: string;
  limite_credito: number;
  deuda_actual: number;
}

interface SeleccionarClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClienteSeleccionado: (cliente: ClienteMinimo) => void;
}

export default function SeleccionarClienteModal({ isOpen, onClose, onClienteSeleccionado }: SeleccionarClienteModalProps) {
  const [clientes, setClientes] = useState<ClienteMinimo[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);

  // Busca clientes en tiempo real cuando el modal está abierto
  useEffect(() => {
    if (!isOpen) return;
    
    const cargarClientes = async () => {
      setCargando(true);
      let query = supabase.from('clientes').select('id, nombre, limite_credito, deuda_actual');
      
      if (busqueda) {
        query = query.ilike('nombre', `%${busqueda}%`);
      }
      
      const { data } = await query.limit(10); // Traemos los primeros 10 para mayor velocidad
      if (data) setClientes(data);
      setCargando(false);
    };

    const timeoutId = setTimeout(cargarClientes, 300);
    return () => clearTimeout(timeoutId);
  }, [busqueda, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh]">
        
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-black text-white">Asignar a Crédito</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Buscador Integrado */}
        <div className="p-4 border-b border-slate-800 bg-slate-900">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                autoFocus 
                type="text" 
                placeholder="Buscar transportista..." 
                value={busqueda} 
                onChange={e => setBusqueda(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-blue-500 transition-colors" 
              />
           </div>
        </div>

        {/* Lista de Clientes con validación matemática */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cargando ? (
            <p className="text-center text-slate-500 mt-4 animate-pulse font-medium">Buscando directorio...</p>
          ) : clientes.length === 0 ? (
            <p className="text-center text-slate-500 mt-4 font-medium">No se encontraron clientes.</p>
          ) : (
            clientes.map(cliente => {
               // Calculamos si aún le alcanza
               const disponible = cliente.limite_credito - cliente.deuda_actual;
               const excedido = disponible <= 0;

               return (
                 <button 
                    key={cliente.id} 
                    disabled={excedido} 
                    onClick={() => onClienteSeleccionado(cliente)} 
                    className={`w-full text-left p-4 rounded-2xl border flex justify-between items-center transition-all group ${
                      excedido 
                        ? 'bg-slate-950/50 border-red-500/20 opacity-50 cursor-not-allowed' 
                        : 'bg-slate-950 border-slate-800 hover:border-blue-500 hover:bg-slate-800/50'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-white">{cliente.nombre}</p>
                      <p className={`text-xs mt-1 font-medium ${excedido ? 'text-red-400' : 'text-slate-400'}`}>
                        Crédito disponible: ${disponible.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <CheckCircle2 size={24} className={`${excedido ? 'text-slate-800' : 'text-slate-600 group-hover:text-blue-500 transition-colors'}`} />
                 </button>
               )
            })
          )}
        </div>
      </div>
    </div>
  );
}