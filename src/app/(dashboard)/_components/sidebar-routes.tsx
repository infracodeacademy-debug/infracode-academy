"use client";

import { Layout, Compass, List, BarChart } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: Compass,
    label: "Explorar",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Cursos",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Análisis",
    href: "/teacher/analytics",
  },
];

const adminRoutes = [
  {
    icon: BarChart,
    label: "Ingresos Globales",
    href: "/admin/analytics",
  },
  {
    icon: List,
    label: "Aprobación de Cursos",
    href: "/admin/courses",
  },
  {
    icon: Compass,
    label: "Usuarios y Roles",
    href: "/admin/users",
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();
  
  const isTeacherPage = pathname?.includes("/teacher");
  const isAdminPage = pathname?.includes("/admin");
  
  const routes = isAdminPage ? adminRoutes : isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  )
}
