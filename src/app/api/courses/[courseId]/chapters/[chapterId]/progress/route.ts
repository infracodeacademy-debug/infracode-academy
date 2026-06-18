import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId, chapterId } = await params;
    const { isCompleted } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check previous state
    const previousProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId: chapterId,
        }
      }
    });

    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId: chapterId,
        }
      },
      update: {
        isCompleted
      },
      create: {
        userId,
        chapterId: chapterId,
        isCompleted,
      }
    });

    // Gamification: Award 10 points for completing a chapter (only if it wasn't already completed)
    if (isCompleted && !previousProgress?.isCompleted) {
      await db.userProfile.update({
        where: { userId },
        data: {
          points: { increment: 10 },
          lastActivity: new Date()
        }
      }).catch(() => null);
    }

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("[CHAPTER_ID_PROGRESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
