"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import DevolucionesHeader from '../../components/ui/DevolucionesHeader';
import DevolucionesTable, { Devolucion } from '../../components/ui/DevolucionesTable';

export default function DevolucionesPage() {
  const [devoluciones, setDevoluciones] = useState<Devolucion[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDevoluciones = async () => {
      setCargando(true);
      try {
        // Intentamos cargar de Supabase. Si la tabla no existe aún, fallará silenciosamente
        let query = supabase.from('devoluciones').select('*').order('created_at', { ascending: false });
        
        if (busqueda) {
          query = query.or(`folio_ticket.ilike.%${busqueda}%,cliente.ilike.%${busqueda}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        
        if (data) setDevoluciones(data as any);
      } catch (error) {
        // Ignoramos el error en consola si es porque la tabla no existe (PGRST204/42P01)
        // console.error("Error al cargar devoluciones:", error);
      } finally {
        setCargando(false);
      }
    };

    const timeoutId = setTimeout(() => cargarDevoluciones(), 300);
    return () => clearTimeout(timeoutId);
  }, [busqueda]);

  const handleNuevaDevolucion = () => {
    alert("Pronto abriremos el modal para procesar una nueva garantía o retorno.");
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <DevolucionesHeader 
        busqueda={busqueda} 
        setBusqueda={setBusqueda} 
        onNuevaDevolucion={handleNuevaDevolucion} 
      />
      <DevolucionesTable devoluciones={devoluciones} cargando={cargando} />
    </div>
  );
}