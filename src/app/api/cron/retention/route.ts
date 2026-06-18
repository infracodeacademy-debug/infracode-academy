import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_123");

export async function GET(req: Request) {
  try {
    // Basic security: require an Authorization header or an internal Cron Secret
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.RESEND_API_KEY) {
      return new NextResponse("No Resend API Key", { status: 400 });
    }

    // Find students who haven't updated their UserProgress in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // We get all unique users who have a purchase but their latest user progress was before sevenDaysAgo
    // Alternatively, if they never started, their purchase createdAt is < sevenDaysAgo
    const purchases = await db.purchase.findMany({
      include: {
        course: true,
      }
    });

    const emailsSent = [];

    for (const purchase of purchases) {
      const userProfile = await db.userProfile.findUnique({
        where: { userId: purchase.userId }
      });

      if (!userProfile?.email) continue;

      // Check user progress for this course
      const progress = await db.userProgress.findMany({
        where: { 
          userId: purchase.userId,
          chapter: {
            courseId: purchase.courseId
          }
        },
        orderBy: {
          updatedAt: 'desc'
        },
        take: 1
      });

      let shouldEmail = false;

      if (progress.length === 0) {
        // Never started
        if (purchase.createdAt < sevenDaysAgo) {
          shouldEmail = true;
        }
      } else {
        // Started but inactive
        const lastActivity = progress[0].updatedAt;
        if (lastActivity < sevenDaysAgo && !progress[0].isCompleted) {
          shouldEmail = true;
        }
      }

      if (shouldEmail) {
        await resend.emails.send({
          from: 'InfraCode Academy <soporte@infracode.com>',
          to: [userProfile.email],
          subject: 'Te extrañamos en tu curso 🥺',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>¡Hola ${userProfile.name || 'Estudiante'}!</h2>
              <p>Hemos notado que hace tiempo no avanzas en tu curso <strong>${purchase.course.title}</strong>.</p>
              <p>El mundo de la tecnología se mueve rápido y la constancia es la clave del éxito. ¡No dejes que tu aprendizaje se detenga!</p>
              <p>Haz clic abajo para retomar donde lo dejaste.</p>
              <br/>
              <p>Saludos,</p>
              <p><strong>El equipo de InfraCode</strong></p>
            </div>
          `
        });
        emailsSent.push(userProfile.email);
      }
    }

    return NextResponse.json({ success: true, emailsSent: emailsSent.length });
  } catch (error) {
    console.log("[CRON_RETENTION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
