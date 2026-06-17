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
    <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <div className="font-medium flex items-center justify-between">
        Imagen del curso
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Cancelar</>
          )}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Añadir imagen
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Cambiar imagen
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-2 dark:bg-slate-800">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
            />
          </div>
        )
      )}
      {isEditing && (
        <div>
          <UploadDropzone
            endpoint="courseImage"
            onClientUploadComplete={(res) => {
              onSubmit({ imageUrl: res?.[0]?.url });
            }}
            onUploadError={(error: Error) => {
              toast.error(error?.message);
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Se recomienda una relación de aspecto de 16:9
          </div>
        </div>
      )}
    </div>
  )
}
