"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import NuevoProductoModal from '../../components/ui/NuevoProductoModal';
import InventarioHeader from '../../components/ui/InventarioHeader';
import InventarioTable from '../../components/ui/InventarioTable';

export interface Producto {
  id: string;
  no_parte: string;
  nombre: string;
  stock: number;
  minimo: number;
  costo: number;
  precio_publico: number;
}

export default function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);

  const cargarProductos = async () => {
    setCargando(true);
    try {
      let query = supabase.from('productos').select('*').order('created_at', { ascending: false });
      if (busqueda) {
        query = query.or(`no_parte.ilike.%${busqueda}%,nombre.ilike.%${busqueda}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      if (data) setProductos(data);
    } catch (error) {
      console.error("Error al cargar el inventario:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => cargarProductos(), 300);
    return () => clearTimeout(timeoutId);
  }, [busqueda]);

  const handleEliminar = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta refacción del catálogo?')) return;
    try {
      const { error } = await supabase.from('productos').delete().eq('id', id);
      if (error) throw error;
      cargarProductos();
    } catch (error) {
      console.error("Error al eliminar la pieza:", error);
      alert("No se pudo eliminar la pieza. Puede que esté ligada a una venta.");
    }
  };

  const handleEditar = (producto: Producto) => {
    alert(`Pronto abriremos el modal para editar: ${producto.nombre}`);
  };

  return (
    <div className="flex flex-col h-full">
      
      {/* Cabecera, Botón y Buscador */}
      <InventarioHeader 
        busqueda={busqueda} 
        setBusqueda={setBusqueda} 
        onNuevoProducto={() => setModalAbierto(true)} 
      />

      {/* Tabla de Resultados */}
      <InventarioTable 
        productos={productos} 
        cargando={cargando} 
        onEliminar={handleEliminar} 
        onEditar={handleEditar} 
      />

      {/* Modal Oculto que se activa con el botón */}
      <NuevoProductoModal 
        isOpen={modalAbierto} 
        onClose={() => setModalAbierto(false)} 
        onGuardado={cargarProductos} 
      />
      
    </div>
  );
}