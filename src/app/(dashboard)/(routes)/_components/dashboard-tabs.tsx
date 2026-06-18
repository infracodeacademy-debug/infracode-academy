"use client";

import { CheckCircle, Clock } from "lucide-react";
import { CoursesList } from "@/components/courses-list";
import { InfoCard } from "./info-card";
import { useState } from "react";

interface DashboardTabsProps {
  completedCourses: any[];
  coursesInProgress: any[];
}

export const DashboardTabs = ({
  completedCourses,
  coursesInProgress
}: DashboardTabsProps) => {
  const [activeTab, setActiveTab] = useState<"in-progress" | "completed">("in-progress");
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="En Progreso"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completados"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>

      <div className="w-full mt-6">
        <div className="inline-flex w-fit items-center justify-center rounded-lg bg-slate-900 border border-slate-800 p-[3px] text-muted-foreground mb-4">
          <button
            onClick={() => setActiveTab("in-progress")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              activeTab === "in-progress" 
                ? "bg-slate-800 text-white shadow-sm" 
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            En Progreso
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              activeTab === "completed" 
                ? "bg-slate-800 text-white shadow-sm" 
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            Completados
          </button>
        </div>
        
        {activeTab === "in-progress" && (
          <div className="mt-2">
            {coursesInProgress.length === 0 ? (
              <div className="text-center text-slate-500 mt-10">No tienes cursos en progreso</div>
            ) : (
              <CoursesList items={coursesInProgress} />
            )}
          </div>
        )}
        
        {activeTab === "completed" && (
          <div className="mt-2">
            {completedCourses.length === 0 ? (
              <div className="text-center text-slate-500 mt-10">Aún no has completado ningún curso</div>
            ) : (
              <CoursesList items={completedCourses} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
