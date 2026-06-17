import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

export async function GET() {
  try {
    const rawUrl = process.env.DATABASE_URL || "";
    const connectionString = rawUrl.trim().replace(/^["']|["']$/g, '');
    
    // Hardcode for testing!
    const testString = "postgresql://neondb_owner:npg_yTjg4pYUGn9o@ep-purple-rain-ad6fxqka-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
    
    const pool = new Pool({ connectionString: testString });
    const adapter = new PrismaNeon(pool as any);
    const client = new PrismaClient({ adapter });

    const categories = await client.category.findMany();
    
    return NextResponse.json({ 
      success: true, 
      count: categories.length
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
