import { db } from "@/lib/db";
import { Attachment } from "@prisma/client";

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
        muxData: true,
        comments: {
          where: {
            parentId: null
          },
          include: {
            replies: {
              orderBy: {
                createdAt: "asc"
              }
            }
          },
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

    let attachments: Attachment[] = [];

    let openAssessment = null;
    let studentAssessment = null;

    if (purchase || chapter.isFree) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: courseId
        }
      });

      openAssessment = await db.openAssessment.findUnique({
        where: {
          chapterId: chapterId,
        }
      });

      if (openAssessment) {
        studentAssessment = await db.studentAssessment.findUnique({
          where: {
            userId_assessmentId: {
              userId,
              assessmentId: openAssessment.id,
            }
          }
        });
      }

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
      attachments,
      nextChapter,
      userProgress,
      purchase,
      openAssessment,
      studentAssessment,
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
