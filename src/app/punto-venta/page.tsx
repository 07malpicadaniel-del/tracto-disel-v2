"use client";

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import CatalogoPOS, { Producto } from '../../components/ui/CatalogoPOS';
import TicketPOS, { ItemCarrito } from '../../components/ui/TicketPOS';

export default function PuntoVentaPage() {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [cargandoPago, setCargandoPago] = useState(false);

  const handleAgregar = (producto: Producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        return prev.map(item => item.id === producto.id ? { ...item, cantidad_venta: item.cantidad_venta + 1 } : item);
      }
      return [...prev, { ...producto, cantidad_venta: 1 }];
    });
  };

  const handleActualizarCantidad = (id: string, nuevaCantidad: string) => {
    if (nuevaCantidad === '') {
      setCarrito(prev => prev.map(item => item.id === id ? { ...item, cantidad_venta: 0 } : item));
      return;
    }
    const cantidadFloat = parseFloat(nuevaCantidad);
    if (isNaN(cantidadFloat) || cantidadFloat < 0) return;
    setCarrito(prev => prev.map(item => item.id === id ? { ...item, cantidad_venta: cantidadFloat } : item));
  };

  const handleEliminar = (id: string) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  // EL MOTOR DE COBRO
  const handleCobrar = async (metodoPago: 'Efectivo' | 'Crédito') => {
    if (carrito.length === 0) return;
    
    // Filtramos para evitar cobrar items con cantidad 0
    const itemsValidos = carrito.filter(item => item.cantidad_venta > 0);
    if (itemsValidos.length === 0) {
      alert("No hay cantidades válidas en el ticket.");
      return;
    }

    if (metodoPago === 'Crédito') {
      // Dejamos un aviso porque pronto conectaremos el modal de clientes aquí
      alert("Aviso: Actualmente la venta a Crédito se registrará como venta libre. Pronto conectaremos el selector de Clientes.");
    }

    setCargandoPago(true);

    try {
      // Calculamos el gran total
      const totalVenta = itemsValidos.reduce((acc, item) => acc + (item.precio_publico * item.cantidad_venta), 0);

      // PASO 1: Crear la Venta Maestra
      const { data: ventaData, error: ventaError } = await supabase
        .from('ventas')
        .insert([{ total: totalVenta, metodo_pago: metodoPago }])
        .select('id')
        .single(); // Pedimos que nos devuelva el ID recién creado

      if (ventaError) throw ventaError;
      const ventaId = ventaData.id;

      // PASO 2: Preparar e insertar los detalles (Partidas del ticket)
      const detallesInsert = itemsValidos.map(item => ({
        venta_id: ventaId,
        producto_id: item.id,
        cantidad: item.cantidad_venta,
        precio_unitario: item.precio_publico,
        subtotal: item.precio_publico * item.cantidad_venta
      }));

      const { error: detallesError } = await supabase.from('detalle_ventas').insert(detallesInsert);
      if (detallesError) throw detallesError;

      // PASO 3: Descontar el Stock del Inventario
      for (const item of itemsValidos) {
        const nuevoStock = item.stock - item.cantidad_venta;
        await supabase
          .from('productos')
          .update({ stock: nuevoStock })
          .eq('id', item.id);
      }

      // ÉXITO: Limpiamos y avisamos
      alert(`✅ ¡Cobro exitoso por $${totalVenta.toFixed(2)} en ${metodoPago}!`);
      setCarrito([]); // Vaciamos el carrito

      // Pequeño hack para forzar al componente del catálogo a recargarse y mostrar el nuevo stock
      window.location.reload(); 

    } catch (error) {
      console.error("Error crítico al procesar cobro:", error);
      alert("Ocurrió un error al intentar cobrar. Revisa tu consola.");
    } finally {
      setCargandoPago(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <CatalogoPOS onAgregar={handleAgregar} />
      
      <TicketPOS 
        carrito={carrito} 
        cargandoPago={cargandoPago}
        onActualizarCantidad={handleActualizarCantidad} 
        onEliminar={handleEliminar}
        onCobrar={handleCobrar} 
      />
    </div>
  );
}