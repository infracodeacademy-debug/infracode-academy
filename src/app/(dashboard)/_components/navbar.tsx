import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NavbarRoutes } from "@/components/navbar-routes";
import { MobileSidebar } from "./mobile-sidebar";

export const Navbar = async () => {
  const { userId } = await auth();
  const profile = userId ? await db.userProfile.findUnique({ where: { userId } }) : null;
  const subscription = userId ? await db.lemonSqueezySubscription.findUnique({ where: { userId } }) : null;
  const isSubscribed = !!(subscription?.lemonSqueezyCurrentPeriodEnd && subscription.lemonSqueezyCurrentPeriodEnd.getTime() > Date.now());

  return (
    <div className="p-4 border-b h-full flex items-center bg-slate-950 border-slate-800 shadow-sm">
      <MobileSidebar />
      <NavbarRoutes 
        userRole={profile?.role} 
        isTeacherRequested={profile?.isTeacherRequested} 
        points={profile?.points}
        streak={profile?.streak}
        isSubscribed={isSubscribed}
      />
    </div>
  )
}
