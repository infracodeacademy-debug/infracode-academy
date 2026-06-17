require("dotenv").config({ path: __dirname + '/../.env' });
const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient({});

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
