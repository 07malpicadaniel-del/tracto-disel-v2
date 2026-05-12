import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  label?: string;
  icon: LucideIcon;
  variant?: 'green' | 'blue' | 'amber' | 'indigo';
}

export default function MetricCard({ title, value, label, icon: Icon, variant = 'blue' }: MetricCardProps) {
  const variants = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    indigo: 'bg-indigo-100 text-indigo-600',
  };

  return (
    <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl ${variants[variant]}`}>
          <Icon size={24} />
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</span>
      </div>
      <h2 className="text-3xl font-black text-white">
        {value} {label && <span className="text-lg text-slate-400 font-medium">{label}</span>}
      </h2>
    </div>
  );
}