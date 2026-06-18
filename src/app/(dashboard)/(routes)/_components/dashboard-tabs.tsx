"use client";

import { CheckCircle, Clock, LayoutList } from "lucide-react";
import { CoursesList } from "@/components/courses-list";
import { InfoCard } from "./info-card";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DashboardTabsProps {
  completedCourses: any[];
  coursesInProgress: any[];
}

export const DashboardTabs = ({
  completedCourses,
  coursesInProgress
}: DashboardTabsProps) => {
  const [activeTab, setActiveTab] = useState<"all" | "in-progress" | "completed">("all");
  
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
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2 mb-4">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "py-2 px-4 text-sm font-medium border border-slate-200 rounded-full flex items-center gap-x-2 transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/40 dark:backdrop-blur-sm dark:hover:border-indigo-500/50 hover:shadow-md active:scale-95",
              activeTab === "all" && "border-indigo-500 bg-indigo-500/10 text-indigo-700 shadow-indigo-500/20 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500 shadow-inner"
            )}
            type="button"
          >
            <LayoutList size={18} className="drop-shadow-sm" />
            <div className="truncate">Todos</div>
          </button>
          <button
            onClick={() => setActiveTab("in-progress")}
            className={cn(
              "py-2 px-4 text-sm font-medium border border-slate-200 rounded-full flex items-center gap-x-2 transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/40 dark:backdrop-blur-sm dark:hover:border-indigo-500/50 hover:shadow-md active:scale-95",
              activeTab === "in-progress" && "border-indigo-500 bg-indigo-500/10 text-indigo-700 shadow-indigo-500/20 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500 shadow-inner"
            )}
            type="button"
          >
            <Clock size={18} className="drop-shadow-sm" />
            <div className="truncate">En Progreso</div>
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={cn(
              "py-2 px-4 text-sm font-medium border border-slate-200 rounded-full flex items-center gap-x-2 transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/40 dark:backdrop-blur-sm dark:hover:border-indigo-500/50 hover:shadow-md active:scale-95",
              activeTab === "completed" && "border-indigo-500 bg-indigo-500/10 text-indigo-700 shadow-indigo-500/20 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500 shadow-inner"
            )}
            type="button"
          >
            <CheckCircle size={18} className="drop-shadow-sm" />
            <div className="truncate">Completados</div>
          </button>
        </div>
        
        {activeTab === "all" && (
          <div className="mt-2">
            {[...coursesInProgress, ...completedCourses].length === 0 ? (
              <div className="text-center text-slate-500 mt-10">No tienes cursos</div>
            ) : (
              <CoursesList items={[...coursesInProgress, ...completedCourses]} />
            )}
          </div>
        )}

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
