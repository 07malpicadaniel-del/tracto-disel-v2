import { useState, useEffect } from 'react';
import { X, Save, Edit3 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Producto } from '../../app/inventario/page';
import toast from 'react-hot-toast';

interface EditarProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  producto: Producto | null;
  onGuardado: () => void;
}

export default function EditarProductoModal({ isOpen, onClose, producto, onGuardado }: EditarProductoModalProps) {
  const [cargando, setCargando] = useState(false);
  const [formulario, setFormulario] = useState({
    no_parte: '', nombre: '', stock: '', minimo: '', costo: '', precio_publico: ''
  });

  // Rellenar los campos cuando se abre el modal con el producto seleccionado
  useEffect(() => {
    if (producto && isOpen) {
      setFormulario({
        no_parte: producto.no_parte,
        nombre: producto.nombre,
        stock: producto.stock.toString(),
        minimo: producto.minimo.toString(),
        costo: producto.costo.toString(),
        precio_publico: producto.precio_publico.toString()
      });
    }
  }, [producto, isOpen]);

  if (!isOpen || !producto) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    try {
      const { error } = await supabase
        .from('productos')
        .update({
          no_parte: formulario.no_parte,
          nombre: formulario.nombre,
          stock: Number(formulario.stock),
          minimo: Number(formulario.minimo),
          costo: Number(formulario.costo),
          precio_publico: Number(formulario.precio_publico)
        })
        .eq('id', producto.id);

      if (error) {
        if (error.code === '23505') toast.error('Ese Número de Parte ya existe.');
        else throw error;
        return;
      }

      toast.success('Refacción actualizada correctamente.');
      onGuardado();
      onClose();
    } catch (error) {
      console.error("Error al actualizar:", error);
      toast.error("Error al actualizar la pieza.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/10 text-amber-500 p-2 rounded-xl">
              <Edit3 size={24} />
            </div>
            <h2 className="text-xl font-black text-white">Editar Refacción</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white p-1"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Número de Parte</label>
              <input required type="text" value={formulario.no_parte} onChange={e => setFormulario({...formulario, no_parte: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Nombre / Aplicación</label>
              <input required type="text" value={formulario.nombre} onChange={e => setFormulario({...formulario, nombre: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Stock</label>
              <input required type="number" step="0.1" value={formulario.stock} onChange={e => setFormulario({...formulario, stock: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Mínimo</label>
              <input required type="number" step="0.1" value={formulario.minimo} onChange={e => setFormulario({...formulario, minimo: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Costo</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <input required type="number" step="0.01" value={formulario.costo} onChange={e => setFormulario({...formulario, costo: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-white outline-none focus:border-amber-500" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Precio Venta</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <input required type="number" step="0.01" value={formulario.precio_publico} onChange={e => setFormulario({...formulario, precio_publico: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-white outline-none focus:border-amber-500" />
              </div>
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