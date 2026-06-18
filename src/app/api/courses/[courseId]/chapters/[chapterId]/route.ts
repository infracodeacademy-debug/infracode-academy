import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId, chapterId } = await params;
    const { isPublished, ...values } = await req.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId
      }
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      data: {
        ...values,
      }
    });

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: chapterId,
        }
      });

      if (existingMuxData) {
        try {
          await mux.video.assets.delete(existingMuxData.assetId);
        } catch (error) {
          console.error("Error deleting mux asset", error);
        }
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          }
        });
      }

      try {
        const asset = await mux.video.assets.create({
          input: [{ url: values.videoUrl }],
          playback_policy: ["public"],
          test: false,
        });

        await db.muxData.create({
          data: {
            chapterId: chapterId,
            assetId: asset.id,
            playbackId: asset.playback_ids?.[0]?.id,
          }
        });
      } catch (error) {
        console.error("Error creating mux asset", error);
      }
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId, chapterId } = await params;

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId
      }
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      }
    });

    if (!chapter) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: chapterId,
        }
      });

      if (existingMuxData) {
        try {
          await mux.video.assets.delete(existingMuxData.assetId);
        } catch (error) {
          console.error("Error deleting mux asset", error);
        }
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          }
        });
      }
    }
    
    const deletedChapter = await db.chapter.delete({
      where: {
        id: chapterId
      }
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      }
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        }
      });
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.log("[CHAPTER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
