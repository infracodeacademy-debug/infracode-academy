import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

export async function GET() {
  try {
    const rawUrl = process.env.DATABASE_URL || "";
    const connectionString = rawUrl.trim().replace(/^["']|["']$/g, '');
    
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
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
