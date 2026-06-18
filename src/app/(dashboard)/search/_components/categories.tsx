"use client";

import { Category } from "@prisma/client";
import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode
} from "react-icons/fc";
import { IconType } from "react-icons";
import { CategoryItem } from "./category-item";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  "Desarrollo Web": FcMultipleDevices,
  "Ciencia de Datos": FcEngineering,
  "Ciberseguridad": FcSalesPerformance,
  "Bases de Datos": FcOldTimeCamera,
  "Cloud Computing": FcMusic,
  "Programación Móvil": FcFilmReel,
  "DevOps": FcSportsMode,
};

export const Categories = ({
  items,
}: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      <CategoryItem
        label="Todos"
      />
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  )
}
