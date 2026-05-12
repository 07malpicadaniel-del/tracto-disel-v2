export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Centro de Mando</h1>
        <p className="text-slate-500 font-medium mt-1">Resumen gerencial de Tracto-disel en tiempo real.</p>
      </div>

      <div className="p-8 border-2 border-dashed border-slate-300 rounded-3xl flex items-center justify-center text-slate-400 bg-slate-50 mt-10">
        <p className="font-semibold">Aquí construiremos las tarjetas de métricas (Ingresos, Cuentas por Cobrar, etc.)</p>
      </div>
    </div>
  );
}