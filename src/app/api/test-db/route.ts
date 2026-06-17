import { NextResponse } from "next/server";
import { Pool } from "@neondatabase/serverless";

export async function GET() {
  try {
    const rawUrl = process.env.DATABASE_URL || "";
    const connectionString = rawUrl.trim().replace(/^["']|["']$/g, '');
    
    if (!connectionString) {
      return NextResponse.json({ error: "Empty connectionString" });
    }

    return NextResponse.json({ 
      attemptedConnectionString: connectionString,
      isString: typeof connectionString === 'string'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
