"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

// Componentes UI
import InventarioHeader from '../../components/ui/InventarioHeader';
import InventarioTable from '../../components/ui/InventarioTable';

// Modales
import NuevoProductoModal from '../../components/ui/NuevoProductoModal';
import EditarProductoModal from '../../components/ui/EditarProductoModal';

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

  // Estados para Modales
  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState<Producto | null>(null);

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
      toast.error("Error al conectar con el catálogo de refacciones.");
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
      
      toast.success("Pieza eliminada correctamente.");
      cargarProductos();
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("No se puede eliminar una pieza con historial de ventas.");
    }
  };

  const handleAbrirEdicion = (producto: Producto) => {
    setProductoAEditar(producto);
    setModalEditarAbierto(true);
  };

  return (
    <div className="flex flex-col h-full gap-6">
      
      {/* 1. Cabecera y Buscador (Sin botón de IA) */}
      <InventarioHeader 
        busqueda={busqueda} 
        setBusqueda={setBusqueda} 
        onNuevoProducto={() => setModalNuevoAbierto(true)} 
      />

      {/* 2. Tabla de Datos */}
      <div className="flex-1 flex flex-col min-h-0">
        <InventarioTable 
          productos={productos} 
          cargando={cargando} 
          onEliminar={handleEliminar} 
          onEditar={handleAbrirEdicion} 
        />
      </div>

      {/* 3. Modales */}
      <NuevoProductoModal 
        isOpen={modalNuevoAbierto} 
        onClose={() => setModalNuevoAbierto(false)} 
        onGuardado={cargarProductos} 
      />

      <EditarProductoModal 
        isOpen={modalEditarAbierto}
        onClose={() => {
          setModalEditarAbierto(false);
          setProductoAEditar(null);
        }}
        producto={productoAEditar}
        onGuardado={cargarProductos}
      />
      
    </div>
  );
}