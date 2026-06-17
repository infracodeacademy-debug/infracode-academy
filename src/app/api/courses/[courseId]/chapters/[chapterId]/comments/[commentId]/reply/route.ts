import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  props: { params: Promise<{ courseId: string; chapterId: string; commentId: string }> }
) {
  try {
    const params = await props.params;
    const { userId } = await auth();
    const { text } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const reply = await db.comment.create({
      data: {
        text,
        chapterId: params.chapterId,
        parentId: params.commentId,
        userId,
      }
    });

    return NextResponse.json(reply);
  } catch (error) {
    console.log("[COMMENT_REPLY]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
