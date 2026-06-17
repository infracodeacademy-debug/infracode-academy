"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { isTeacher } from "@/lib/teacher";
// TODO: Get actual user from Clerk

export const NavbarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/courses");

  // TODO: Actual check
  const isAuthorized = isTeacher();

  return (
    <div className="flex gap-x-2 ml-auto items-center">
      {isTeacherPage || isPlayerPage ? (
        <Link href="/dashboard">
          <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white">
            <LogOut className="h-4 w-4 mr-2" />
            Salir
          </Button>
        </Link>
      ) : isAuthorized ? (
        <Link href="/teacher/courses">
          <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white border border-indigo-500/30">
            Modo Profesor
          </Button>
        </Link>
      ) : null}
      <UserButton
        afterSignOutUrl="/"
      />
    </div>
  )
}
