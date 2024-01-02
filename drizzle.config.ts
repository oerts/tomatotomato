import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

if (!process.env.POSTGRES_URL) {
  throw new Error("Missing environment variable: POSTGRES_URL");
}

export default {
  schema: "./app/db/schema.ts",
  out: "./app/db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL,
  },
} satisfies Config;
