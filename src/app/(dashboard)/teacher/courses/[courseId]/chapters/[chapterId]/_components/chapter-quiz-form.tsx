"use client";

import * as z from "zod";
import axios from "axios";
import { HelpCircle, Loader2, PlusCircle, Trash, CheckCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Option, Question, Quiz } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChapterQuizFormProps {
  initialData: {
    id: string;
    quiz: (Quiz & { questions: (Question & { options: Option[] })[] }) | null;
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
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestionPrompt, setNewQuestionPrompt] = useState("");
  const [newOptionTexts, setNewOptionTexts] = useState<Record<string, string>>({});
  
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

  const addQuestion = async () => {
    if (!newQuestionPrompt.trim()) return;
    try {
      setIsLoading(true);
      await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/quiz/questions`, {
        prompt: newQuestionPrompt,
      });
      toast.success("Pregunta añadida");
      setNewQuestionPrompt("");
      setIsAddingQuestion(false);
      router.refresh();
    } catch {
      toast.error("Algo salió mal");
    } finally {
      setIsLoading(false);
    }
  }

  const deleteQuestion = async (questionId: string) => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}/quiz/questions/${questionId}`);
      toast.success("Pregunta eliminada");
      router.refresh();
    } catch {
      toast.error("Algo salió mal");
    } finally {
      setIsLoading(false);
    }
  }

  const addOption = async (questionId: string) => {
    const text = newOptionTexts[questionId];
    if (!text?.trim()) return;
    try {
      setIsLoading(true);
      await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/quiz/questions/${questionId}/options`, {
        text,
        isCorrect: false,
      });
      toast.success("Opción añadida");
      setNewOptionTexts(prev => ({ ...prev, [questionId]: "" }));
      router.refresh();
    } catch {
      toast.error("Algo salió mal");
    } finally {
      setIsLoading(false);
    }
  }

  const deleteOption = async (questionId: string, optionId: string) => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}/quiz/questions/${questionId}/options/${optionId}`);
      toast.success("Opción eliminada");
      router.refresh();
    } catch {
      toast.error("Algo salió mal");
    } finally {
      setIsLoading(false);
    }
  }

  const markAsCorrect = async (questionId: string, optionId: string) => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/quiz/questions/${questionId}/options/${optionId}`);
      toast.success("Respuesta correcta actualizada");
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
          Añade un cuestionario interactivo al final de este capítulo para evaluar a tus estudiantes antes de que puedan marcarlo como completado (Necesitan 80% para aprobar).
        </p>

        <div className="flex items-center gap-x-4 mb-6">
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
        </div>

        {hasQuiz && initialData.quiz && (
          <div className="space-y-6">
            {initialData.quiz.questions.map((question, index) => (
              <div key={question.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-white font-medium">
                    Pregunta {index + 1}: {question.prompt}
                  </h4>
                  <button onClick={() => deleteQuestion(question.id)} disabled={isLoading} className="text-rose-400 hover:text-rose-300">
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-2 pl-4 border-l-2 border-white/10">
                  {question.options.map((option) => (
                    <div key={option.id} className="flex items-center justify-between bg-white/5 px-3 py-2 rounded-md">
                      <span className="text-sm text-slate-300 flex items-center gap-x-2">
                        <button 
                          onClick={() => markAsCorrect(question.id, option.id)} 
                          disabled={isLoading}
                          className={`h-4 w-4 rounded-full border ${option.isCorrect ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500 hover:border-emerald-500'} flex items-center justify-center transition`}
                        >
                          {option.isCorrect && <CheckCircle className="h-3 w-3 text-white" />}
                        </button>
                        {option.text}
                      </span>
                      <button onClick={() => deleteOption(question.id, option.id)} disabled={isLoading} className="text-slate-400 hover:text-rose-400">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-x-2 mt-2">
                    <Input 
                      placeholder="Nueva opción..." 
                      className="bg-slate-900/50 border-white/10 text-white h-8 text-sm"
                      value={newOptionTexts[question.id] || ""}
                      onChange={(e) => setNewOptionTexts(prev => ({ ...prev, [question.id]: e.target.value }))}
                    />
                    <Button onClick={() => addOption(question.id)} disabled={isLoading || !newOptionTexts[question.id]} size="sm" className="h-8">
                      Añadir
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {isAddingQuestion ? (
              <div className="bg-white/5 border border-brand-primary/30 rounded-lg p-4 space-y-4">
                <Input 
                  placeholder="Ej. ¿Qué es React?"
                  className="bg-slate-900/50 border-white/10 text-white"
                  value={newQuestionPrompt}
                  onChange={(e) => setNewQuestionPrompt(e.target.value)}
                />
                <div className="flex justify-end gap-x-2">
                  <Button onClick={() => setIsAddingQuestion(false)} variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                    Cancelar
                  </Button>
                  <Button onClick={addQuestion} disabled={isLoading || !newQuestionPrompt} size="sm" className="bg-brand-primary hover:bg-brand-secondary text-white">
                    Guardar
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setIsAddingQuestion(true)} variant="outline" className="w-full border-dashed border-white/20 text-slate-300 hover:bg-white/5 hover:text-white">
                <PlusCircle className="h-4 w-4 mr-2" />
                Añadir Pregunta
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
