"use client";

import { useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Loader2, Trophy } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

import { Button } from "@/components/ui/button";

interface QuizViewProps {
  quiz: {
    id: string;
    points: number;
    questions: {
      id: string;
      prompt: string;
      options: {
        id: string;
        text: string;
        isCorrect?: boolean;
      }[];
    }[];
  };
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isCompleted?: boolean;
}

export const QuizView = ({
  quiz,
  courseId,
  chapterId,
  nextChapterId,
  isCompleted
}: QuizViewProps) => {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<Record<string, string>>({});

  const isAllAnswered = quiz.questions.every((q) => answers[q.id]);

  const onOptionSelect = (questionId: string, optionId: string) => {
    if (showResult) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      
      const response = await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/quiz/evaluate`, {
        answers
      });
      
      const resultScore = response.data.score;
      const correct = response.data.correctAnswers || {};
      setScore(resultScore);
      setCorrectAnswers(correct);
      setShowResult(true);

      if (resultScore >= 60) {
        toast.success("¡Felicidades! Has aprobado el cuestionario.");
        // Fire confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        router.refresh();
        if (nextChapterId) {
          setTimeout(() => {
            router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
          }, 4000);
        }
      } else {
        toast.error(`Obtuviste un ${resultScore}%. Necesitas un 60% para aprobar.`);
      }
    } catch {
      toast.error("Algo salió mal al evaluar el cuestionario");
    } finally {
      setIsLoading(false);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowResult(false);
    setScore(null);
    setCorrectAnswers({});
  };

  if (!quiz.questions.length) return null;

  if (isCompleted && !showResult) {
    return (
      <div className="mt-8 p-6 glass-card border-emerald-500/30 rounded-2xl bg-emerald-500/10 flex flex-col items-center justify-center text-center">
        <CheckCircle className="h-12 w-12 text-emerald-400 mb-4" />
        <h3 className="text-xl font-bold text-white">¡Cuestionario Aprobado!</h3>
        <p className="text-emerald-200/80 mt-2">Ya has superado esta evaluación con éxito.</p>
        <Button onClick={() => setShowResult(true)} variant="outline" className="mt-4 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/20 hover:text-white transition-all">
          Ver evaluación de nuevo
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 glass-card border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent opacity-50 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Evaluación del Capítulo
          </h2>
          {showResult && score !== null && (() => {
            const isPassing = score >= 60;
            const pointsObtained = quiz.points > 0 ? Math.round((score / 100) * quiz.points) : 0;
            const text = quiz.points > 0 ? `Nota: ${pointsObtained}/${quiz.points}` : `Nota: ${score}%`;
            return (
              <div className={`px-4 py-2 rounded-full font-bold text-lg ${
                isPassing 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/50'
              }`}>
                {text} {quiz.points === 0 && "(Formativa)"}
              </div>
            );
          })()}
        </div>

        {showResult && score !== null && score >= 60 && (
          <div className="mb-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-x-4">
            <Trophy className="h-10 w-10 text-emerald-400 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-emerald-300">¡Excelente trabajo!</h3>
              <p className="text-emerald-200/70 text-sm">Has aprobado el cuestionario y el capítulo ha sido marcado como completado.</p>
            </div>
          </div>
        )}

        {showResult && score !== null && score < 60 && (
          <div className="mb-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-x-4">
            <XCircle className="h-10 w-10 text-rose-400 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-rose-300">No alcanzaste el mínimo</h3>
              <p className="text-rose-200/70 text-sm">Necesitas un 60% para aprobar. ¡Repasa el contenido e inténtalo de nuevo!</p>
            </div>
          </div>
        )}

        {!showResult && (
          <p className="text-slate-300 mb-8">
            Responde las preguntas correctamente para poder avanzar. Necesitas obtener al menos un 60% para aprobar. {quiz.points > 0 ? `Esta evaluación vale ${quiz.points} puntos para la nota del curso.` : "Esta evaluación es formativa y no otorga puntos."}
          </p>
        )}

        <div className="space-y-8">
          {quiz.questions.map((question, index) => {
            const userAnswer = answers[question.id];
            const correctOptionId = correctAnswers[question.id];
            
            return (
              <div key={question.id} className="bg-slate-900/50 p-6 rounded-xl border border-white/5">
                <h3 className="text-lg font-medium text-white mb-4">
                  <span className="text-brand-primary mr-2">{index + 1}.</span>
                  {question.prompt}
                </h3>
                <div className="space-y-3">
                  {question.options.map((option) => {
                    const isSelected = userAnswer === option.id;
                    const isCorrectOption = showResult && correctOptionId === option.id;
                    const isWrongSelection = showResult && isSelected && correctOptionId !== option.id;

                    let optionClass = "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20";
                    
                    if (showResult) {
                      if (isCorrectOption) {
                        optionClass = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300";
                      } else if (isWrongSelection) {
                        optionClass = "bg-rose-500/20 border-rose-500/50 text-rose-300";
                      } else {
                        optionClass = "bg-white/5 border-white/5 text-slate-500";
                      }
                    } else if (isSelected) {
                      optionClass = "bg-brand-primary/20 border-brand-primary text-white";
                    }

                    return (
                      <button
                        key={option.id}
                        disabled={showResult || isLoading}
                        onClick={() => onOptionSelect(question.id, option.id)}
                        className={`w-full text-left p-4 rounded-lg border transition-all duration-200 flex items-center ${optionClass} ${showResult ? "cursor-default" : "cursor-pointer"}`}
                      >
                        <div className="flex items-center justify-center mr-3 flex-shrink-0">
                          {showResult && isCorrectOption && (
                            <CheckCircle className="h-5 w-5 text-emerald-400" />
                          )}
                          {showResult && isWrongSelection && (
                            <XCircle className="h-5 w-5 text-rose-400" />
                          )}
                          {!showResult && (
                            <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${isSelected ? "border-brand-primary" : "border-slate-500"}`}>
                              {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-brand-primary" />}
                            </div>
                          )}
                          {showResult && !isCorrectOption && !isWrongSelection && (
                            <div className="h-5 w-5 rounded-full border border-slate-600" />
                          )}
                        </div>
                        {option.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          {!showResult ? (
            <Button
              onClick={onSubmit}
              disabled={!isAllAnswered || isLoading}
              className="magnetic-button bg-brand-primary hover:bg-brand-secondary text-white shadow-[0_0_20px_rgba(111,0,255,0.4)] px-8 py-6 text-lg w-full md:w-auto"
            >
              {isLoading && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
              Evaluar Respuestas
            </Button>
          ) : (
            <div className="flex gap-x-4 w-full md:w-auto">
              {score !== null && score < 60 && (
                <Button
                  onClick={resetQuiz}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg flex-1 md:flex-none"
                >
                  Intentar de nuevo
                </Button>
              )}
              {score !== null && score >= 60 && nextChapterId && (
                <Button
                  onClick={() => router.push(`/courses/${courseId}/chapters/${nextChapterId}`)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg flex-1 md:flex-none"
                >
                  Siguiente capítulo →
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
