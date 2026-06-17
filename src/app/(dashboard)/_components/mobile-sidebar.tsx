import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle
} from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu className="text-slate-200" />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-slate-950 border-r-slate-800">
        <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}
