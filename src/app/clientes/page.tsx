"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import ClientesHeader from '../../components/ui/ClientesHeader';
import ClientesTable, { Cliente } from '../../components/ui/ClientesTable';

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  const cargarClientes = async () => {
    setCargando(true);
    try {
      let query = supabase.from('clientes').select('*').order('created_at', { ascending: false });
      
      if (busqueda) {
        query = query.or(`nombre.ilike.%${busqueda}%,telefono.ilike.%${busqueda}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) setClientes(data);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => cargarClientes(), 300);
    return () => clearTimeout(timeoutId);
  }, [busqueda]);

  const handleEliminar = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar a este cliente? Se perderá su historial.')) return;
    try {
      const { error } = await supabase.from('clientes').delete().eq('id', id);
      if (error) throw error;
      cargarClientes();
    } catch (error) {
      alert("No se pudo eliminar. Puede que tenga ventas registradas asociadas.");
    }
  };

  const handleNuevoCliente = () => {
    alert("Pronto abriremos el modal para registrar un nuevo transportista.");
  };

  const handleEditarCliente = (cliente: Cliente) => {
    alert(`Pronto abriremos el modal para editar a: ${cliente.nombre}`);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* 1. Componente de Cabecera y Búsqueda */}
      <ClientesHeader 
        busqueda={busqueda} 
        setBusqueda={setBusqueda} 
        onNuevoCliente={handleNuevoCliente} 
      />

      {/* 2. Componente de Tabla */}
      <ClientesTable 
        clientes={clientes} 
        cargando={cargando} 
        onEliminar={handleEliminar}
        onEditar={handleEditarCliente}
      />
    </div>
  );
}