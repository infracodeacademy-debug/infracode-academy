"use client";

import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ChaptersListProps {
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

export const ChaptersList = ({
  items,
  onReorder,
  onEdit
}: ChaptersListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedChapters = items.slice(startIndex, endIndex + 1);

    setChapters(items);

    const bulkUpdateData = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id)
    }));

    onReorder(bulkUpdateData);
  }

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable 
                key={chapter.id} 
                draggableId={chapter.id} 
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-900/40 backdrop-blur-md border-white/5 border text-slate-300 rounded-xl mb-4 text-sm transition-all duration-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]",
                      chapter.isPublished && "bg-brand-primary/10 border-brand-primary/20 text-white shadow-[0_0_15px_rgba(111,0,255,0.1)]"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={provided.draggableProps.style as React.CSSProperties}
                  >
                    <div
                      className={cn(
                        "px-3 py-4 border-r border-white/5 hover:bg-white/5 rounded-l-xl transition",
                        chapter.isPublished && "border-white/10 hover:bg-brand-primary/20"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="font-medium px-2">
                      {chapter.title}
                    </div>
                    <div className="ml-auto pr-4 flex items-center gap-x-3">
                      {chapter.isFree && (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Gratis
                        </Badge>
                      )}
                      <Badge className={cn(
                        "bg-slate-800 text-slate-400 border border-white/5",
                        chapter.isPublished && "bg-brand-primary/20 text-brand-primary border-brand-primary/30"
                      )}>
                        {chapter.isPublished ? "Publicado" : "Borrador"}
                      </Badge>
                      <div className="p-2 bg-slate-800/50 hover:bg-white/10 rounded-lg cursor-pointer transition-colors" onClick={() => onEdit(chapter.id)}>
                        <Pencil className="w-4 h-4 text-slate-400 hover:text-white transition" />
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
