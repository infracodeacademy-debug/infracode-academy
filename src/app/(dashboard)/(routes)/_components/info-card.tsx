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
    <div className="border rounded-md flex items-center gap-x-4 p-4 dark:border-slate-800">
      <IconBadge
        variant={variant}
        icon={Icon}
      />
      <div>
        <p className="font-medium dark:text-slate-200">
          {label}
        </p>
        <p className="text-gray-500 text-sm dark:text-gray-400">
          {numberOfItems} {numberOfItems === 1 ? "Curso" : "Cursos"}
        </p>
      </div>
    </div>
  )
}
