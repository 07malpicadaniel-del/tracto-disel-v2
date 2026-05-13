import { useState, useEffect } from 'react';
import { X, Wallet, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Cliente } from './ClientesTable'; // Importamos el tipo

interface AbonoClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: Cliente | null;
  onGuardado: () => void;
}

export default function AbonoClienteModal({ isOpen, onClose, cliente, onGuardado }: AbonoClienteModalProps) {
  const [cargando, setCargando] = useState(false);
  const [monto, setMonto] = useState('');

  // Limpiar el monto cada vez que se abre el modal
  useEffect(() => {
    if (isOpen) setMonto('');
  }, [isOpen]);

  if (!isOpen || !cliente) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const abonoFloat = parseFloat(monto);

    if (isNaN(abonoFloat) || abonoFloat <= 0) {
      alert("Por favor ingresa un monto válido mayor a 0.");
      return;
    }

    if (abonoFloat > cliente.deuda_actual) {
      alert(`El monto máximo a abonar es de $${cliente.deuda_actual.toFixed(2)}`);
      return;
    }

    setCargando(true);

    try {
      const nuevaDeuda = cliente.deuda_actual - abonoFloat;

      const { error } = await supabase
        .from('clientes')
        .update({ deuda_actual: nuevaDeuda })
        .eq('id', cliente.id);

      if (error) throw error;

      onGuardado();
      onClose();
    } catch (error) {
      console.error("Error al registrar abono:", error);
      alert("Ocurrió un error al procesar el abono.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col">
        
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/10 text-green-500 p-2 rounded-xl">
              <Wallet size={24} />
            </div>
            <h2 className="text-xl font-black text-white">Registrar Abono</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
            <p className="text-sm font-bold text-slate-400 mb-1">{cliente.nombre}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Deuda Actual</p>
            <p className="text-2xl font-black text-amber-500 mt-1">
              ${cliente.deuda_actual.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monto a Pagar</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
              <input 
                autoFocus 
                required
                type="number" step="0.01" max={cliente.deuda_actual}
                value={monto}
                onChange={e => setMonto(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-4 text-white font-bold text-lg outline-none focus:border-green-500 transition-colors"
                placeholder="0.00"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={cargando || !monto}
            className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mt-2"
          >
            <CheckCircle2 size={20} />
            {cargando ? 'Procesando...' : 'Confirmar Pago'}
          </button>
        </form>

      </div>
    </div>
  );
}