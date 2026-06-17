import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({ url: "file:./dev.db" });

try {
  const prisma = new PrismaClient({ adapter });
  console.log("Success with adapter!");
} catch(e) {
  console.log("Failed with adapter:", e.message);
}
