import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  props: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const params = await props.params;
    const { userId } = await auth();
    const { prompt, rubric, points } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      }
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const openAssessment = await db.openAssessment.upsert({
      where: {
        chapterId: params.chapterId,
      },
      update: {
        prompt,
        rubric,
        points: points ? parseInt(points) : 0,
        isActive: true,
      },
      create: {
        chapterId: params.chapterId,
        prompt,
        rubric,
        points: points ? parseInt(points) : 0,
        isActive: true,
      }
    });

    return NextResponse.json(openAssessment);
  } catch (error) {
    console.log("[CHAPTER_ASSESSMENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
