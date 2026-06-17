import { NextResponse } from "next/server";

export async function GET() {
  const val = process.env.DATABASE_URL;
  return NextResponse.json({ 
    valType: typeof val,
    valLength: val ? val.length : 0,
    valStart: val ? val.substring(0, 10) : null,
    valExact: val === "undefined" ? "LITERAL_UNDEFINED" : val === "null" ? "LITERAL_NULL" : "OTHER"
  });
}
