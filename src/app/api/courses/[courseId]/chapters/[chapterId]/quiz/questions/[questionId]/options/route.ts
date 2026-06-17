import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  props: { params: Promise<{ courseId: string; chapterId: string; questionId: string }> }
) {
  try {
    const params = await props.params;
    const { userId } = await auth();
    const { text, isCorrect } = await req.json();

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

    const option = await db.option.create({
      data: {
        text,
        isCorrect,
        questionId: params.questionId,
      }
    });

    return NextResponse.json(option);
  } catch (error) {
    console.log("[OPTIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
