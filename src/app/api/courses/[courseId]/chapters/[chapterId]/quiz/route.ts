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
      where: {
        chapterId: params.chapterId
      }
    });

    if (quiz) {
      const updatedQuiz = await db.quiz.update({
        where: { id: quiz.id },
        data: { isActive: !quiz.isActive }
      });
      return NextResponse.json(updatedQuiz);
    } else {
      const newQuiz = await db.quiz.create({
        data: {
          chapterId: params.chapterId,
          isActive: true
        }
      });
      return NextResponse.json(newQuiz);
    }
  } catch (error) {
    console.log("[QUIZ_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const params = await props.params;
    const { userId } = await auth();
    const { points } = await req.json();

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

    const quiz = await db.quiz.update({
      where: {
        chapterId: params.chapterId,
      },
      data: {
        points: points ? parseInt(points) : 0,
      }
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.log("[QUIZ_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
