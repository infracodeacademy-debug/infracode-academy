import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

const AdminLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const profile = await db.userProfile.findUnique({
    where: { userId }
  });

  if (profile?.role !== "ADMIN") {
    return redirect("/");
  }

  return <>{children}</>
}

export default AdminLayout;
