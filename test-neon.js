require('dotenv').config({ path: __dirname + '/.env' });
const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');
const crypto = require('crypto');

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    const categories = [
      "Desarrollo Web",
      "Ciencia de Datos",
      "Ciberseguridad",
      "Bases de Datos",
      "Cloud Computing",
      "Programación Móvil",
      "DevOps"
    ];

    for (const name of categories) {
      const id = crypto.randomUUID();
      try {
        await pool.query('INSERT INTO "Category" (id, name) VALUES ($1, $2)', [id, name]);
        console.log(`Inserted category: ${name}`);
      } catch (err) {
        if (err.code === '23505') {
          console.log(`Category ${name} already exists. Skipping.`);
        } else {
          throw err;
        }
      }
    }
    console.log("Seed completed successfully!");
  } catch (err) {
    console.error("Query Error:", err);
  } finally {
    await pool.end();
  }
}
run();
