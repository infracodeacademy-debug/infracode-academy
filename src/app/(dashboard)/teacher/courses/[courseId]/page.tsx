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
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-3xl font-bold">Configuración del Curso</h1>
          <span className="text-sm text-slate-500">
            Completa todos los campos {completionText}
          </span>
        </div>
        <Actions
          disabled={!isComplete}
          courseId={params.courseId}
          isPublished={course.isPublished}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-md">
              <LayoutDashboard className="h-6 w-6 text-indigo-700 dark:text-indigo-300" />
            </div>
            <h2 className="text-xl">
              Personaliza tu curso
            </h2>
          </div>
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
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-md">
                <ListChecks className="h-6 w-6 text-indigo-700 dark:text-indigo-300" />
              </div>
              <h2 className="text-xl">
                Capítulos del curso
              </h2>
            </div>
            <ChaptersForm
              initialData={course}
              courseId={course.id}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-md">
                <LayoutDashboard className="h-6 w-6 text-indigo-700 dark:text-indigo-300" />
              </div>
              <h2 className="text-xl">
                Vende tu curso
              </h2>
            </div>
            <PriceForm
              initialData={course}
              courseId={course.id}
            />
          </div>
        </div>
      </div>
    </div>
   );
}
 
export default CourseIdPage;
