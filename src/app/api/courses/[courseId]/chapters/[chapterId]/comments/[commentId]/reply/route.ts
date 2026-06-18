import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_123");

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

    const parentComment = await db.comment.findUnique({
      where: { id: params.commentId }
    });

    if (parentComment && parentComment.userId !== userId && process.env.RESEND_API_KEY) {
      const parentUser = await db.userProfile.findUnique({
        where: { userId: parentComment.userId }
      });
      
      const course = await db.course.findUnique({
        where: { id: params.courseId },
        select: { title: true }
      });

      if (parentUser?.email) {
        try {
          await resend.emails.send({
            from: 'InfraCode Academy <soporte@infracode.com>',
            to: [parentUser.email],
            subject: 'Alguien ha respondido a tu comentario 💬',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>¡Hola ${parentUser.name || 'Estudiante'}!</h2>
                <p>Alguien acaba de responder a tu pregunta o comentario en el curso <strong>${course?.title || 'de InfraCode Academy'}</strong>.</p>
                <p>Puedes entrar a la plataforma para ver la respuesta y continuar la conversación.</p>
                <br/>
                <p>Saludos,</p>
                <p><strong>El equipo de InfraCode</strong></p>
              </div>
            `
          });
        } catch (error) {
          console.error("Error sending reply email", error);
        }
      }
    }

    return NextResponse.json(reply);
  } catch (error) {
    console.log("[COMMENT_REPLY]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
