"use client";

import { useState } from "react";
import axios from "axios";
import { Loader2, Sparkles, Send, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { OpenAssessment, StudentAssessment } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AssessmentViewProps {
  assessment: OpenAssessment;
  studentAssessment: StudentAssessment | null;
  courseId: string;
  chapterId: string;
}

export const AssessmentView = ({
  assessment,
  studentAssessment,
  courseId,
  chapterId,
}: AssessmentViewProps) => {
  const router = useRouter();
  const [response, setResponse] = useState(studentAssessment?.response || "");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    if (!response.trim() || response.length < 20) {
      toast.error("Tu respuesta es muy corta. Escribe un poco más.");
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/assessments/evaluate`, {
        response
      });
      toast.success("Respuesta evaluada con éxito");
      router.refresh();
    } catch {
      toast.error("Error al evaluar. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  // If student already has a score >= 3 (scale 1-5) or >= 60 (legacy scale 1-100), it's approved
  const isApproved = !!(
    studentAssessment &&
    studentAssessment.score !== null &&
    (studentAssessment.score >= 3 || (studentAssessment.score > 5 && studentAssessment.score >= 60))
  );

  return (
    <div className="mt-8 glass-card border-white/10 rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative z-10 flex items-center gap-x-3 mb-6">
        <div className="p-3 bg-emerald-500/20 backdrop-blur-md rounded-xl border border-emerald-500/30">
          <Sparkles className="h-6 w-6 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            Evaluación Práctica (IA)
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Esta actividad será revisada automáticamente por tu Profesor Virtual.
          </p>
        </div>
      </div>

      <div className="relative z-10 space-y-6">
        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">Instrucciones:</h3>
          <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{assessment.prompt}</p>
        </div>

        {studentAssessment && studentAssessment.score !== null && (() => {
          const displayScore = studentAssessment.score > 5 ? Math.round(studentAssessment.score / 20) : studentAssessment.score;
          const isGood = displayScore >= 4;
          const isFair = displayScore === 3;
          const isPoor = displayScore <= 2;
          
          let cardBgBorder = 'bg-emerald-500/10 border-emerald-500/30';
          let textColor = 'text-emerald-400';
          let textMutedColor = 'text-emerald-300';
          
          if (isFair) {
            cardBgBorder = 'bg-amber-500/10 border-amber-500/30';
            textColor = 'text-amber-400';
            textMutedColor = 'text-amber-300';
          } else if (isPoor) {
            cardBgBorder = 'bg-rose-500/10 border-rose-500/30';
            textColor = 'text-rose-400';
            textMutedColor = 'text-rose-300';
          }

          return (
            <div className={`p-5 rounded-xl border ${cardBgBorder}`}>
              <div className="flex items-center gap-x-3 mb-3">
                {isGood ? (
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                ) : isFair ? (
                  <Sparkles className="h-8 w-8 text-amber-400" />
                ) : (
                  <Sparkles className="h-8 w-8 text-rose-400" />
                )}
                <div>
                  <h4 className={`text-lg font-bold ${textColor}`}>
                    Nota: {displayScore}/5
                  </h4>
                  <p className={`text-sm ${textMutedColor}`}>
                    {displayScore >= 3 
                      ? '¡Aprobado! Has superado esta evaluación.' 
                      : 'Puedes mejorar tu respuesta y volver a intentarlo.'}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <h5 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Feedback del Profesor Virtual:</h5>
                <p className="text-slate-200 text-sm whitespace-pre-wrap">{studentAssessment.feedback}</p>
              </div>
            </div>
          );
        })()}

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Tu Respuesta:</h3>
          <Textarea 
            placeholder="Escribe tu código, ensayo o respuesta aquí..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            disabled={isLoading || isApproved}
            className={`min-h-[200px] bg-slate-900/50 border-white/10 text-white font-mono ${isApproved ? 'opacity-50' : ''}`}
          />
          
          {!isApproved && (
            <div className="flex justify-end">
              <Button 
                onClick={onSubmit}
                disabled={isLoading || !response.trim() || response.length < 20}
                className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    La IA está analizando tu respuesta...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {studentAssessment ? 'Reintentar Evaluación' : 'Enviar para Revisión'}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
