import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import OpenAI from "openai";

export async function POST(
  req: Request,
  props: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const params = await props.params;
    const { userId } = await auth();
    const { response } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const openAssessment = await db.openAssessment.findUnique({
      where: {
        chapterId: params.chapterId,
      }
    });

    if (!openAssessment || !openAssessment.isActive) {
      return new NextResponse("Assessment not found", { status: 404 });
    }

    // Call OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new NextResponse("OpenAI API Key not configured", { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

    const systemPrompt = `Eres un Profesor Experto y Justo. Tu objetivo es evaluar la respuesta del estudiante basándote en esta rúbrica:

RÚBRICA DE EVALUACIÓN:
${openAssessment.rubric}

INSTRUCCIÓN ORIGINAL DADA AL ESTUDIANTE:
${openAssessment.prompt}

Debes analizar la respuesta del estudiante y calificarla en una escala de 1 a 5, donde:
5: Excelente/Perfecto.
4: Muy bueno, cumple con casi todo.
3: Aceptable, tiene algunos fallos menores.
2: Insuficiente, le falta bastante.
1: Muy deficiente o irrelevante.

Sé muy comprensivo y flexible al evaluar. Valora el esfuerzo, la coherencia y el entendimiento general de los conceptos clave. Si la respuesta demuestra que el estudiante captó la idea central y tiene sentido lógico, califícalo generosamente con 4 o 5. Usa 3 si la respuesta es aceptable pero necesita mejoras importantes. Evita calificaciones bajas (1-2) a menos que la respuesta sea completamente incorrecta, en blanco o irrelevante.

Debes devolver el resultado ESTRICTAMENTE en este formato JSON:
{
  "score": [Número entero del 1 al 5],
  "feedback": "[Tu feedback detallado, sumamente amable y constructivo en español]"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Respuesta del estudiante:\n\n${response}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3, // Low temperature for consistent grading
    });

    const aiResponseText = completion.choices[0].message.content;
    
    if (!aiResponseText) {
      throw new Error("OpenAI returned empty response");
    }

    const aiData = JSON.parse(aiResponseText);
    const score = Number(aiData.score);
    const feedback = aiData.feedback;

    // Save student assessment
    const studentAssessment = await db.studentAssessment.upsert({
      where: {
        userId_assessmentId: {
          userId,
          assessmentId: openAssessment.id,
        }
      },
      update: {
        response,
        score,
        feedback,
      },
      create: {
        userId,
        assessmentId: openAssessment.id,
        response,
        score,
        feedback,
      }
    });

    // Mark chapter as completed if score is >= 3 (out of 5)
    if (score >= 3) {
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

    return NextResponse.json(studentAssessment);
  } catch (error) {
    console.log("[ASSESSMENT_EVALUATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
