"use client";

import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  videoUrl: string;
  playbackId?: string | null;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
};

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";

export const VideoPlayer = ({
  videoUrl,
  playbackId,
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
    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(111,0,255,0.15)] border border-white/10 group bg-black">
      {/* Dynamic ambient glow that reacts to video bounding box */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-md flex-col gap-y-4 text-slate-200 z-10 border border-white/5">
          <div className="p-4 bg-white/5 rounded-full border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            <Lock className="h-10 w-10 text-slate-400" />
          </div>
          <p className="text-lg font-medium text-slate-300">
            Este capítulo está bloqueado
          </p>
          <p className="text-sm text-slate-500">
            Adquiere el curso para desbloquear el contenido
          </p>
        </div>
      )}
      {!isLocked && (
        playbackId ? (
          <MuxPlayer
            title={title}
            className="w-full h-full object-cover relative z-0"
            onCanPlay={() => setIsReady(true)}
            onEnded={onEnd}
            playbackId={playbackId}
          />
        ) : (
          <video
            className="w-full h-full object-cover relative z-0"
            controls
            controlsList="nodownload"
            onCanPlay={() => setIsReady(true)}
            onEnded={onEnd}
            src={videoUrl}
          />
        )
      )}
    </div>
  )
}
