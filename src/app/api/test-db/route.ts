import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const categories = await db.category.findMany();
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message, 
      stack: error.stack,
      name: error.name
    }, { status: 500 });
  }
}
