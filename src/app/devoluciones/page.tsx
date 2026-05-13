"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import DevolucionesHeader from '../../components/ui/DevolucionesHeader';
import DevolucionesTable, { Devolucion } from '../../components/ui/DevolucionesTable';
import NuevaDevolucionModal from '../../components/ui/NuevaDevolucionModal';

export default function DevolucionesPage() {
  const [devoluciones, setDevoluciones] = useState<Devolucion[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);

  const cargarDevoluciones = async () => {
    setCargando(true);
    try {
      // Hacemos un JOIN con la tabla productos para traer su nombre
      let query = supabase
        .from('devoluciones')
        .select(`
          id, 
          motivo, 
          estado, 
          created_at,
          cantidad,
          productos (nombre, no_parte)
        `)
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      
      if (data) {
        // Mapeamos los datos de Supabase a la interfaz visual de nuestra tabla
        const formateadas: Devolucion[] = data.map((d: any) => ({
          id: d.id,
          folio_ticket: d.id.split('-')[0].toUpperCase(), // Usamos un fragmento del UUID como folio visual
          cliente: 'Registro Directo', // Para el MVP asumimos que se devuelve al mostrador general
          producto: d.productos ? `${d.productos.no_parte} - ${d.productos.nombre} (x${d.cantidad})` : 'Producto desconocido',
          motivo: d.motivo,
          estado: d.estado,
          fecha: d.created_at
        }));
        
        // Filtro local de búsqueda rápida
        const filtradas = busqueda 
          ? formateadas.filter(d => d.producto.toLowerCase().includes(busqueda.toLowerCase()) || d.folio_ticket.includes(busqueda.toUpperCase()))
          : formateadas;

        setDevoluciones(filtradas);
      }
    } catch (error) {
      console.error("Error al cargar devoluciones:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => cargarDevoluciones(), 300);
    return () => clearTimeout(timeoutId);
  }, [busqueda]);

  return (
    <div className="flex flex-col h-full">
      <DevolucionesHeader 
        busqueda={busqueda} 
        setBusqueda={setBusqueda} 
        onNuevaDevolucion={() => setModalAbierto(true)} 
      />
      
      <div className="mt-6 flex-1 flex flex-col min-h-0">
        <DevolucionesTable devoluciones={devoluciones} cargando={cargando} />
      </div>

      <NuevaDevolucionModal 
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onGuardado={cargarDevoluciones}
      />
    </div>
  );
}