import { TrendingUp, DollarSign, AlertTriangle, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import MetricCard from '../components/ui/MetricCard';
import GraficaVentas from '../components/ui/GraficaVentas';
import TopClientes from '../components/ui/TopClientes';

async function obtenerMetricas() {
  try {
    const hoy = new Date().toISOString().split('T')[0];
    const { data: ventas } = await supabase.from('ventas').select('total').gte('created_at', `${hoy}T00:00:00Z`);
    const { data: clientes } = await supabase.from('clientes').select('deuda_actual').gt('deuda_actual', 0);
    const { count: totalCatalogo } = await supabase.from('productos').select('*', { count: 'exact', head: true });
    
    return {
      ingresosHoy: ventas?.reduce((acc, v) => acc + (v.total || 0), 0) || 0,
      cuentasCobrar: clientes?.reduce((acc, c) => acc + (c.deuda_actual || 0), 0) || 0,
      alertasStock: 3, // Ejemplo estático por ahora
      totalCatalogo: totalCatalogo || 0
    };
  } catch (e) {
    return { ingresosHoy: 0, cuentasCobrar: 0, alertasStock: 0, totalCatalogo: 0 };
  }
}

export default async function DashboardPage() {
  const m = await obtenerMetricas();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight">Centro de Mando</h1>
        <p className="text-slate-500 font-medium mt-1">Resumen gerencial en tiempo real.</p>
      </header>

      {/* Grid de Métricas usando el nuevo componente */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Ingresos Hoy" value={`$${m.ingresosHoy.toLocaleString()}`} icon={TrendingUp} variant="green" />
        <MetricCard title="Por Cobrar" value={`$${m.cuentasCobrar.toLocaleString()}`} icon={DollarSign} variant="blue" />
        <MetricCard title="Piezas en Riesgo" value={m.alertasStock} label="alertas" icon={AlertTriangle} variant="amber" />
        <MetricCard title="Catálogo" value={m.totalCatalogo} label="items" icon={Package} variant="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfica principal */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Flujo de Ingresos</h3>
          </div>
          <GraficaVentas />
        </div>

        {/* Panel lateral de clientes */}
        <TopClientes />
      </div>
    </div>
  );
}