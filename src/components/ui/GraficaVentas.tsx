"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Datos simulados (Pronto los generaremos desde Supabase)
const datosMensuales = [
  { mes: 'Ene', ventas: 45000, creditos: 12000 },
  { mes: 'Feb', ventas: 52000, creditos: 15000 },
  { mes: 'Mar', ventas: 48000, creditos: 11000 },
  { mes: 'Abr', ventas: 61000, creditos: 18000 },
  { mes: 'May', ventas: 59000, creditos: 14000 },
  { mes: 'Jun', ventas: 75000, creditos: 22000 },
];

export default function GraficaVentas() {
  return (
    <div className="h-[350px] w-full mt-4">
      {/* Agregamos minHeight={350} para evitar el error de cálculo inicial */}
      <ResponsiveContainer width="100%" height="100%" minHeight={350}>
        <AreaChart data={datosMensuales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorCreditos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="mes" 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc' }}
            itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
          />
          <Area 
            type="monotone" 
            dataKey="creditos" 
            name="A Crédito"
            stroke="#64748b" 
            fillOpacity={1} 
            fill="url(#colorCreditos)" 
          />
          <Area 
            type="monotone" 
            dataKey="ventas" 
            name="Ventas Efectivo"
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorVentas)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}