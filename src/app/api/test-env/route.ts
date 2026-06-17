import { NextResponse } from "next/server";

// Evaluate at module level
const topLevelUrl = process.env.DATABASE_URL;

export async function GET() {
  return NextResponse.json({ 
    topLevelUrl: topLevelUrl ? "EXISTS" : "UNDEFINED",
    handlerUrl: process.env.DATABASE_URL ? "EXISTS" : "UNDEFINED"
  });
}
