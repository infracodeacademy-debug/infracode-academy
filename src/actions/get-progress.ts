import { db } from "@/lib/db";

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      }
    });

    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId: userId,
        chapterId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      }
    });

    if (publishedChapterIds.length === 0) {
      return 0;
    }

    const progressPercentage = (validCompletedChapters / publishedChapterIds.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
}

export const getCourseGrade = async (
  userId: string,
  courseId: string
): Promise<{ totalPoints: number; pointsObtained: number; percentage: number } | null> => {
  try {
    const chapters = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      include: {
        quiz: {
          include: {
            studentQuizzes: {
              where: {
                userId,
              }
            }
          }
        },
        openAssessment: {
          include: {
            studentAssessments: {
              where: {
                userId,
              }
            }
          }
        }
      }
    });

    let totalPoints = 0;
    let pointsObtained = 0;
    let hasSummative = false;

    for (const chapter of chapters) {
      // Check Quiz points
      if (chapter.quiz && chapter.quiz.isActive && chapter.quiz.points > 0) {
        hasSummative = true;
        totalPoints += chapter.quiz.points;
        const studentQuiz = chapter.quiz.studentQuizzes[0];
        if (studentQuiz) {
          pointsObtained += Math.round((studentQuiz.score / 100) * chapter.quiz.points);
        }
      }

      // Check AI Assessment points
      if (chapter.openAssessment && chapter.openAssessment.isActive && chapter.openAssessment.points > 0) {
        hasSummative = true;
        totalPoints += chapter.openAssessment.points;
        const studentAssessment = chapter.openAssessment.studentAssessments[0];
        if (studentAssessment && studentAssessment.score !== null) {
          const displayScore = studentAssessment.score > 5 ? Math.round(studentAssessment.score / 20) : studentAssessment.score;
          pointsObtained += Math.round((displayScore / 5) * chapter.openAssessment.points);
        }
      }
    }

    if (!hasSummative || totalPoints === 0) {
      return null;
    }

    const percentage = Math.round((pointsObtained / totalPoints) * 100);

    return {
      totalPoints,
      pointsObtained,
      percentage,
    };
  } catch (error) {
    console.log("[GET_COURSE_GRADE]", error);
    return null;
  }
}
