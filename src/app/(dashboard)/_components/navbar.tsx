import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NavbarRoutes } from "@/components/navbar-routes";
import { MobileSidebar } from "./mobile-sidebar";

export const Navbar = async () => {
  const { userId } = await auth();
  const profile = userId ? await db.userProfile.findUnique({ where: { userId } }) : null;

  return (
    <div className="p-4 border-b h-full flex items-center bg-slate-950 border-slate-800 shadow-sm">
      <MobileSidebar />
      <NavbarRoutes 
        userRole={profile?.role} 
        isTeacherRequested={profile?.isTeacherRequested} 
      />
    </div>
  )
}
