import { useState } from 'react';
import { X, Save, UserPlus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface NuevoClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGuardado: () => void;
}

export default function NuevoClienteModal({ isOpen, onClose, onGuardado }: NuevoClienteModalProps) {
  const [cargando, setCargando] = useState(false);
  const [formulario, setFormulario] = useState({
    nombre: '',
    telefono: '',
    limite_credito: '5000' // Un límite por defecto
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    try {
      const { error } = await supabase.from('clientes').insert([{
        nombre: formulario.nombre,
        telefono: formulario.telefono,
        limite_credito: Number(formulario.limite_credito) || 0,
        deuda_actual: 0 // Un cliente nuevo siempre empieza con deuda 0
      }]);

      if (error) throw error;

      onGuardado();
      onClose();
      setFormulario({ nombre: '', telefono: '', limite_credito: '5000' });
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      alert("Ocurrió un error al registrar al transportista.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 text-blue-500 p-2 rounded-xl">
              <UserPlus size={24} />
            </div>
            <h2 className="text-xl font-black text-white">Nuevo Transportista</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nombre Completo / Empresa</label>
            <input 
              autoFocus 
              required
              type="text" 
              value={formulario.nombre}
              onChange={e => setFormulario({...formulario, nombre: e.target.value})}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
              placeholder="Ej. Transportes del Golfo"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Teléfono de Contacto</label>
            <input 
              type="text" 
              value={formulario.telefono}
              onChange={e => setFormulario({...formulario, telefono: e.target.value})}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
              placeholder="Ej. 229 123 4567"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Límite de Crédito Autorizado</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <input 
                required
                type="number" step="0.01"
                value={formulario.limite_credito}
                onChange={e => setFormulario({...formulario, limite_credito: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-slate-800">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={cargando}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
            >
              <Save size={20} />
              {cargando ? 'Guardando...' : 'Registrar Cliente'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}