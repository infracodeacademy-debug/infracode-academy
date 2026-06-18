import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { DashboardTabs } from "./_components/dashboard-tabs";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    completedCourses,
    coursesInProgress
  } = await getDashboardCourses(userId);

  return (
    <div className="p-6">
      <DashboardTabs 
        completedCourses={completedCourses}
        coursesInProgress={coursesInProgress}
      />
    </div>
  )
}
