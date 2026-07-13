import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: process.env.SCHEMA_FILE!,
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
