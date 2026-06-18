import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { AdminUsersList } from "./_components/admin-users-list";

const AdminUsersPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const users = await db.userProfile.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      courses: {
        select: { id: true }
      }
    }
  });

  const formattedUsers = users.map((user) => ({
    id: user.id,
    userId: user.userId,
    name: user.name || "Sin nombre",
    email: user.email || "Sin email",
    role: user.role,
    isTeacherRequested: user.isTeacherRequested,
    coursesCount: user.courses.length,
    createdAt: user.createdAt,
  }));

  return ( 
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Gestión de Usuarios</h1>
        <p className="text-slate-400">Administra roles, estudiantes y profesores.</p>
      </div>
      <AdminUsersList users={formattedUsers} />
    </div>
   );
}
 
export default AdminUsersPage;
