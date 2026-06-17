"use client";

import { useState } from "react";
import axios from "axios";
import { Loader2, Star } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Review } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CourseReviewsProps {
  reviews: Review[];
  courseId: string;
  hasPurchased: boolean;
}

export const CourseReviews = ({
  reviews,
  courseId,
  hasPurchased,
}: CourseReviewsProps) => {
  const router = useRouter();
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    if (!hasPurchased) {
      toast.error("Debes adquirir el curso para dejar una reseña");
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`/api/courses/${courseId}/reviews`, {
        rating,
        text
      });
      toast.success("Reseña publicada con éxito");
      setText("");
      router.refresh();
    } catch {
      toast.error("Error al publicar la reseña");
    } finally {
      setIsLoading(false);
    }
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="mt-8 glass-card border-white/10 rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="flex items-center gap-x-3">
          <div className="p-3 bg-yellow-500/20 backdrop-blur-md rounded-xl border border-yellow-500/30">
            <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
          </div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            Reseñas del Curso
          </h2>
        </div>
        {reviews.length > 0 && (
          <div className="flex items-center gap-x-2">
            <span className="text-2xl font-bold text-white">{averageRating}</span>
            <div className="flex">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            </div>
            <span className="text-slate-400 text-sm">({reviews.length})</span>
          </div>
        )}
      </div>

      <div className="relative z-10">
        {hasPurchased && (
          <div className="bg-slate-900/50 p-6 rounded-xl border border-white/10 mb-8">
            <h3 className="text-lg font-medium text-white mb-4">Deja tu valoración</h3>
            <div className="flex items-center gap-x-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    className={`h-8 w-8 ${
                      star <= (hoverRating || rating)
                        ? "text-yellow-400 fill-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]" 
                        : "text-slate-600"
                    }`} 
                  />
                </button>
              ))}
            </div>
            <div className="flex gap-x-3">
              <Input 
                placeholder="Cuéntanos qué te pareció el curso..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isLoading}
                className="bg-slate-900/50 border-white/10 text-white h-12"
              />
              <Button 
                onClick={onSubmit}
                disabled={isLoading}
                className="h-12 px-6 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)]"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publicar"}
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.length === 0 && (
            <p className="text-slate-400 py-4 italic col-span-2">
              Aún no hay reseñas. ¡Sé el primero en valorar este curso!
            </p>
          )}
          {reviews.map((review) => (
            <div key={review.id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      className={`h-4 w-4 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-600"}`} 
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-400">
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: es })}
                </span>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed">
                {review.text || "Sin comentarios."}
              </p>
              <p className="text-slate-400 text-xs mt-4">Estudiante Verificado</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
