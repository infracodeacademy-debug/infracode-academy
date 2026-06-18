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

export const getAdminAnalytics = async (adminUserId: string) => {
  try {
    const purchases = await db.purchase.findMany({
      include: {
        course: true,
      }
    });

    const groupedEarnings = groupByCourse(purchases);
    const data = Object.entries(groupedEarnings).map(([name, total]) => ({
      name,
      total,
    }));

    let totalAcademyRevenue = 0;
    let totalCommissions = 0;
    
    purchases.forEach((purchase) => {
      const price = purchase.course.price || 0;
      if (purchase.course.userId === adminUserId) {
        // Academy's own course: 100% revenue
        totalAcademyRevenue += price;
      } else {
        // Other teacher's course: 30% commission
        totalCommissions += price * 0.30;
      }
    });

    const totalRevenue = totalAcademyRevenue + totalCommissions;
    const totalSales = purchases.length;

    return {
      data,
      totalRevenue,
      totalAcademyRevenue,
      totalCommissions,
      totalSales,
    }
  } catch (error) {
    console.log("[ADMIN_ANALYTICS]", error);
    return {
      data: [],
      totalRevenue: 0,
      totalAcademyRevenue: 0,
      totalCommissions: 0,
      totalSales: 0,
    }
  }
}
