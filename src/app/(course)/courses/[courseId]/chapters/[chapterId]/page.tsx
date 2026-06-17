import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { File } from "lucide-react";

import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { CourseProgressButton } from "./_components/course-progress-button";
import { QuizView } from "./_components/quiz-view";

import { CourseComments } from "./_components/course-comments";
import { CourseReviews } from "../../_components/course-reviews";
import { AssessmentView } from "./_components/assessment-view";

const ChapterIdPage = async (props: {
  params: Promise<{ courseId: string; chapterId: string }>
}) => {
  const params = await props.params;
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    chapter,
    course,
    nextChapter,
    userProgress,
    purchase,
    attachments,
    openAssessment,
    studentAssessment,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) {
    return redirect("/")
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;
  
  const hasQuiz = chapter.quiz?.isActive && chapter.quiz.questions.length > 0;

  return ( 
    <div className="min-h-full pb-20 relative">
      {/* Background Ambient Glow for the entire page */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[400px] bg-brand-primary/10 blur-[150px] pointer-events-none" />

      {userProgress?.isCompleted && (
        <Banner
          variant="success"
          label="Ya completaste este capítulo."
        />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="Necesitas adquirir este curso para ver el capítulo."
        />
      )}
      <div className="flex flex-col max-w-5xl mx-auto pt-8 px-4 sm:px-6 relative z-10">
        <div className="w-full">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            videoUrl={chapter.videoUrl!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div className="mt-8 glass-card border-white/10 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {chapter.title}
            </h2>
            {purchase ? (
              hasQuiz ? (
                <div className="flex items-center text-sm font-medium text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                  Resuelve el cuestionario
                </div>
              ) : (
                <CourseProgressButton
                  chapterId={params.chapterId}
                  courseId={params.courseId}
                  nextChapterId={nextChapter?.id}
                  isCompleted={!!userProgress?.isCompleted}
                />
              )
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator className="my-8 bg-white/10" />
          <div className="prose prose-invert prose-slate max-w-none">
            <div className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
              {chapter.description}
            </div>
          </div>
          {hasQuiz && (
            <QuizView 
              quiz={chapter.quiz!}
              courseId={params.courseId}
              chapterId={params.chapterId}
              nextChapterId={nextChapter?.id}
              isCompleted={!!userProgress?.isCompleted}
            />
          )}
          {!!attachments.length && (
            <>
              <Separator className="my-8 bg-white/10" />
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-x-2">
                  <File className="h-5 w-5 text-purple-400" />
                  Recursos Descargables
                </h3>
                <div className="space-y-3">
                  {attachments.map((attachment) => (
                    <a
                      href={attachment.url}
                      target="_blank"
                      key={attachment.id}
                      className="flex items-center p-3 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 rounded-lg transition-colors group"
                    >
                      <File className="h-4 w-4 mr-2 flex-shrink-0 text-purple-400 group-hover:text-purple-300" />
                      <p className="text-sm line-clamp-1 flex-1 font-medium group-hover:text-white transition">
                        {attachment.name}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        {!!openAssessment?.isActive && (
          <AssessmentView 
            assessment={openAssessment}
            studentAssessment={studentAssessment}
            courseId={params.courseId}
            chapterId={params.chapterId}
          />
        )}

        {/* Render Q&A Forum */}
        <CourseComments 
          comments={chapter.comments || []}
          courseId={params.courseId}
          chapterId={params.chapterId}
        />
        
        {/* Render Reviews */}
        <CourseReviews
          reviews={course.reviews || []}
          courseId={params.courseId}
          hasPurchased={!!purchase}
        />
      </div>
    </div>
   );
}
 
export default ChapterIdPage;
