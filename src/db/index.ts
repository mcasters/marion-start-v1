import { drizzle } from "drizzle-orm/mysql2";
import { relations } from "./relations";
import mysql from "mysql2/promise";
import "dotenv/config";

const connection = await mysql.createConnection(process.env.DATABASE_URL!);
export const db = drizzle({ client: connection, relations });

/*export const db = drizzle(process.env.DATABASE_URL!, {
  relations,
  logger: true,
});

export const db = drizzle({
  connection: { uri: process.env.DATABASE_URL },
  relations,
  logger: true,
});*/
