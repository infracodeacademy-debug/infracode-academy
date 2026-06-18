import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getAdminAnalytics } from "@/actions/get-admin-analytics";
import { DataCard } from "@/app/(dashboard)/teacher/analytics/_components/data-card";
import { Chart } from "@/app/(dashboard)/teacher/analytics/_components/chart";

const AdminAnalyticsPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    data,
    totalRevenue,
    totalAcademyRevenue,
    totalCommissions,
    totalSales,
  } = await getAdminAnalytics(userId);

  return ( 
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Análisis Global</h1>
        <p className="text-slate-400">Monitorea los ingresos totales, ventas y comisiones generadas en tu academia.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <DataCard
          label="Ingresos Totales (Global)"
          value={totalRevenue}
          shouldFormat
        />
        <DataCard
          label="Ingresos Propios (Academia)"
          value={totalAcademyRevenue}
          shouldFormat
        />
        <DataCard
          label="Comisiones (Profesores)"
          value={totalCommissions}
          shouldFormat
        />
        <DataCard
          label="Ventas Totales"
          value={totalSales}
        />
      </div>

      <div className="bg-slate-900 border-slate-800 border p-6 rounded-md">
        <h3 className="text-lg font-semibold mb-4 text-white">Ingresos por Curso</h3>
        <Chart data={data} />
      </div>
    </div>
   );
}
 
export default AdminAnalyticsPage;
