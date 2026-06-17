require('dotenv').config({ path: __dirname + '/.env' });
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function run() {
  const categories = await db.category.findMany();
  console.log("Categories found:", categories);
}
run();
