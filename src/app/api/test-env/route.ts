import { NextResponse } from "next/server";

export async function GET() {
  const rawUrl = process.env.DATABASE_URL || "";
  return NextResponse.json({ 
    hasUrl: !!process.env.DATABASE_URL,
    length: rawUrl.length,
    startsWith: rawUrl.substring(0, 10),
    endsWith: rawUrl.substring(rawUrl.length - 10)
  });
}
