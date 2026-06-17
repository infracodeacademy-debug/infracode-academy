import { LucideIcon } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";

interface InfoCardProps {
  numberOfItems: number;
  variant?: "default" | "success";
  label: string;
  icon: LucideIcon;
}

export const InfoCard = ({
  variant,
  icon: Icon,
  numberOfItems,
  label,
}: InfoCardProps) => {
  return (
    <div className="border border-white/10 rounded-2xl flex items-center gap-x-4 p-6 glass-card bg-slate-900/50 relative overflow-hidden group">
      <div className={`absolute inset-0 bg-gradient-to-r ${variant === "success" ? "from-emerald-500/10" : "from-brand-primary/10"} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
      <IconBadge
        variant={variant}
        icon={Icon}
      />
      <div className="relative z-10">
        <p className="font-semibold text-white">
          {label}
        </p>
        <p className="text-slate-400 text-sm">
          {numberOfItems} {numberOfItems === 1 ? "Curso" : "Cursos"}
        </p>
      </div>
    </div>
  )
}
