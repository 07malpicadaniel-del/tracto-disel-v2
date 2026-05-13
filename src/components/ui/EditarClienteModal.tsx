import { useState, useEffect } from 'react';
import { X, Save, UserPen } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Cliente } from './ClientesTable';
import toast from 'react-hot-toast';

interface EditarClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: Cliente | null;
  onGuardado: () => void;
}

export default function EditarClienteModal({ isOpen, onClose, cliente, onGuardado }: EditarClienteModalProps) {
  const [cargando, setCargando] = useState(false);
  const [formulario, setFormulario] = useState({ nombre: '', telefono: '', limite_credito: '' });

  useEffect(() => {
    if (cliente && isOpen) {
      setFormulario({
        nombre: cliente.nombre,
        telefono: cliente.telefono || '',
        limite_credito: cliente.limite_credito.toString()
      });
    }
  }, [cliente, isOpen]);

  if (!isOpen || !cliente) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    try {
      const { error } = await supabase
        .from('clientes')
        .update({
          nombre: formulario.nombre,
          telefono: formulario.telefono,
          limite_credito: Number(formulario.limite_credito) || 0
        })
        .eq('id', cliente.id);

      if (error) throw error;

      toast.success('Cliente actualizado correctamente.');
      onGuardado();
      onClose();
    } catch (error) {
      console.error("Error al actualizar:", error);
      toast.error("Error al actualizar el cliente.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/10 text-amber-500 p-2 rounded-xl">
              <UserPen size={24} />
            </div>
            <h2 className="text-xl font-black text-white">Editar Transportista</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white p-1"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Nombre Completo / Empresa</label>
            <input required type="text" value={formulario.nombre} onChange={e => setFormulario({...formulario, nombre: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Teléfono de Contacto</label>
            <input type="text" value={formulario.telefono} onChange={e => setFormulario({...formulario, telefono: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Límite de Crédito Autorizado</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <input required type="number" step="0.01" value={formulario.limite_credito} onChange={e => setFormulario({...formulario, limite_credito: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-white outline-none focus:border-amber-500" />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-800">Cancelar</button>
            <button type="submit" disabled={cargando} className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
              <Save size={20} />
              {cargando ? 'Actualizando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}