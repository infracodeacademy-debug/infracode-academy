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
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div className="w-full max-w-xl bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
        <h1 className="text-2xl font-bold mb-2 text-white">Ponle nombre a tu curso</h1>
        <p className="text-sm text-slate-400 mb-8">
          ¿Qué vas a enseñar en este curso? No te preocupes, puedes cambiar esto más tarde.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Título del curso</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="ej. 'Master en Redes'"
                      {...field}
                      className="bg-slate-950 border-slate-700 text-white focus-visible:ring-indigo-500"
                    />
                  </FormControl>
                  <FormDescription className="text-slate-500">
                    ¿Qué aprenderán tus alumnos?
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/teacher/courses">
                <Button type="button" variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Continuar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
   );
}
