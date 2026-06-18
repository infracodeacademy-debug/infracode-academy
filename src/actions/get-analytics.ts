import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & {
  course: Course;
};

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {};

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }
    grouped[courseTitle] += purchase.course.price!;
  });

  return grouped;
};

export const getAnalytics = async (userId: string) => {
  try {
    const purchases = await db.purchase.findMany({
      where: {
        course: {
          userId: userId
        }
      },
      include: {
        course: true,
      }
    });

    const groupedEarnings = groupByCourse(purchases);
    const data = Object.entries(groupedEarnings).map(([courseTitle, total]) => ({
      name: courseTitle,
      total: total,
    }));

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalSales = purchases.length;

    // Active Students
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeProgress = await db.userProgress.findMany({
      where: {
        updatedAt: { gte: thirtyDaysAgo },
        chapter: { course: { userId: userId } }
      },
      select: { userId: true },
      distinct: ['userId']
    });
    const activeStudents = activeProgress.length;

    // Drop-off data (Chapters where users are stuck)
    const inProgressChapters = await db.userProgress.groupBy({
      by: ['chapterId'],
      where: {
        isCompleted: false,
        chapter: { course: { userId: userId } }
      },
      _count: {
        userId: true
      }
    });

    const chapters = await db.chapter.findMany({
      where: { course: { userId: userId } },
      select: { id: true, title: true }
    });

    const dropOffData = inProgressChapters.map(ip => {
       const chapter = chapters.find(c => c.id === ip.chapterId);
       return {
          name: chapter?.title || 'Capítulo',
          total: ip._count.userId
       }
    }).sort((a,b) => b.total - a.total).slice(0, 5);

    return {
      data,
      totalRevenue,
      totalSales,
      activeStudents,
      dropOffData
    }
  } catch (error) {
    console.log("[GET_ANALYTICS]", error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
      activeStudents: 0,
      dropOffData: []
    }
  }
}
