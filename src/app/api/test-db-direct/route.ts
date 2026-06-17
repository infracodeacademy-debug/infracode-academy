import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

export async function GET() {
  try {
    const rawUrl = process.env.DATABASE_URL || "";
    const connectionString = rawUrl.trim().replace(/^["']|["']$/g, '');
    
    if (!connectionString) {
      return NextResponse.json({ error: "No connectionString found in process.env.DATABASE_URL" });
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool as any);
    const client = new PrismaClient({ adapter });

    const categories = await client.category.findMany();
    
    return NextResponse.json({ 
      success: true, 
      count: categories.length,
      urlLength: connectionString.length,
      urlStart: connectionString.substring(0, 10)
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      error: error.message,
      urlAvailable: !!process.env.DATABASE_URL 
    }, { status: 500 });
  }
}
