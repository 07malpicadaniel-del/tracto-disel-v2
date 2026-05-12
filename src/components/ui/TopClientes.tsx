export default function TopClientes() {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col gap-4 h-full">
      <div>
        <h3 className="text-lg font-bold text-white">Top Clientes (Crédito)</h3>
        <p className="text-sm text-slate-400">Mayores deudores activos</p>
      </div>
      
      <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-4">
        <span className="text-slate-500 text-sm font-medium text-center">
          Sincronizando lista de transportistas desde Supabase...
        </span>
      </div>
    </div>
  );
}