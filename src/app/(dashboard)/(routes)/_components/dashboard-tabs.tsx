"use client";

import { CheckCircle, Clock } from "lucide-react";
import { CoursesList } from "@/components/courses-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoCard } from "./info-card";

interface DashboardTabsProps {
  completedCourses: any[];
  coursesInProgress: any[];
}

import { useState } from "react";

export const DashboardTabs = ({
  completedCourses,
  coursesInProgress
}: DashboardTabsProps) => {
  const [activeTab, setActiveTab] = useState("in-progress");
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
        <TabsList className="bg-slate-900 border-slate-800 border mb-4">
          <TabsTrigger value="in-progress" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
            En Progreso
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
            Completados
          </TabsTrigger>
        </TabsList>
        <TabsContent value="in-progress" className={activeTab === "in-progress" ? "block" : "hidden"}>
          {coursesInProgress.length === 0 ? (
            <div className="text-center text-slate-500 mt-10">No tienes cursos en progreso</div>
          ) : (
            <CoursesList items={coursesInProgress} />
          )}
        </TabsContent>
        <TabsContent value="completed" className={activeTab === "completed" ? "block" : "hidden"}>
          {completedCourses.length === 0 ? (
            <div className="text-center text-slate-500 mt-10">Aún no has completado ningún curso</div>
          ) : (
            <CoursesList items={completedCourses} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
