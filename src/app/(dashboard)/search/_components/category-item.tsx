"use client";

import qs from "query-string";
import { IconType } from "react-icons";
import { 
  usePathname, 
  useRouter, 
  useSearchParams 
} from "next/navigation";

import { cn } from "@/lib/utils";

interface CategoryItemProps {
  label: string;
  value?: string;
  icon?: IconType;
};

export const CategoryItem = ({
  label,
  value,
  icon: Icon,
}: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl({
      url: pathname,
      query: {
        title: currentTitle,
        categoryId: isSelected ? null : value,
      }
    }, { skipNull: true, skipEmptyString: true });

    router.push(url);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "py-2 px-4 text-sm font-medium border border-slate-200 rounded-full flex items-center gap-x-2 transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/40 dark:backdrop-blur-sm dark:hover:border-indigo-500/50 hover:shadow-md active:scale-95",
        isSelected && "border-indigo-500 bg-indigo-500/10 text-indigo-700 shadow-indigo-500/20 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500 shadow-inner"
      )}
      type="button"
    >
      {Icon && <Icon size={18} className="drop-shadow-sm" />}
      <div className="truncate">
        {label}
      </div>
    </button>
  )
}
