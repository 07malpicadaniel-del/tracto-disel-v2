import { forwardRef } from 'react';

interface TicketImprimibleProps {
  venta: {
    id: string;
    total: number;
    metodo_pago: string;
    items: any[];
    cliente?: string;
  };
}

const TicketImprimible = forwardRef<HTMLDivElement, TicketImprimibleProps>(({ venta }, ref) => {
  return (
    <div ref={ref} className="hidden print:block p-4 text-black bg-white w-[58mm] text-[10px] font-mono">
      <div className="text-center border-b border-dashed border-black pb-2 mb-2">
        <h2 className="text-sm font-bold uppercase">Tracto-disel v2</h2>
        <p>Heroica Veracruz, Ver.</p>
        <p>Tel: 229 XXX XXXX</p>
      </div>

      <div className="mb-2">
        <p>Folio: {venta.id.split('-')[0].toUpperCase()}</p>
        <p>Fecha: {new Date().toLocaleString()}</p>
        <p>Cliente: {venta.cliente || 'Público General'}</p>
      </div>

      <table className="w-full mb-2 border-b border-dashed border-black">
        <thead>
          <tr className="text-left">
            <th>Cant</th>
            <th>Desc</th>
            <th className="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {venta.items.map((item, i) => (
            <tr key={i}>
              <td>{item.cantidad_venta}</td>
              <td className="truncate max-w-[80px]">{item.nombre}</td>
              <td className="text-right">${(item.precio_publico * item.cantidad_venta).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right font-bold text-sm">
        <p>TOTAL: ${venta.total.toFixed(2)}</p>
      </div>

      <div className="text-center mt-4">
        <p className="uppercase">Gracias por su compra</p>
        <p className="mt-2 text-[8px]">Software by Malpica Benitez</p>
      </div>
    </div>
  );
});

TicketImprimible.displayName = 'TicketImprimible';
export default TicketImprimible;