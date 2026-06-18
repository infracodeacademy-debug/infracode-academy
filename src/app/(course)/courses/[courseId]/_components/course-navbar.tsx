import { Chapter, Course, UserProgress } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

import { NavbarRoutes } from "@/components/navbar-routes";

import { CourseMobileSidebar } from "./course-mobile-sidebar";

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
};

export const CourseNavbar = async ({
  course,
  progressCount,
}: CourseNavbarProps) => {
  const { userId } = await auth();
  const profile = userId ? await db.userProfile.findUnique({ where: { userId } }) : null;

  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800">
      <CourseMobileSidebar
        course={course}
        progressCount={progressCount}
      />
      <NavbarRoutes 
        userRole={profile?.role}
        isTeacherRequested={profile?.isTeacherRequested}
      />
    </div>
  )
}
