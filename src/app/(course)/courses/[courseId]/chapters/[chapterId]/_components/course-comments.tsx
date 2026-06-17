"use client";

import { useState } from "react";
import axios from "axios";
import { Loader2, MessageSquare, Send } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Comment } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CourseCommentsProps {
  comments: (Comment & { replies: Comment[] })[];
  courseId: string;
  chapterId: string;
}

export const CourseComments = ({
  comments,
  courseId,
  chapterId,
}: CourseCommentsProps) => {
  const router = useRouter();
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const onSubmit = async () => {
    if (!text.trim()) return;

    try {
      setIsLoading(true);
      await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/comments`, {
        text
      });
      toast.success("Comentario publicado");
      setText("");
      router.refresh();
    } catch {
      toast.error("Error al publicar el comentario");
    } finally {
      setIsLoading(false);
    }
  }

  const onReply = async (parentId: string, replyText: string) => {
    if (!replyText.trim()) return;
    try {
      setIsLoading(true);
      await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/comments/${parentId}/reply`, {
        text: replyText
      });
      toast.success("Respuesta publicada");
      setReplyingTo(null);
      router.refresh();
    } catch {
      toast.error("Error al publicar respuesta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 glass-card border-white/10 rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative z-10 flex items-center gap-x-3 mb-6">
        <div className="p-3 bg-brand-primary/20 backdrop-blur-md rounded-xl border border-brand-primary/30">
          <MessageSquare className="h-6 w-6 text-brand-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Preguntas y Respuestas
        </h2>
      </div>

      <div className="relative z-10">
        <div className="flex gap-x-3 mb-8">
          <Input 
            placeholder="Escribe tu duda o comentario principal..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
            className="bg-slate-900/50 border-white/10 text-white h-12"
            onKeyDown={(e) => {
              if (e.key === "Enter") onSubmit();
            }}
          />
          <Button 
            onClick={onSubmit}
            disabled={isLoading || !text.trim()}
            className="h-12 px-6 bg-brand-primary hover:bg-brand-secondary text-white transition-all shadow-[0_0_15px_rgba(111,0,255,0.3)]"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>

        <div className="space-y-6">
          {comments.length === 0 && (
            <p className="text-center text-slate-400 py-4 italic">
              Sé el primero en dejar un comentario o hacer una pregunta.
            </p>
          )}
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all hover:bg-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-brand-primary text-sm">
                  Estudiante
                </span>
                <span className="text-xs text-slate-400">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: es })}
                </span>
              </div>
              <p className="text-slate-200 whitespace-pre-wrap text-sm leading-relaxed mb-3">
                {comment.text}
              </p>

              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 pl-4 border-l-2 border-white/10 space-y-3">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="bg-slate-900/40 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-brand-secondary">Respuesta</span>
                        <span className="text-xs text-slate-500">
                          {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: es })}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3">
                {replyingTo === comment.id ? (
                  <div className="flex gap-x-2">
                    <Input 
                      autoFocus
                      placeholder="Escribe tu respuesta..."
                      disabled={isLoading}
                      className="bg-slate-900/50 border-white/10 text-white h-8 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") onReply(comment.id, e.currentTarget.value);
                        if (e.key === "Escape") setReplyingTo(null);
                      }}
                      onBlur={(e) => {
                        if(e.currentTarget.value) onReply(comment.id, e.currentTarget.value);
                        else setReplyingTo(null);
                      }}
                    />
                  </div>
                ) : (
                  <Button 
                    onClick={() => setReplyingTo(comment.id)}
                    variant="ghost" 
                    size="sm" 
                    className="text-slate-400 hover:text-white h-8 text-xs p-0"
                  >
                    Responder
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
