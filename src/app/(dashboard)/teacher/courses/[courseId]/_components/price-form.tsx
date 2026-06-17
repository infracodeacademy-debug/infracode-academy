"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PriceFormProps {
  initialData: {
    price: number | null;
  };
  courseId: string;
}

const formSchema = z.object({
  price: z.coerce.number().min(0, {
    message: "El precio no puede ser negativo",
  }),
});

export const PriceForm = ({
  initialData,
  courseId,
}: PriceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      price: initialData?.price || undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Curso actualizado");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Algo salió mal");
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price)
  }

  return (
    <div className="mt-6 glass-card border-white/10 rounded-xl p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="font-semibold text-lg flex items-center justify-between text-white relative z-10">
        Precio del curso
        <Button onClick={toggleEdit} variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
          {isEditing ? (
            <>Cancelar</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={`text-sm mt-3 relative z-10 ${!initialData.price ? "text-slate-500 italic" : "text-slate-300"}`}>
          {initialData.price !== null
            ? formatPrice(initialData.price)
            : "No hay precio"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4 relative z-10"
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      disabled={isSubmitting}
                      placeholder="Ej. '29.99'"
                      {...field}
                      className="glass-input text-white border-white/20 focus-visible:ring-brand-primary focus-visible:border-brand-primary"
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
                className="magnetic-button bg-brand-primary hover:bg-brand-secondary text-white shadow-[0_0_15px_rgba(111,0,255,0.3)] transition-all"
              >
                Guardar
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
