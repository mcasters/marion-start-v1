import { drizzle } from "drizzle-orm/mysql2";
import { relations } from "./relations";
import mysql from "mysql2/promise";
import "dotenv/config";

const connection = await mysql.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
});
export const db = drizzle({ client: connection, relations, logger: true });
