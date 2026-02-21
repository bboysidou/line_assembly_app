import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const { DB_NAME, DB_USER, DB_HOST, DB_PASSWORD, DB_PORT } = process.env;
if (!DB_NAME || !DB_USER || !DB_HOST || !DB_PASSWORD || !DB_PORT) {
  console.error("Database configuration is missing");
  process.exit(1);
}

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: Number(DB_PORT),
});

pool.query("SELECT 1+1", (err) => {
  if (err) {
    console.error("Database connection failed", err.stack);
    return;
  }
  console.log("Database Connected Successfully");
});

export { pool as db_client };
