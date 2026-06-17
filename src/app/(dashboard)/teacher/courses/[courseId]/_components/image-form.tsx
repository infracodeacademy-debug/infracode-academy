"use client";

import * as z from "zod";
import axios from "axios";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/uploadthing";

interface ImageFormProps {
  initialData: {
    imageUrl: string | null;
  };
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "La imagen es obligatoria",
  }),
});

export const ImageForm = ({
  initialData,
  courseId,
}: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

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

  return (
    <div className="mt-6 glass-card border-white/10 rounded-xl p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="font-semibold text-lg flex items-center justify-between text-white relative z-10">
        Imagen del curso
        <Button onClick={toggleEdit} variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
          {isEditing && (
            <>Cancelar</>
          )}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Añadir
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Cambiar
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-800/50 rounded-xl mt-4 border border-white/5 relative z-10">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-4 rounded-xl overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)] z-10">
            <Image
              alt="Upload"
              fill
              className="object-cover"
              src={initialData.imageUrl}
            />
          </div>
        )
      )}
      {isEditing && (
        <div className="mt-4 relative z-10">
          <UploadDropzone
            endpoint="courseImage"
            onClientUploadComplete={(res) => {
              onSubmit({ imageUrl: res?.[0]?.url });
            }}
            onUploadError={(error: Error) => {
              toast.error(error?.message);
            }}
            className="ut-label:text-brand-primary ut-allowed-content:text-slate-400 ut-button:bg-brand-primary ut-button:hover:bg-brand-secondary border-brand-primary/30 hover:border-brand-primary/60 transition-colors"
          />
          <div className="text-xs text-slate-400 mt-4 italic text-center">
            Se recomienda una relación de aspecto de 16:9
          </div>
        </div>
      )}
    </div>
  )
}
