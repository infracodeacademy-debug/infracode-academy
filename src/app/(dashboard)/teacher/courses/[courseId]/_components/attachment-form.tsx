"use client";

import * as z from "zod";
import axios from "axios";
import { PlusCircle, File, Loader2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

export const AttachmentForm = ({
  initialData,
  courseId
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Archivo adjunto subido correctamente");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Algo salió mal");
    }
  }

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Archivo adjunto eliminado");
      router.refresh();
    } catch {
      toast.error("Algo salió mal");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mt-6 glass-card border-white/10 rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="font-semibold text-lg flex items-center justify-between text-white relative z-10">
        Recursos Descargables
        <Button onClick={toggleEdit} variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10">
          {isEditing && (
            <>Cancelar</>
          )}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Añadir un archivo
            </>
          )}
        </Button>
      </div>
      
      <div className="relative z-10">
        {!isEditing && (
          <>
            {initialData.attachments.length === 0 && (
              <p className="text-sm mt-2 text-slate-500 italic">
                Aún no hay archivos adjuntos
              </p>
            )}
            {initialData.attachments.length > 0 && (
              <div className="space-y-2 mt-4">
                {initialData.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-white/5 border border-white/10 text-slate-200 rounded-lg"
                  >
                    <File className="h-4 w-4 mr-2 flex-shrink-0 text-purple-400" />
                    <p className="text-xs line-clamp-1 flex-1">
                      {attachment.name}
                    </p>
                    {deletingId === attachment.id && (
                      <div>
                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                      </div>
                    )}
                    {deletingId !== attachment.id && (
                      <button
                        onClick={() => onDelete(attachment.id)}
                        className="ml-auto hover:opacity-75 transition"
                      >
                        <X className="h-4 w-4 text-rose-400 hover:text-rose-300 transition" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {isEditing && (
          <div className="mt-4 border border-dashed border-white/20 rounded-xl p-4 bg-white/5">
            <FileUpload
              endpoint="courseAttachment"
              onChange={(url) => {
                if (url) {
                  onSubmit({ url: url });
                }
              }}
            />
            <div className="text-xs text-slate-400 mt-4 text-center">
              Añade cualquier material que tus alumnos puedan necesitar para este curso. (PDF, ZIP, TXT)
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
