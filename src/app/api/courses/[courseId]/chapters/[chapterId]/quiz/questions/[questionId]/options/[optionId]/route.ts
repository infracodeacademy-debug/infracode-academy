import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  props: { params: Promise<{ courseId: string; chapterId: string; questionId: string; optionId: string }> }
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

    // Unmark other options
    await db.option.updateMany({
      where: { questionId: params.questionId },
      data: { isCorrect: false },
    });

    // Mark this one as correct
    const option = await db.option.update({
      where: { id: params.optionId },
      data: { isCorrect: true },
    });

    return NextResponse.json(option);
  } catch (error) {
    console.log("[OPTION_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
