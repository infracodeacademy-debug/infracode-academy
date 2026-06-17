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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <DataCard
            label="Ingresos Totales"
            value={totalRevenue}
            shouldFormat
          />
          <DataCard
            label="Ventas Totales"
            value={totalSales}
          />
        </div>
        
        <Chart
          data={data}
        />
      </div>
    </div>
   );
}
 
export default AnalyticsPage;
