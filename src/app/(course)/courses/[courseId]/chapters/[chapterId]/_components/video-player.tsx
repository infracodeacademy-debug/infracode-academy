"use client";

import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  videoUrl: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
};

import axios from "axios";

export const VideoPlayer = ({
  videoUrl,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
          isCompleted: true,
        });

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }

        toast.success("Progreso actualizado");
        router.refresh();
      }
    } catch {
      toast.error("Algo salió mal");
    }
  }

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-slate-200" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-slate-200">
          <Lock className="h-8 w-8" />
          <p className="text-sm">
            Este capítulo está bloqueado
          </p>
        </div>
      )}
      {!isLocked && (
        <video
          className={cn(
            "w-full h-full object-cover",
            !isReady && "hidden"
          )}
          controls
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          src={videoUrl}
        />
      )}
    </div>
  )
}
