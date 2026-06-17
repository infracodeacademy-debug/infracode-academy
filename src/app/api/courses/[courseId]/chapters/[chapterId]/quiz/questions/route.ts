import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  props: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const params = await props.params;
    const { userId } = await auth();
    const { prompt } = await req.json();

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

    const quiz = await db.quiz.findUnique({
      where: { chapterId: params.chapterId }
    });

    if (!quiz) {
      return new NextResponse("Quiz not found", { status: 404 });
    }

    const lastQuestion = await db.question.findFirst({
      where: { quizId: quiz.id },
      orderBy: { position: "desc" },
    });

    const newPosition = lastQuestion ? lastQuestion.position + 1 : 1;

    const question = await db.question.create({
      data: {
        prompt,
        quizId: quiz.id,
        position: newPosition,
      }
    });

    return NextResponse.json(question);
  } catch (error) {
    console.log("[QUESTIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
