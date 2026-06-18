"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";

interface AdminUsersListProps {
  users: any[];
}

export const AdminUsersList = ({ users }: AdminUsersListProps) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const onApprove = async (userId: string) => {
    try {
      setLoadingId(userId);
      await axios.patch(`/api/admin/users/${userId}/approve`);
      toast.success("Usuario aprobado como profesor");
      window.location.reload();
    } catch {
      toast.error("Error al aprobar");
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
              <th className="px-6 py-4 font-medium">Usuario</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Rol</th>
              <th className="px-6 py-4 font-medium">Cursos Creados</th>
              <th className="px-6 py-4 font-medium">Registro</th>
              <th className="px-6 py-4 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                <td className="px-6 py-4 font-medium text-white">
                  {user.name}
                </td>
                <td className="px-6 py-4">
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.role === "ADMIN" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                    user.role === "TEACHER" ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" :
                    "bg-slate-700/50 text-slate-300"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-center font-medium">
                  {user.coursesCount}
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">
                  {format(new Date(user.createdAt), "dd MMM, yyyy", { locale: es })}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  {user.isTeacherRequested && user.role !== "TEACHER" && user.role !== "ADMIN" && (
                    <Button 
                      onClick={() => onApprove(user.userId)}
                      disabled={loadingId === user.userId}
                      size="sm" 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Aprobar Profesor
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
