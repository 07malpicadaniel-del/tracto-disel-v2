"use client";

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';

export default function GraficaVentas() {
  const [datos, setDatos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const hoy = new Date();
        const hace7Dias = new Date(hoy);
        hace7Dias.setDate(hoy.getDate() - 6);
        const fechaInicio = hace7Dias.toISOString().split('T')[0];

        const { data, error } = await supabase
          .from('ventas')
          .select('created_at, total')
          .gte('created_at', fechaInicio)
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (!data) return;

        // Agrupación de ventas por día
        const ventasPorDia = (data as any[]).reduce((acc: any, v: any) => {
          const d = new Date(v.created_at).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' });
          acc[d] = (acc[d] || 0) + v.total;
          return acc;
        }, {});

        // Generar array final de 7 días
        const historialFinal = [];
        for (let i = 6; i >= 0; i--) {
          const temporal = new Date();
          temporal.setDate(temporal.getDate() - i);
          const label = temporal.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' });
          historialFinal.push({
            name: label.charAt(0).toUpperCase() + label.slice(1),
            total: ventasPorDia[label] || 0
          });
        }

        setDatos(historialFinal);
      } catch (err: any) {
        console.error("Error en gráfica:", err.message);
      } finally {
        setCargando(false);
      }
    };

    fetchDatos();
  }, []);

  if (cargando) return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-slate-600 text-sm font-medium animate-pulse">Analizando tendencias de venta...</div>
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={datos} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
        <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
          itemStyle={{ color: '#3b82f6', fontWeight: '900' }}
        />
        <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}