import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

declare global {
  var prisma: PrismaClient | undefined;
}

const getPrisma = () => {
  if (globalThis.prisma) return globalThis.prisma;
  
  const rawUrl = process.env.DATABASE_URL || "";
  const connectionString = rawUrl.trim().replace(/^["']|["']$/g, '');
  
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool as any);
  
  const client = new PrismaClient({ adapter });
  if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = client;
  }
  return client;
};

// Use a Proxy so we don't call getPrisma() until the first query!
export const db = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    const client = getPrisma();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  }
});
