import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await db.category.createMany({
      data: [
        { name: "Desarrollo Web" },
        { name: "Ciencia de Datos" },
        { name: "Ciberseguridad" },
        { name: "Bases de Datos" },
        { name: "Cloud Computing" },
        { name: "Programación Móvil" },
        { name: "DevOps" },
        { name: "Inglés" },
        { name: "Habilidades Blandas" },
      ],
      skipDuplicates: true,
    });
    return NextResponse.json({ message: "Success" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to seed" }, { status: 500 });
  }
}
