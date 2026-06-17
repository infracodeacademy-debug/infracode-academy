import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  props: { params: Promise<{ courseId: string }> }
) {
  try {
    const params = await props.params;
    const { userId } = await auth();
    const { rating, text } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: params.courseId,
        }
      }
    });

    if (!purchase) {
      return new NextResponse("You must purchase the course to leave a review", { status: 403 });
    }

    const review = await db.review.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId: params.courseId,
        }
      },
      update: {
        rating,
        text,
      },
      create: {
        userId,
        courseId: params.courseId,
        rating,
        text,
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.log("[REVIEWS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
