"use client";

import * as z from "zod";
import axios from "axios";
import { HelpCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface ChapterQuizFormProps {
  initialData: {
    id: string;
    quiz: { isActive: boolean } | null;
  };
  courseId: string;
  chapterId: string;
}

export const ChapterQuizForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterQuizFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const toggleQuiz = async () => {
    try {
      setIsLoading(true);
      await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/quiz`);
      toast.success("Estado del cuestionario actualizado");
      router.refresh();
    } catch {
      toast.error("Algo salió mal");
    } finally {
      setIsLoading(false);
    }
  }

  const hasQuiz = initialData.quiz !== null && initialData.quiz.isActive;

  return (
    <div className="mt-6 glass-card border-white/10 rounded-xl p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="font-semibold text-lg flex items-center justify-between text-white relative z-10">
        Cuestionario de Evaluación
      </div>
      
      <div className="mt-4 relative z-10">
        <p className="text-sm text-slate-300 mb-4">
          Añade un cuestionario interactivo al final de este capítulo para evaluar a tus estudiantes antes de que puedan marcarlo como completado.
        </p>

        <div className="flex items-center gap-x-4">
          <Button 
            onClick={toggleQuiz} 
            disabled={isLoading}
            variant={hasQuiz ? "default" : "outline"}
            className={hasQuiz ? "magnetic-button bg-brand-primary hover:bg-brand-secondary text-white shadow-[0_0_15px_rgba(111,0,255,0.3)] transition-all" : "text-slate-300 border-slate-700 hover:bg-white/5"}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {!isLoading && <HelpCircle className="h-4 w-4 mr-2" />}
            {hasQuiz ? "Deshabilitar Cuestionario" : "Habilitar Cuestionario"}
          </Button>
          
          {hasQuiz && (
            <span className="text-sm text-emerald-400 font-medium">
              Cuestionario habilitado
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
