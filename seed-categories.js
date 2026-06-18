const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Inglés" },
        { name: "Habilidades Blandas" },
        { name: "Programación" },
        { name: "Diseño" },
        { name: "Marketing" },
        { name: "Negocios" }
      ],
      skipDuplicates: true
    });

    console.log("Success");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();
