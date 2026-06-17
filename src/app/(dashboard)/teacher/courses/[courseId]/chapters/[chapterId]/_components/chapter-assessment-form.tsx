"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { OpenAssessment } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChapterAssessmentFormProps {
  initialData: OpenAssessment | null;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: "La instrucción debe tener al menos 10 caracteres",
  }),
  rubric: z.string().min(10, {
    message: "La rúbrica debe tener al menos 10 caracteres",
  }),
});

export const ChapterAssessmentForm = ({
  initialData,
  courseId,
  chapterId
}: ChapterAssessmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: initialData?.prompt || "",
      rubric: initialData?.rubric || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/assessment`, values);
      toast.success("Evaluación IA actualizada");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Hubo un error al guardar");
    }
  }

  return (
    <div className="mt-6 border border-white/10 bg-slate-900/50 rounded-xl p-6 glass-card relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="font-medium flex items-center justify-between mb-2 relative z-10 text-white">
        <div className="flex items-center gap-x-2">
          <div className="p-2 bg-emerald-500/20 backdrop-blur-md rounded-lg border border-emerald-500/30">
            <Sparkles className="h-5 w-5 text-emerald-400" />
          </div>
          Evaluación con Inteligencia Artificial
        </div>
        <Button onClick={toggleEdit} variant="ghost" className="text-slate-300 hover:text-white border border-white/5">
          {isEditing ? (
            <>Cancelar</>
          ) : (
            <>Editar Evaluación</>
          )}
        </Button>
      </div>
      
      {!isEditing && (
        <div className="relative z-10 mt-4">
          {!initialData?.prompt && (
            <p className="text-sm text-slate-400 italic">
              No hay evaluación de IA configurada para este capítulo.
            </p>
          )}
          {initialData?.prompt && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Instrucción para el estudiante</p>
                <p className="text-sm text-slate-300 bg-black/20 p-3 rounded-lg border border-white/5">{initialData.prompt}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Rúbrica (Secreta para IA)</p>
                <p className="text-sm text-slate-300 bg-black/20 p-3 rounded-lg border border-white/5 whitespace-pre-wrap">{initialData.rubric}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4 relative z-10"
          >
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-emerald-400">Instrucción para el estudiante</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="Ej: Escribe un ensayo de 300 palabras sobre la importancia de la computación en la nube..."
                      className="bg-black/20 border-white/10 text-white min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rubric"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-emerald-400">Rúbrica (Criterios de Evaluación)</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="Ej: 1. Menciona al menos 3 ventajas (30pts) 2. Excelente ortografía (20pts) 3. Conclusión fuerte (50pts)"
                      className="bg-black/20 border-white/10 text-white min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Guardar
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
