"use client";

import { useState } from "react";
import axios from "axios";
import { Loader2, Reply } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ForumReplyFormProps {
  courseId: string;
  chapterId: string;
  commentId: string;
}

export const ForumReplyForm = ({
  courseId,
  chapterId,
  commentId
}: ForumReplyFormProps) => {
  const router = useRouter();
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const onSubmit = async () => {
    if (!text.trim()) return;

    try {
      setIsLoading(true);
      await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/comments/${commentId}/reply`, {
        text
      });
      toast.success("Respuesta enviada");
      setText("");
      setIsReplying(false);
      router.refresh();
    } catch {
      toast.error("Error al enviar la respuesta");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isReplying) {
    return (
      <Button 
        onClick={() => setIsReplying(true)}
        variant="ghost" 
        size="sm" 
        className="text-slate-400 hover:text-white"
      >
        <Reply className="h-4 w-4 mr-2" />
        Responder
      </Button>
    )
  }

  return (
    <div className="flex gap-x-2 w-full mt-4">
      <Input 
        autoFocus
        placeholder="Escribe tu respuesta..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isLoading}
        className="bg-slate-900/50 border-white/10 text-white flex-1"
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit();
          if (e.key === "Escape") setIsReplying(false);
        }}
      />
      <Button 
        onClick={onSubmit}
        disabled={isLoading || !text.trim()}
        className="bg-brand-primary hover:bg-brand-secondary text-white"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar"}
      </Button>
      <Button 
        onClick={() => setIsReplying(false)}
        variant="ghost"
        disabled={isLoading}
        className="text-slate-400 hover:text-white"
      >
        Cancelar
      </Button>
    </div>
  )
}
