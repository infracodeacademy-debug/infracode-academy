"use client";

import qs from "query-string";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export const SearchInput = () => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl({
      url: pathname,
      query: {
        categoryId: currentCategoryId,
        title: debouncedValue,
      }
    }, { skipEmptyString: true, skipNull: true });

    router.push(url);
  }, [debouncedValue, currentCategoryId, router, pathname])

  return (
    <div className="relative group">
      <Search
        className="h-4 w-4 absolute top-3 left-3 text-slate-500 dark:text-slate-400 group-focus-within:text-indigo-500 transition-colors"
      />
      <Input
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className="w-full md:w-[350px] pl-10 rounded-full bg-slate-100/80 dark:bg-slate-900/60 backdrop-blur-sm border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 transition-all duration-300 shadow-sm focus:shadow-indigo-500/10"
        placeholder="Buscar un curso por título..."
      />
    </div>
  )
}
