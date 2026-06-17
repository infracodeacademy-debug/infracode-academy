const { PrismaClient } = require('@prisma/client');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');
const { createClient } = require('@libsql/client');

const libsql = createClient({ url: "file:./dev.db" });
const adapter = new PrismaLibSQL(libsql);

try {
  const prisma = new PrismaClient({ adapter });
  console.log("Success with adapter!");
} catch(e) {
  console.log("Failed with adapter:", e.message);
}
