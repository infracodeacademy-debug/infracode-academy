"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "El título es obligatorio",
  }),
});

export default function CreateCoursePage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ""
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/courses", values);
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success("Curso creado exitosamente");
    } catch {
      toast.error("Algo salió mal");
    }
  }

  return ( 
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6 relative">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-primary/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-xl glass-card p-10 rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)] relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-brand-primary/20 rounded-xl mb-6 shadow-[0_0_20px_rgba(111,0,255,0.2)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
          </div>
          <h1 className="text-3xl font-bold mb-3 text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Ponle nombre a tu curso
          </h1>
          <p className="text-base text-slate-400">
            ¿Qué vas a enseñar en este curso? No te preocupes, puedes cambiar esto más tarde.
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-slate-300 font-medium">Título del curso</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="ej. 'Master en Redes de Computadoras'"
                      {...field}
                      className="glass-input h-14 text-lg border-white/10 text-white focus-visible:ring-brand-primary focus-visible:border-brand-primary transition-all duration-300"
                    />
                  </FormControl>
                  <FormDescription className="text-slate-500">
                    Un buen título ayuda a tus alumnos a saber exactamente qué aprenderán.
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-4 pt-4 border-t border-white/10">
              <Link href="/teacher/courses">
                <Button type="button" variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10 h-12 px-6">
                  Cancelar
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={!isValid || isSubmitting} 
                className="magnetic-button h-12 px-8 bg-brand-primary hover:bg-brand-secondary text-white shadow-[0_0_20px_rgba(111,0,255,0.3)] hover:shadow-[0_0_30px_rgba(111,0,255,0.5)] transition-all duration-300"
              >
                Continuar al Editor
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
   );
}
