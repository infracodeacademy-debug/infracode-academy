"use client";

import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface CourseSidebarItemProps {
  label: string;
  id: string;
  isCompleted: boolean;
  courseId: string;
  isLocked: boolean;
};

export const CourseSidebarItem = ({
  label,
  id,
  isCompleted,
  courseId,
  isLocked,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const Icon = isLocked ? Lock : (isCompleted ? CheckCircle : PlayCircle);
  const isActive = pathname?.includes(id);

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  }

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-slate-400 text-sm font-[500] mx-3 px-3 py-1.5 rounded-xl transition-all duration-300 hover:text-white hover:bg-white/5",
        isActive && "text-white bg-white/10 hover:bg-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]",
        isCompleted && "text-emerald-400 hover:text-emerald-300",
        isCompleted && isActive && "bg-emerald-500/10 hover:bg-emerald-500/10 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]"
      )}
    >
      <div className="flex items-center gap-x-2 py-2">
        <Icon
          size={20}
          className={cn(
            "text-slate-400 transition-colors",
            isActive && "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]",
            isCompleted && "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
          )}
        />
        <span className="truncate">{label}</span>
      </div>
      <div className={cn(
        "ml-auto opacity-0 w-1.5 h-1.5 rounded-full transition-all duration-300",
        isActive && "opacity-100 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]",
        isCompleted && "bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
      )} />
    </button>
  )
}
