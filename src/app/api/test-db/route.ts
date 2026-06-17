import { NextResponse } from "next/server";
import { Pool } from "@neondatabase/serverless";

export async function GET() {
  try {
    const rawUrl = process.env.DATABASE_URL || "";
    const connectionString = rawUrl.trim().replace(/^["']|["']$/g, '');
    
    // Test Pool creation directly
    const pool = new Pool({ connectionString });
    await pool.query('SELECT 1 as result');
    
    return NextResponse.json({ 
      success: true, 
      connectionStringLength: connectionString.length,
      startsWith: connectionString.substring(0, 5)
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message, 
      stack: error.stack,
      name: error.name
    }, { status: 500 });
  }
}
