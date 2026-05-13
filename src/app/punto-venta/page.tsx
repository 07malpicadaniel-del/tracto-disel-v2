"use client";

import { useState, useRef } from 'react'; // Agregamos useRef para la impresión
import { useReactToPrint } from 'react-to-print'; // Hook para manejar la impresora
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

// Componentes UI
import CatalogoPOS, { Producto } from '../../components/ui/CatalogoPOS';
import TicketPOS, { ItemCarrito } from '../../components/ui/TicketPOS';
import SeleccionarClienteModal, { ClienteMinimo } from '../../components/ui/SeleccionarClienteModal';
import TicketImprimible from '../../components/ui/TicketImprimible'; // Componente del ticket físico

export default function PuntoVentaPage() {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [cargandoPago, setCargandoPago] = useState(false);
  const [modalClientesAbierto, setModalClientesAbierto] = useState(false);
  
  // Estado para guardar la información que se va a imprimir
  const [datosUltimaVenta, setDatosUltimaVenta] = useState<any>(null);
  
  // Referencia al componente invisible de impresión
  const componenteRef = useRef<HTMLDivElement>(null);

  // Configuración del motor de impresión
  const handlePrint = useReactToPrint({
    contentRef: componenteRef,
    documentTitle: "Ticket_TractoDisel",
  });

  const handleAgregar = (producto: Producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) return prev.map(item => item.id === producto.id ? { ...item, cantidad_venta: item.cantidad_venta + 1 } : item);
      return [...prev, { ...producto, cantidad_venta: 1 }];
    });
  };

  const handleActualizarCantidad = (id: string, nuevaCantidad: string) => {
    if (nuevaCantidad === '') return setCarrito(prev => prev.map(item => item.id === id ? { ...item, cantidad_venta: 0 } : item));
    const cantidadFloat = parseFloat(nuevaCantidad);
    if (isNaN(cantidadFloat) || cantidadFloat < 0) return;
    setCarrito(prev => prev.map(item => item.id === id ? { ...item, cantidad_venta: cantidadFloat } : item));
  };

  const handleEliminar = (id: string) => setCarrito(prev => prev.filter(item => item.id !== id));

  // EVALUADOR INICIAL DEL BOTÓN DE COBRO
  const iniciarCobro = (metodoPago: 'Efectivo' | 'Crédito') => {
    const itemsValidos = carrito.filter(item => item.cantidad_venta > 0);
    if (itemsValidos.length === 0) {
      toast.error("No hay cantidades válidas en el ticket.");
      return;
    }

    if (metodoPago === 'Crédito') {
      setModalClientesAbierto(true);
    } else {
      procesarTransaccion('Efectivo');
    }
  };

  // EL MOTOR DE TRANSACCIÓN MAESTRO
  const procesarTransaccion = async (metodoPago: 'Efectivo' | 'Crédito', cliente?: ClienteMinimo) => {
    setModalClientesAbierto(false);
    setCargandoPago(true);

    const itemsValidos = carrito.filter(item => item.cantidad_venta > 0);
    const totalVenta = itemsValidos.reduce((acc, item) => acc + (item.precio_publico * item.cantidad_venta), 0);

    try {
      // 1. Crear Venta
      const { data: ventaData, error: ventaError } = await supabase
        .from('ventas')
        .insert([{ 
          total: totalVenta, 
          metodo_pago: metodoPago,
          cliente_id: cliente ? cliente.id : null
        }])
        .select('id').single();

      if (ventaError) throw ventaError;

      // 2. Insertar Detalle
      const detallesInsert = itemsValidos.map(item => ({
        venta_id: ventaData.id, 
        producto_id: item.id, 
        cantidad: item.cantidad_venta,
        precio_unitario: item.precio_publico, 
        subtotal: item.precio_publico * item.cantidad_venta
      }));
      const { error: detallesError } = await supabase.from('detalle_ventas').insert(detallesInsert);
      if (detallesError) throw detallesError;

      // 3. Descontar Stock
      for (const item of itemsValidos) {
        await supabase.from('productos').update({ stock: item.stock - item.cantidad_venta }).eq('id', item.id);
      }

      // 4. Si fue crédito, sumarle la deuda al cliente
      if (metodoPago === 'Crédito' && cliente) {
        await supabase
          .from('clientes')
          .update({ deuda_actual: cliente.deuda_actual + totalVenta })
          .eq('id', cliente.id);
      }

      // 5. Preparar datos para el ticket físico ANTES de limpiar el carrito
      setDatosUltimaVenta({
        id: ventaData.id,
        total: totalVenta,
        metodo_pago: metodoPago,
        items: [...itemsValidos],
        cliente: cliente?.nombre
      });

      // 6. Toast de éxito
      toast.success(
        `Venta por $${totalVenta.toFixed(2)} exitosa. Preparando ticket...`
      );
      
      // 7. Disparar impresión y limpieza
      setTimeout(() => {
        handlePrint(); // Abre la ventana de impresión
        setCarrito([]);
        
        // Esperamos un poco más para que la tabla se refresque visualmente tras la impresión
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }, 800);

    } catch (error) {
      console.error("Error transaccional:", error);
      toast.error("Ocurrió un error al procesar la transacción.");
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
        onCobrar={iniciarCobro} 
      />
      
      <SeleccionarClienteModal 
        isOpen={modalClientesAbierto}
        onClose={() => setModalClientesAbierto(false)}
        onClienteSeleccionado={(cliente) => procesarTransaccion('Crédito', cliente)}
      />

      {/* Componente oculto que se activa solo al imprimir */}
      {datosUltimaVenta && (
        <div style={{ display: 'none' }}>
           <TicketImprimible ref={componenteRef} venta={datosUltimaVenta} />
        </div>
      )}
    </div>
  );
}