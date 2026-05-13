"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Filter, Calendar, Download, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HistorialPage() {
  const [ventas, setVentas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroMetodo, setFiltroMetodo] = useState('Todos');

  const cargarHistorial = async () => {
    setCargando(true);
    try {
      let query = supabase
        .from('ventas')
        .select(`
          id, total, metodo_pago, created_at,
          clientes (nombre)
        `)
        .order('created_at', { ascending: false });

      if (filtroMetodo !== 'Todos') {
        query = query.eq('metodo_pago', filtroMetodo);
      }

      const { data, error } = await query;
      if (error) throw error;
      setVentas(data || []);
    } catch (error) {
      toast.error("Error al cargar el historial");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, [filtroMetodo]);

  // 🔥 FUNCIÓN MAESTRA DE EXPORTACIÓN
  const exportarCSV = () => {
    if (ventas.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }

    try {
      // 1. Definir encabezados
      const encabezados = ["Folio", "Fecha", "Cliente", "Metodo de Pago", "Total"];
      
      // 2. Formatear las filas
      const filas = ventas.map(v => [
        v.id.split('-')[0].toUpperCase(), // Folio corto
        new Date(v.created_at).toLocaleString('es-MX'), // Fecha legible
        v.clientes?.nombre || "Publico General", // Nombre cliente
        v.metodo_pago,
        v.total.toFixed(2)
      ]);

      // 3. Unir todo con comas y saltos de línea
      const contenidoCSV = [
        encabezados.join(","),
        ...filas.map(f => f.join(","))
      ].join("\n");

      // 4. Crear el archivo y disparar descarga
      const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      const fechaArchivo = new Date().toISOString().split('T')[0];
      link.setAttribute("href", url);
      link.setAttribute("download", `ventas_tractodisel_${fechaArchivo}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Archivo CSV generado con éxito");
    } catch (error) {
      console.error("Error exportando:", error);
      toast.error("Error al generar el archivo Excel");
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full animate-in fade-in duration-500">
      {/* Cabecera */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Historial de Transacciones</h1>
            <p className="text-slate-400 font-medium text-sm mt-1">Auditoría completa de ingresos.</p>
          </div>
          <div className="flex gap-2">
            {/* BOTÓN CONECTADO */}
            <button 
              onClick={exportarCSV}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all border border-slate-700 active:scale-95"
            >
              <Download size={18} /> 
              Exportar CSV
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <select 
              value={filtroMetodo}
              onChange={(e) => setFiltroMetodo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-blue-500 appearance-none font-bold"
            >
              <option value="Todos">Todos los Métodos</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Crédito">Crédito</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 opacity-50 cursor-not-allowed">
            <Calendar className="text-slate-500" size={18} />
            <span className="text-slate-500 text-xs font-bold uppercase">Desde (Próximamente)</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 opacity-50 cursor-not-allowed">
            <Calendar className="text-slate-500" size={18} />
            <span className="text-slate-500 text-xs font-bold uppercase">Hasta (Próximamente)</span>
          </div>
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">Folio / Fecha</th>
                <th className="p-4 font-bold">Cliente</th>
                <th className="p-4 font-bold text-center">Método</th>
                <th className="p-4 font-bold text-right">Total</th>
                <th className="p-4 font-bold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {cargando ? (
                <tr><td colSpan={5} className="p-8 text-center animate-pulse text-slate-500">Consultando base de datos...</td></tr>
              ) : ventas.length === 0 ? (
                <tr><td colSpan={5} className="p-12 text-center text-slate-500">No hay registros para mostrar.</td></tr>
              ) : (
                ventas.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="p-4">
                      <p className="font-bold text-white text-sm">#{v.id.split('-')[0].toUpperCase()}</p>
                      <p className="text-[10px] text-slate-500 font-bold">{new Date(v.created_at).toLocaleString()}</p>
                    </td>
                    <td className="p-4 text-sm font-bold text-slate-300">
                      {v.clientes?.nombre || 'Público General'}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border ${
                        v.metodo_pago === 'Efectivo' 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {v.metodo_pago}
                      </span>
                    </td>
                    <td className="p-4 text-right font-black text-white">
                      ${v.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button title="Ver detalle" className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition-colors">
                          <FileText size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}