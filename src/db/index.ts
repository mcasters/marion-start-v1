import { drizzle } from "drizzle-orm/mysql2";
import { relations } from "./relations";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL!);
export const db = drizzle({ client: connection, relations, logger: true });
