import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: any; // Fix para el tipado estricto de elementos JSX en Next.js 15
  color: string;
}

export default function MetricCard({ title, value, icon, color }: MetricCardProps) {
  return (
    <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm flex items-center gap-4">
      <div className={`p-4 rounded-2xl bg-slate-950 border border-slate-800 ${color} shadow-sm`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <p className={`text-2xl font-black mt-1 ${color}`}>{value}</p>
      </div>
    </div>
  );
}