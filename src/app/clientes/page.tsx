"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast'; // Notificaciones modernas
import { supabase } from '../../lib/supabase';

// Componentes UI
import ClientesHeader from '../../components/ui/ClientesHeader';
import ClientesTable, { Cliente } from '../../components/ui/ClientesTable';

// Modales
import NuevoClienteModal from '../../components/ui/NuevoClienteModal';
import EditarClienteModal from '../../components/ui/EditarClienteModal';
import AbonoClienteModal from '../../components/ui/AbonoClienteModal';

export default function ClientesPage() {
  // Estados de datos
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  // Estados de control para Modales
  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalAbonoAbierto, setModalAbonoAbierto] = useState(false);
  
  // Estado para el cliente activo en edición o abono
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);

  // Carga de datos desde Supabase
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
      toast.error("No se pudo conectar con la base de datos de clientes.");
    } finally {
      setCargando(false);
    }
  };

  // Efecto para búsqueda con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => cargarClientes(), 300);
    return () => clearTimeout(timeoutId);
  }, [busqueda]);

  // Manejadores de acciones
  const handleEliminar = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar a este cliente? Se borrará todo su historial de deudas.')) return;
    
    try {
      const { error } = await supabase.from('clientes').delete().eq('id', id);
      if (error) throw error;
      
      toast.success("Cliente eliminado del directorio.");
      cargarClientes();
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("No se puede eliminar un cliente con historial de ventas activo.");
    }
  };

  const handleAbrirEdicion = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setModalEditarAbierto(true);
  };

  const handleAbrirAbono = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setModalAbonoAbierto(true);
  };

  return (
    <div className="flex flex-col h-full gap-6">
      
      {/* 1. Cabecera y Buscador */}
      <ClientesHeader 
        busqueda={busqueda} 
        setBusqueda={setBusqueda} 
        onNuevoCliente={() => setModalNuevoAbierto(true)} 
      />

      {/* 2. Tabla de Clientes */}
      <div className="flex-1 flex flex-col min-h-0">
        <ClientesTable 
          clientes={clientes} 
          cargando={cargando} 
          onEliminar={handleEliminar}
          onEditar={handleAbrirEdicion}
          onAbonar={handleAbrirAbono}
        />
      </div>

      {/* 3. Ecosistema de Modales */}
      
      {/* Modal para Crear */}
      <NuevoClienteModal 
        isOpen={modalNuevoAbierto}
        onClose={() => setModalNuevoAbierto(false)}
        onGuardado={cargarClientes}
      />

      {/* Modal para Editar */}
      <EditarClienteModal 
        isOpen={modalEditarAbierto}
        onClose={() => {
          setModalEditarAbierto(false);
          setClienteSeleccionado(null);
        }}
        cliente={clienteSeleccionado}
        onGuardado={cargarClientes}
      />

      {/* Modal para Abonar a Deuda */}
      <AbonoClienteModal 
        isOpen={modalAbonoAbierto}
        onClose={() => {
          setModalAbonoAbierto(false);
          setClienteSeleccionado(null);
        }}
        cliente={clienteSeleccionado}
        onGuardado={cargarClientes}
      />

    </div>
  );
}
