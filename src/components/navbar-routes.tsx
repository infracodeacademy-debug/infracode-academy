"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface NavbarRoutesProps {
  userRole?: string;
  isTeacherRequested?: boolean;
  points?: number;
  streak?: number;
}

export const NavbarRoutes = ({ 
  userRole, 
  isTeacherRequested,
  points = 0,
  streak = 0
}: NavbarRoutesProps) => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/courses");
  const isAdminPage = pathname?.startsWith("/admin");

  const isTeacher = userRole === "TEACHER" || userRole === "ADMIN";
  const isAdmin = userRole === "ADMIN";

  const onRequestTeacher = async () => {
    try {
      await axios.post("/api/users/request-teacher");
      toast.success("Solicitud enviada");
      window.location.reload();
    } catch {
      toast.error("Error al solicitar");
    }
  }

  return (
    <div className="flex gap-x-2 ml-auto items-center">
      {isTeacherPage || isPlayerPage || isAdminPage ? (
        <Link href="/dashboard">
          <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white">
            <LogOut className="h-4 w-4 mr-2" />
            Salir
          </Button>
        </Link>
      ) : (
        <div className="flex gap-x-2 items-center">
          {userRole === "STUDENT" && (
            <div className="hidden sm:flex items-center gap-x-3 mr-4 bg-slate-900/50 border border-slate-800 px-3 py-1.5 rounded-full">
              <div className="flex items-center text-amber-400 text-sm font-semibold">
                <span className="mr-1">⭐</span> {points} pts
              </div>
              <div className="w-[1px] h-4 bg-slate-700" />
              <div className="flex items-center text-orange-400 text-sm font-semibold">
                <span className="mr-1">🔥</span> {streak}
              </div>
            </div>
          )}
          {isAdmin && (
            <Link href="/admin/analytics">
              <Button size="sm" variant="outline" className="text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10">
                Admin Panel
              </Button>
            </Link>
          )}
          {isTeacher && (
            <Link href="/teacher/courses">
              <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white border border-indigo-500/30">
                Modo Profesor
              </Button>
            </Link>
          )}
          {userRole === "STUDENT" && !isTeacherRequested && (
            <AlertDialog>
              <AlertDialogTrigger 
                render={
                  <Button size="sm" variant="ghost" className="text-indigo-400 hover:text-indigo-300">
                    Solicitar ser Profesor
                  </Button>
                }
              />
              <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-200">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">¿Quieres convertirte en Profesor?</AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-400">
                    Al solicitar este rol, los administradores de la academia revisarán tu perfil. Si eres aceptado, podrás crear, publicar y vender tus propios cursos dentro de la plataforma.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={onRequestTeacher} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Enviar Solicitud
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {userRole === "STUDENT" && isTeacherRequested && (
            <Button disabled size="sm" variant="ghost" className="text-slate-500">
              Solicitud Pendiente
            </Button>
          )}
        </div>
      )}
      <UserButton />
    </div>
  )
}
