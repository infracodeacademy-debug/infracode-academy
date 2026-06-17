import { db } from "@/lib/db";

interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
};

export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: GetChapterProps) => {
  try {
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        }
      }
    });

    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        price: true,
        reviews: {
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
      include: {
        comments: {
          orderBy: {
            createdAt: "desc"
          }
        },
        quiz: {
          include: {
            questions: {
              orderBy: { position: "asc" },
              include: {
                options: {
                  select: {
                    id: true,
                    text: true,
                    questionId: true,
                    // DO NOT select isCorrect here, so students can't cheat by inspecting network!
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!chapter || !course) {
      throw new Error("Chapter or course not found");
    }

    let nextChapter = null;

    let attachments = [];

    if (purchase || chapter.isFree) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: courseId
        }
      });
      nextChapter = await db.chapter.findFirst({
        where: {
          courseId: courseId,
          isPublished: true,
          position: {
            gt: chapter?.position
          }
        },
        orderBy: {
          position: "asc"
        }
      });
    }

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        }
      }
    });

    return {
      chapter,
      course,
      nextChapter,
      userProgress,
      purchase,
      attachments 
    };
  } catch (error) {
    console.log("[GET_CHAPTER]", error);
    return {
      chapter: null,
      course: null,
      nextChapter: null,
      userProgress: null,
      purchase: null,
      attachments: [],
    }
  }
}
