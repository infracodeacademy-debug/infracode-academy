import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { AdminCoursesList } from "./_components/admin-courses-list";

const AdminCoursesPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const courses = await db.course.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      instructor: true,
      category: true,
    }
  });

  const formattedCourses = courses.map((course) => ({
    id: course.id,
    title: course.title,
    instructorName: course.instructor?.name || "Desconocido",
    category: course.category?.name || "Sin categoría",
    isPublished: course.isPublished,
    isApproved: course.isApproved,
    createdAt: course.createdAt,
    price: course.price || 0,
  }));

  return ( 
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Aprobación de Cursos</h1>
        <p className="text-slate-400">Revisa y aprueba los cursos de los profesores antes de que sean públicos.</p>
      </div>
      <AdminCoursesList courses={formattedCourses} />
    </div>
   );
}
 
export default AdminCoursesPage;
