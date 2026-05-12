import { useState } from 'react';
import { X, Save, PackagePlus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface NuevoProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGuardado: () => void; // Función para recargar la tabla al terminar
}

export default function NuevoProductoModal({ isOpen, onClose, onGuardado }: NuevoProductoModalProps) {
  const [cargando, setCargando] = useState(false);
  const [formulario, setFormulario] = useState({
    no_parte: '',
    nombre: '',
    stock: '',
    minimo: '5',
    costo: '',
    precio_publico: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    try {
      const { error } = await supabase.from('productos').insert([{
        no_parte: formulario.no_parte,
        nombre: formulario.nombre,
        stock: Number(formulario.stock) || 0,
        minimo: Number(formulario.minimo) || 0,
        costo: Number(formulario.costo) || 0,
        precio_publico: Number(formulario.precio_publico) || 0
      }]);

      if (error) {
        if (error.code === '23505') alert('Error: Ya existe una pieza con este Número de Parte.');
        else throw error;
        return;
      }

      onGuardado(); // Recarga la tabla de inventario
      onClose(); // Cierra el modal
      // Limpiamos el formulario
      setFormulario({ no_parte: '', nombre: '', stock: '', minimo: '5', costo: '', precio_publico: '' });
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("Ocurrió un error al guardar la pieza.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Cabecera */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 text-blue-500 p-2 rounded-xl">
              <PackagePlus size={24} />
            </div>
            <h2 className="text-xl font-black text-white">Nueva Refacción</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1">
            <X size={24} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Número de Parte</label>
              <input 
                autoFocus // Keyboard-first: Empieza a escribir de inmediato
                required
                type="text" 
                value={formulario.no_parte}
                onChange={e => setFormulario({...formulario, no_parte: e.target.value})}
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                placeholder="Ej. ACE-15W40"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nombre / Aplicación</label>
              <input 
                required
                type="text" 
                value={formulario.nombre}
                onChange={e => setFormulario({...formulario, nombre: e.target.value})}
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                placeholder="Ej. Aceite Motor 15W40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stock</label>
              <input 
                required
                type="number" step="0.1"
                value={formulario.stock}
                onChange={e => setFormulario({...formulario, stock: e.target.value})}
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mínimo</label>
              <input 
                required
                type="number" step="0.1"
                value={formulario.minimo}
                onChange={e => setFormulario({...formulario, minimo: e.target.value})}
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Costo</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <input 
                  required
                  type="number" step="0.01"
                  value={formulario.costo}
                  onChange={e => setFormulario({...formulario, costo: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Precio Venta</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <input 
                  required
                  type="number" step="0.01"
                  value={formulario.precio_publico}
                  onChange={e => setFormulario({...formulario, precio_publico: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                />
              </div>
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
              {cargando ? 'Guardando...' : 'Guardar Refacción'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}