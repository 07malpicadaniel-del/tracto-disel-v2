import { ShoppingCart, Trash2, Banknote, CreditCard, Loader2 } from 'lucide-react';
import { Producto } from './CatalogoPOS';

export interface ItemCarrito extends Producto {
  cantidad_venta: number;
}

interface TicketProps {
  carrito: ItemCarrito[];
  cargandoPago: boolean; // Para deshabilitar botones mientras procesa
  onActualizarCantidad: (id: string, cantidad: string) => void;
  onEliminar: (id: string) => void;
  onCobrar: (metodo: 'Efectivo' | 'Crédito') => void; // Nueva función
}

export default function TicketPOS({ carrito, cargandoPago, onActualizarCantidad, onEliminar, onCobrar }: TicketProps) {
  const totalTicket = carrito.reduce((acc, item) => acc + ((item.precio_publico || 0) * item.cantidad_venta), 0);

  return (
    <div className="w-full lg:w-2/5 flex flex-col gap-4 h-[calc(100vh-6rem)]">
      <div className="bg-slate-950 rounded-3xl shadow-xl flex flex-col h-full overflow-hidden border border-slate-800 relative">
        
        <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-900/50">
          <ShoppingCart className="text-blue-500" size={24} />
          <h2 className="text-xl font-black text-white">Ticket de Venta</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {carrito.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 font-medium text-sm text-center gap-2">
              <ShoppingCart size={48} className="text-slate-800 mb-2" />
              <p>El ticket está vacío.<br/>Busca y agrega refacciones.</p>
            </div>
          ) : (
            carrito.map((item) => (
              <div key={item.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col gap-3 transition-all hover:border-slate-700">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500">{item.no_parte}</span>
                    <p className="text-sm font-bold text-slate-200 leading-tight">{item.nombre}</p>
                  </div>
                  <button onClick={() => onEliminar(item.id)} disabled={cargandoPago} className="text-slate-600 hover:text-red-400 disabled:opacity-50 p-1 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Cant:</span>
                    <input 
                      type="number" step="0.1" min="0"
                      disabled={cargandoPago}
                      value={item.cantidad_venta === 0 ? '' : item.cantidad_venta}
                      onChange={(e) => onActualizarCantidad(item.id, e.target.value)}
                      className="w-20 bg-slate-950 border border-slate-700 rounded-lg py-1 px-2 text-white font-bold text-sm outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                    />
                  </div>
                  <span className="font-bold text-white text-lg">
                    ${((item.precio_publico || 0) * item.cantidad_venta).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Botones de Cobro Conectados */}
        <div className="p-6 bg-slate-900 border-t border-slate-800">
          <div className="flex justify-between items-end mb-6">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-sm">Total a cobrar:</span>
            <span className="text-4xl font-black text-blue-400">${totalTicket.toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => onCobrar('Efectivo')}
              disabled={carrito.length === 0 || cargandoPago}
              className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              {cargandoPago ? <Loader2 className="animate-spin" size={20} /> : <Banknote size={20} />}
              Efectivo
            </button>
            <button 
              onClick={() => onCobrar('Crédito')}
              disabled={carrito.length === 0 || cargandoPago}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              {cargandoPago ? <Loader2 className="animate-spin" size={20} /> : <CreditCard size={20} />}
              Crédito
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}