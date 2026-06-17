"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/uploadthing";

interface ChapterVideoFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Capítulo actualizado");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Algo salió mal");
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <div className="font-medium flex items-center justify-between">
        Video del capítulo
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Cancelar</>
          )}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Añadir un video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Cambiar video
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md dark:bg-slate-800 mt-2">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <video
              className="w-full h-full rounded-md"
              controls
              src={initialData.videoUrl}
            />
          </div>
        )
      )}
      {isEditing && (
        <div>
          <UploadDropzone
            endpoint="chapterVideo"
            onClientUploadComplete={(res) => {
              if (res?.[0]?.url) {
                onSubmit({ videoUrl: res?.[0]?.url });
              }
            }}
            onUploadError={(error: Error) => {
              toast.error(error?.message);
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Sube el video de este capítulo
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Los videos pueden tardar unos minutos en procesarse. Refresca la página si el video no aparece.
        </div>
      )}
    </div>
  )
}
