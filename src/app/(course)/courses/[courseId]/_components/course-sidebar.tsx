import { auth, currentUser } from "@clerk/nextjs/server";
import { Chapter, Course, UserProgress } from "@prisma/client"
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { CourseProgress } from "@/components/course-progress";
import { getCourseGrade } from "@/actions/get-progress";

import { CourseSidebarItem } from "./course-sidebar-item";
import { CertificateButton } from "@/components/certificate-button";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[]
  };
  progressCount: number;
};

export const CourseSidebar = async ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    return redirect("/");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      }
    }
  });

  const grade = purchase ? await getCourseGrade(userId, course.id) : null;
  const instructorProfile = await db.userProfile.findUnique({ where: { userId: course.userId } });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm bg-slate-900/60 backdrop-blur-md border-white/10 relative z-10">
      <div className="p-8 flex flex-col border-b border-white/10 relative">
        {/* Ambient glow */}
        <div className="absolute top-0 left-0 w-full h-[150px] bg-brand-primary/10 blur-[80px] pointer-events-none" />
        
        <h1 className="font-semibold text-lg text-white relative z-10">
          {course.title}
        </h1>
        <p className="text-xs text-slate-400 relative z-10 mt-1 font-medium flex items-center">
          <span className="text-brand-primary mr-1">Por</span> {instructorProfile?.name || "InfraCode Academy"}
        </p>
        {purchase && (
          <div className="mt-10 relative z-10 flex flex-col gap-y-4">
            <CourseProgress
              variant="success"
              value={progressCount}
            />
            {grade && (
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Nota del Curso:</span>
                <span className={`text-sm font-bold ${
                  grade.percentage >= 60 ? "text-emerald-400" : "text-rose-400"
                }`}>
                  {grade.pointsObtained} / {grade.totalPoints} ({grade.percentage}%)
                </span>
              </div>
            )}
            <CertificateButton 
              courseName={course.title}
              studentName={user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "Estudiante Destacado"}
              isLocked={progressCount !== 100}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full py-4 space-y-1">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  )
}
