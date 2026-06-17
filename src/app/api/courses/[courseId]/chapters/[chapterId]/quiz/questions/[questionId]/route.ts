import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  props: { params: Promise<{ courseId: string; chapterId: string; questionId: string }> }
) {
  try {
    const params = await props.params;
    const { userId } = await auth();

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

    const question = await db.question.delete({
      where: { id: params.questionId }
    });

    return NextResponse.json(question);
  } catch (error) {
    console.log("[QUESTION_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
