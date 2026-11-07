import { drizzle } from "drizzle-orm/mysql2";
import { relations } from "./relations";
import mysql from "mysql2/promise";
import 'dotenv/config'; // Prevent from undefined process.env.DATABASE_URL

const pool = mysql.createPool(process.env.DATABASE_URL!);
export const db = drizzle({ client: pool, relations, logger: process.env.NODE_ENV !== 'production' });
