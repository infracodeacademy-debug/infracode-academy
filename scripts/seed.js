const { PrismaClient } = require("@prisma/client");
const { Pool, neonConfig } = require("@neondatabase/serverless");
const { PrismaNeon } = require("@prisma/adapter-neon");
const ws = require("ws");

neonConfig.webSocketConstructor = ws;

const connectionString = "process.env.DATABASE_URL";
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const database = new PrismaClient({ adapter });

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Desarrollo Web" },
        { name: "Ciencia de Datos" },
        { name: "Ciberseguridad" },
        { name: "Bases de Datos" },
        { name: "Cloud Computing" },
        { name: "Programación Móvil" },
        { name: "DevOps" },
      ]
    });

    console.log("Success");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();
