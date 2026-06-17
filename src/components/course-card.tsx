import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { formatPrice } from "@/lib/format";
import { CourseProgress } from "@/components/course-progress";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string;
};

export const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group transition-all duration-300 overflow-hidden border rounded-2xl p-3 h-full dark:border-slate-800/60 dark:bg-slate-900/40 dark:backdrop-blur-md hover:shadow-lg dark:hover:shadow-indigo-500/10 hover:-translate-y-1 hover:border-indigo-500/50 dark:hover:border-indigo-500/50">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-indigo-500/20 group-hover:bg-transparent transition-colors z-10 duration-300" />
          <Image
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            alt={title}
            src={imageUrl}
          />
        </div>
        <div className="flex flex-col pt-4 px-1">
          <div className="text-lg md:text-base font-bold group-hover:text-indigo-600 transition line-clamp-2 dark:text-slate-100 dark:group-hover:text-indigo-400">
            {title}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {category}
          </p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1.5 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-md">
              <IconBadge size="sm" icon={BookOpen} />
              <span className="font-medium">
                {chaptersLength} {chaptersLength === 1 ? "Capítulo" : "Capítulos"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <CourseProgress
              variant={progress === 100 ? "success" : "default"}
              size="sm"
              value={progress}
            />
          ) : (
            <p className="text-md md:text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-auto">
              {formatPrice(price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
