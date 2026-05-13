"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import MetricCard from '../components/ui/MetricCard';
import GraficaVentas from '../components/ui/GraficaVentas';
import TopClientes from '../components/ui/TopClientes';
import { Banknote, Users, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [metricas, setMetricas] = useState({
    ventasHoy: 0,
    totalCreditos: 0,
    clientesActivos: 0,
    stockBajo: 0
  });

  const cargarMetricas = async () => {
    try {
      const hoy = new Date().toISOString().split('T')[0];
      
      const { data: ventas } = await supabase
        .from('ventas')
        .select('total')
        .gte('created_at', hoy);
      
      const sumaHoy = ventas?.reduce((acc, v) => acc + v.total, 0) || 0;

      const { data: clientes } = await supabase
        .from('clientes')
        .select('deuda_actual');
      
      const sumaCreditos = clientes?.reduce((acc, c) => acc + c.deuda_actual, 0) || 0;

      const { count } = await supabase
        .from('productos')
        .select('*', { count: 'exact', head: true })
        .lte('stock', 5);

      setMetricas({
        ventasHoy: sumaHoy,
        totalCreditos: sumaCreditos,
        clientesActivos: clientes?.length || 0,
        stockBajo: count || 0
      });
    } catch (error) {
      console.error("Error al cargar métricas:", error);
      toast.error("Error al sincronizar indicadores.");
    }
  };

  useEffect(() => {
    cargarMetricas();
  }, []);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight">Panel de Control</h1>
        <p className="text-slate-400 font-medium text-sm">Resumen operativo en Veracruz.</p>
      </header>

      {/* Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Ventas del Día" 
          value={`$${metricas.ventasHoy.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`} 
          icon={<Banknote size={24} />} 
          color="text-green-500" 
        />
        <MetricCard 
          title="Cuentas por Cobrar" 
          value={`$${metricas.totalCreditos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`} 
          icon={<Users size={24} />} 
          color="text-blue-500" 
        />
        <MetricCard 
          title="Clientes" 
          value={metricas.clientesActivos.toString()} 
          icon={<Users size={24} />} 
          color="text-purple-500" 
        />
        <MetricCard 
          title="Stock Bajo" 
          value={metricas.stockBajo.toString()} 
          icon={<AlertTriangle size={24} />} 
          color="text-red-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Ingresos (Últimos 7 días)</h3>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sincronizado</span>
          </div>
          <div className="h-[350px] w-full">
            <GraficaVentas />
          </div>
        </div>
        
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">Mayores Deudores</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Créditos pendientes de Gustavo.</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <TopClientes />
          </div>
        </div>
      </div>
    </div>
  );
}