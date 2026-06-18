import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const user = await db.userProfile.findFirst({
      where: { email: "infracodeacademy@gmail.com" }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found. Please login first." });
    }

    const updatedUser = await db.userProfile.update({
      where: { id: user.id },
      data: { role: "ADMIN" }
    });

    return NextResponse.json({ message: "Successfully made infracodeacademy@gmail.com ADMIN", user: updatedUser });
  } catch (error) {
    console.log("[MAKE_ADMIN_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
