import { useState, useEffect } from 'react';
import { X, Search, Undo2, CheckCircle2, Package } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ProductoMinimo {
  id: string;
  no_parte: string;
  nombre: string;
  stock: number;
}

interface NuevaDevolucionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGuardado: () => void;
}

export default function NuevaDevolucionModal({ isOpen, onClose, onGuardado }: NuevaDevolucionModalProps) {
  const [paso, setPaso] = useState<1 | 2>(1);
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState<ProductoMinimo[]>([]);
  const [cargando, setCargando] = useState(false);
  
  const [productoSel, setProductoSel] = useState<ProductoMinimo | null>(null);
  const [formulario, setFormulario] = useState({ cantidad: '', motivo: 'Garantía / Defecto de fábrica' });

  // Resetear el modal al abrir
  useEffect(() => {
    if (isOpen) {
      setPaso(1); setBusqueda(''); setProductos([]); setProductoSel(null); setFormulario({ cantidad: '', motivo: 'Garantía / Defecto de fábrica' });
    }
  }, [isOpen]);

  // Buscador en tiempo real de refacciones
  useEffect(() => {
    if (!isOpen || paso !== 1) return;
    const buscar = async () => {
      setCargando(true);
      let query = supabase.from('productos').select('id, no_parte, nombre, stock');
      if (busqueda) query = query.or(`no_parte.ilike.%${busqueda}%,nombre.ilike.%${busqueda}%`);
      const { data } = await query.limit(5);
      if (data) setProductos(data);
      setCargando(false);
    };
    const timeoutId = setTimeout(buscar, 300);
    return () => clearTimeout(timeoutId);
  }, [busqueda, isOpen, paso]);

  const handleSeleccionarProducto = (prod: ProductoMinimo) => {
    setProductoSel(prod);
    setPaso(2); // Pasamos al formulario de cantidad y motivo
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cantDevuelta = parseFloat(formulario.cantidad);
    if (isNaN(cantDevuelta) || cantDevuelta <= 0 || !productoSel) return;

    setCargando(true);
    try {
      // 1. Insertamos el registro de la devolución (La marcamos como aprobada directamente para el MVP)
      const { error: devError } = await supabase.from('devoluciones').insert([{
        producto_id: productoSel.id,
        cantidad: cantDevuelta,
        motivo: formulario.motivo,
        estado: 'aprobada' 
      }]);
      if (devError) throw devError;

      // 2. Regresamos la pieza al inventario (Stock actual + cantidad devuelta)
      const { error: stockError } = await supabase.from('productos')
        .update({ stock: productoSel.stock + cantDevuelta })
        .eq('id', productoSel.id);
      if (stockError) throw stockError;

      onGuardado();
      onClose();
    } catch (error) {
      console.error("Error al procesar devolución:", error);
      alert("Ocurrió un error al procesar el retorno de inventario.");
    } finally {
      setCargando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/10 text-indigo-500 p-2 rounded-xl">
              <Undo2 size={24} />
            </div>
            <h2 className="text-xl font-black text-white">Retorno de Inventario</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1">
            <X size={24} />
          </button>
        </div>

        {paso === 1 ? (
          // PASO 1: BUSCADOR DE PIEZAS
          <div className="flex flex-col flex-1 min-h-0">
            <div className="p-4 border-b border-slate-800">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  autoFocus type="text" placeholder="Buscar pieza a devolver..." 
                  value={busqueda} onChange={e => setBusqueda(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-indigo-500 transition-colors" 
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {cargando ? <p className="text-center text-slate-500 mt-4 animate-pulse">Buscando...</p> : 
               productos.length === 0 ? <p className="text-center text-slate-500 mt-4">No hay resultados.</p> :
               productos.map(prod => (
                 <button key={prod.id} onClick={() => handleSeleccionarProducto(prod)} className="w-full text-left p-4 rounded-xl border border-slate-800 bg-slate-950 hover:border-indigo-500 hover:bg-slate-800/50 transition-all flex items-center justify-between group">
                   <div>
                     <p className="text-xs font-bold text-slate-500">{prod.no_parte}</p>
                     <p className="font-bold text-white mt-0.5">{prod.nombre}</p>
                   </div>
                   <Package className="text-slate-600 group-hover:text-indigo-400 transition-colors" size={20} />
                 </button>
               ))}
            </div>
          </div>
        ) : (
          // PASO 2: FORMULARIO DE CANTIDAD Y MOTIVO
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 overflow-y-auto">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <p className="text-xs font-bold text-slate-500">{productoSel?.no_parte}</p>
              <p className="font-bold text-white mt-0.5">{productoSel?.nombre}</p>
              <p className="text-xs text-indigo-400 font-medium mt-2">Stock actual: {productoSel?.stock}</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cantidad a regresar al stock</label>
              <input 
                autoFocus required type="number" step="0.1" min="0.1"
                value={formulario.cantidad} onChange={e => setFormulario({...formulario, cantidad: e.target.value})}
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-indigo-500 transition-colors"
                placeholder="Ej. 1"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Motivo del retorno</label>
              <select 
                value={formulario.motivo} onChange={e => setFormulario({...formulario, motivo: e.target.value})}
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors appearance-none"
              >
                <option>Garantía / Defecto de fábrica</option>
                <option>Pieza equivocada / No le quedó</option>
                <option>Cancelación de venta</option>
                <option>Ajuste manual de inventario</option>
              </select>
            </div>

            <div className="flex justify-between items-center mt-4 pt-6 border-t border-slate-800">
              <button type="button" onClick={() => setPaso(1)} className="text-slate-400 hover:text-white text-sm font-bold transition-colors">
                ← Volver a buscar
              </button>
              <button type="submit" disabled={cargando || !formulario.cantidad} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2">
                <CheckCircle2 size={20} />
                {cargando ? 'Procesando...' : 'Aprobar Retorno'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}