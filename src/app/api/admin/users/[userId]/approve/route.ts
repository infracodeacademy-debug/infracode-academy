import { NextResponse } from "next/response";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  props: { params: Promise<{ userId: string }> }
) {
  try {
    const params = await props.params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const adminUser = await db.userProfile.findUnique({ where: { userId } });
    if (adminUser?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedUser = await db.userProfile.update({
      where: {
        userId: params.userId,
      },
      data: {
        role: "TEACHER",
        isTeacherRequested: false, // Clear the request
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log("[ADMIN_USER_APPROVE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
