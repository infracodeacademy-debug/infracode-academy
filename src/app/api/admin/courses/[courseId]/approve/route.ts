import { NextResponse } from "next/response";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  props: { params: Promise<{ courseId: string }> }
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

    const course = await db.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        isApproved: true,
      }
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[ADMIN_COURSE_APPROVE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
