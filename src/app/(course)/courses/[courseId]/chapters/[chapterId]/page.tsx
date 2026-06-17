import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";

import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { CourseProgressButton } from "./_components/course-progress-button";

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
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
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
        </div>
      </div>
    </div>
   );
}
 
export default ChapterIdPage;
