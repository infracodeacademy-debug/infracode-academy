"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

interface AdminCoursesListProps {
  courses: any[];
}

export const AdminCoursesList = ({ courses }: AdminCoursesListProps) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const onApprove = async (courseId: string) => {
    try {
      setLoadingId(courseId);
      await axios.patch(`/api/admin/courses/${courseId}/approve`);
      toast.success("Curso aprobado exitosamente");
      window.location.reload();
    } catch {
      toast.error("Error al aprobar el curso");
    } finally {
      setLoadingId(null);
    }
  }

  const onUnapprove = async (courseId: string) => {
    try {
      setLoadingId(courseId);
      await axios.patch(`/api/admin/courses/${courseId}/unapprove`);
      toast.success("Curso desaprobado/archivado exitosamente");
      window.location.reload();
    } catch {
      toast.error("Error al desaprobar el curso");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="bg-slate-900 border-slate-800 border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-800 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 font-medium">Curso</th>
              <th className="px-6 py-4 font-medium">Profesor</th>
              <th className="px-6 py-4 font-medium">Categoría</th>
              <th className="px-6 py-4 font-medium">Precio</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                <td className="px-6 py-4 font-medium text-white max-w-[200px] truncate">
                  {course.title}
                </td>
                <td className="px-6 py-4">
                  {course.instructorName}
                </td>
                <td className="px-6 py-4">
                  {course.category}
                </td>
                <td className="px-6 py-4 font-medium">
                  {formatPrice(course.price)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold w-fit ${
                      course.isPublished ? "bg-sky-500/20 text-sky-400 border border-sky-500/30" : "bg-slate-700/50 text-slate-300"
                    }`}>
                      {course.isPublished ? "Publicado" : "Borrador"}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold w-fit ${
                      course.isApproved ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    }`}>
                      {course.isApproved ? "Aprobado" : "No Aprobado"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  {course.isPublished && !course.isApproved && (
                    <Button 
                      onClick={() => onApprove(course.id)}
                      disabled={loadingId === course.id}
                      size="sm" 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Aprobar
                    </Button>
                  )}
                  {course.isApproved && (
                    <Button 
                      onClick={() => onUnapprove(course.id)}
                      disabled={loadingId === course.id}
                      size="sm" 
                      variant="outline"
                      className="text-rose-500 border-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
                    >
                      Desaprobar / Archivar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
