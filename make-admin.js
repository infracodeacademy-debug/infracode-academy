const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    const user = await database.userProfile.findFirst({
      where: { email: "infracodeacademy@gmail.com" }
    });

    if (user) {
      console.log("Current user:", user);
      if (user.role !== "ADMIN") {
        await database.userProfile.update({
          where: { id: user.id },
          data: { role: "ADMIN" }
        });
        console.log("Updated to ADMIN!");
      }
    } else {
      console.log("User not found in DB. Have they logged in?");
    }
  } catch (error) {
    console.log("Error:", error);
  } finally {
    await database.$disconnect();
  }
}

main();
