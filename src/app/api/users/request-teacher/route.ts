import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userProfile = await db.userProfile.update({
      where: {
        userId: userId,
      },
      data: {
        isTeacherRequested: true,
      }
    });

    return NextResponse.json(userProfile);
  } catch (error) {
    console.log("[USER_REQUEST_TEACHER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
