import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { ExternalLink, MessageSquare, Reply } from "lucide-react";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { Button } from "@/components/ui/button";
import { ForumReplyForm } from "./_components/forum-reply-form";

const ForumsPage = async () => {
  const { userId } = await auth();

  if (!isTeacher(userId)) {
    return redirect("/");
  }

  // Get all courses owned by the teacher with their chapters and comments
  const courses = await db.course.findMany({
    where: {
      userId: userId!,
    },
    include: {
      chapters: {
        include: {
          comments: {
            where: {
              parentId: null // Only get main threads
            },
            include: {
              replies: true
            },
            orderBy: {
              createdAt: "desc"
            }
          }
        }
      }
    }
  });

  const allComments = courses.flatMap(course => 
    course.chapters.flatMap(chapter => 
      chapter.comments.map(comment => ({
        ...comment,
        courseTitle: course.title,
        courseId: course.id,
        chapterTitle: chapter.title,
        chapterId: chapter.id
      }))
    )
  ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-x-2">
            <MessageSquare className="h-8 w-8 text-brand-primary" />
            Gestión de Foros (Q&A)
          </h1>
          <p className="text-slate-400">
            Responde a las dudas de tus estudiantes en todos tus cursos desde un solo lugar.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {allComments.length === 0 && (
          <div className="text-center p-12 glass-card rounded-xl border border-white/10">
            <MessageSquare className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Aún no hay preguntas en tus cursos.</p>
          </div>
        )}
        
        {allComments.map((comment) => {
          const hasTeacherReplied = comment.replies.some(r => r.userId === userId);
          return (
            <div key={comment.id} className="glass-card rounded-xl p-6 border border-white/10 relative group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-x-2 mb-1">
                    <span className="bg-brand-primary/20 text-brand-primary text-xs font-medium px-2.5 py-0.5 rounded border border-brand-primary/30">
                      Curso: {comment.courseTitle}
                    </span>
                    <span className="text-slate-400 text-xs flex items-center gap-x-1">
                      Capítulo: {comment.chapterTitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2 mt-3">
                    <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-medium text-white border border-white/10">
                      EST
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Estudiante</p>
                      <p className="text-xs text-slate-400">
                        {formatDistanceToNow(comment.createdAt, { addSuffix: true, locale: es })}
                      </p>
                    </div>
                  </div>
                </div>
                <Link href={`/courses/${comment.courseId}/chapters/${comment.chapterId}`}>
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white border border-white/10">
                    Ir al video <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              
              <div className="bg-slate-900/50 rounded-lg p-4 mb-4 border border-white/5">
                <p className="text-slate-200 whitespace-pre-wrap">{comment.text}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <Reply className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-400">{comment.replies.length} respuestas</span>
                </div>
                {hasTeacherReplied ? (
                  <span className="text-emerald-400 text-sm font-medium flex items-center gap-x-1">
                    ✓ Ya respondiste
                  </span>
                ) : (
                  <span className="text-amber-400 text-sm font-medium">
                    Pendiente de respuesta
                  </span>
                )}
              </div>

              {comment.replies.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-white/10 space-y-3">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="bg-white/5 rounded-lg p-3 border border-white/5">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium ${reply.userId === userId ? 'text-brand-primary' : 'text-slate-300'}`}>
                          {reply.userId === userId ? 'Tú (Profesor)' : 'Estudiante'}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatDistanceToNow(reply.createdAt, { addSuffix: true, locale: es })}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <ForumReplyForm 
                  courseId={comment.courseId} 
                  chapterId={comment.chapterId} 
                  commentId={comment.id} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ForumsPage;
