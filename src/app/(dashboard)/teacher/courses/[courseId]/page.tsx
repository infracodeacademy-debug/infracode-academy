import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LayoutDashboard, ListChecks } from "lucide-react";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
import { ChaptersForm } from "./_components/chapters-form";
import { AttachmentForm } from "./_components/attachment-form";
import { Actions } from "./_components/actions";

const CourseIdPage = async (props: {
  params: Promise<{ courseId: string }>
}) => {
  const params = await props.params;
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some(chapter => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return ( 
    <div className="p-6 max-w-5xl mx-auto relative">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-4xl font-bold text-white tracking-tight">Configuración del Curso</h1>
            <span className="text-sm font-medium text-slate-400 bg-slate-900/50 px-3 py-1 rounded-full border border-white/5 inline-flex w-fit">
              Completa todos los campos {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-x-3 mb-6">
                <div className="p-3 bg-brand-primary/20 backdrop-blur-md rounded-xl border border-brand-primary/30 shadow-[0_0_15px_rgba(111,0,255,0.2)]">
                  <LayoutDashboard className="h-6 w-6 text-brand-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">
                  Personaliza tu curso
                </h2>
              </div>
              <div className="space-y-6">
                <TitleForm
                  initialData={course}
                  courseId={course.id}
                />
                <DescriptionForm
                  initialData={course}
                  courseId={course.id}
                />
                <ImageForm
                  initialData={course}
                  courseId={course.id}
                />
                <CategoryForm
                  initialData={course}
                  courseId={course.id}
                  options={categories.map((category) => ({
                    label: category.name,
                    value: category.id,
                  }))}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-12">
            <div>
              <div className="flex items-center gap-x-3 mb-6">
                <div className="p-3 bg-blue-500/20 backdrop-blur-md rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <ListChecks className="h-6 w-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">
                  Capítulos del curso
                </h2>
              </div>
              <ChaptersForm
                initialData={course}
                courseId={course.id}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-3 mb-6">
                <div className="p-3 bg-emerald-500/20 backdrop-blur-md rounded-xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <LayoutDashboard className="h-6 w-6 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">
                  Vende tu curso
                </h2>
              </div>
              <PriceForm
                initialData={course}
                courseId={course.id}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-3 mb-6 mt-12">
                <div className="p-3 bg-purple-500/20 backdrop-blur-md rounded-xl border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  <LayoutDashboard className="h-6 w-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">
                  Recursos y Archivos
                </h2>
              </div>
              <AttachmentForm
                initialData={course}
                courseId={course.id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
   );
}
 
export default CourseIdPage;
