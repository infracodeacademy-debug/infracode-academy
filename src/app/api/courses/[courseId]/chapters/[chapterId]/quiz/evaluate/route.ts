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
    const { answers } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const quiz = await db.quiz.findUnique({
      where: { chapterId: params.chapterId },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    });

    if (!quiz || !quiz.isActive) {
      return new NextResponse("Quiz not found or inactive", { status: 404 });
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;

    if (totalQuestions === 0) {
      return NextResponse.json({ score: 100, correctAnswers: {} });
    }

    const correctAnswers: Record<string, string> = {};

    quiz.questions.forEach((question) => {
      const selectedOptionId = answers[question.id];
      const correctOption = question.options.find(opt => opt.isCorrect);

      if (correctOption) {
        correctAnswers[question.id] = correctOption.id;
      }

      if (correctOption && selectedOptionId === correctOption.id) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / totalQuestions) * 100);

    // If passed, mark the chapter as complete automatically
    if (score >= 80) {
      const userProgress = await db.userProgress.findUnique({
        where: {
          userId_chapterId: {
            userId,
            chapterId: params.chapterId,
          }
        }
      });

      if (!userProgress || !userProgress.isCompleted) {
        await db.userProgress.upsert({
          where: {
            userId_chapterId: {
              userId,
              chapterId: params.chapterId,
            }
          },
          update: {
            isCompleted: true,
          },
          create: {
            userId,
            chapterId: params.chapterId,
            isCompleted: true,
          }
        });
      }
    }

    return NextResponse.json({ score, correctAnswers });
  } catch (error) {
    console.log("[QUIZ_EVALUATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
