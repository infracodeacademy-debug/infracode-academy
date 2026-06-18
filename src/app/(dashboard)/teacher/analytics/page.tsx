import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getAnalytics } from "@/actions/get-analytics";

import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";

const AnalyticsPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    data,
    totalRevenue,
    totalSales,
    activeStudents,
    dropOffData
  } = await getAnalytics(userId);

  return ( 
    <div className="p-6 max-w-7xl mx-auto relative min-h-[calc(100vh-80px)]">
      {/* Background ambient light */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-brand-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white tracking-tight">Análisis de Rendimiento</h1>
          <p className="text-slate-400 mt-2">Mide el impacto y las ventas de tus cursos</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DataCard
            label="Ingresos Totales"
            value={totalRevenue}
            shouldFormat
          />
          <DataCard
            label="Ventas Totales"
            value={totalSales}
          />
          <DataCard
            label="Estudiantes Activos (30 días)"
            value={activeStudents}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Chart
            data={data}
          />
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Tasa de Abandono por Capítulo</h2>
            <div className="space-y-4">
              {dropOffData.length === 0 ? (
                <p className="text-slate-400 text-sm">No hay datos de abandono suficientes.</p>
              ) : (
                dropOffData.map((dropoff, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-300 truncate max-w-[200px]">
                      {dropoff.name}
                    </span>
                    <span className="text-rose-400 font-bold bg-rose-400/10 px-3 py-1 rounded-full text-xs">
                      {dropoff.total} estancados
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
   );
}
 
export default AnalyticsPage;
