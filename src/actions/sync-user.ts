import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

export const syncUser = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    const email = user.emailAddresses[0]?.emailAddress || null;
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || null;

    // Check if this is the first user
    const userCount = await db.userProfile.count();
    const isFirstUser = userCount === 0;

    const userProfile = await db.userProfile.upsert({
      where: {
        userId: userId,
      },
      update: {
        name: name,
        email: email,
      },
      create: {
        userId: userId,
        name: name,
        email: email,
        role: isFirstUser ? "ADMIN" : "STUDENT",
      }
    });

    return userProfile;
  } catch (error) {
    console.log("[SYNC_USER]", error);
    return null;
  }
}
