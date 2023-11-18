import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing environment variable: DATABASE_URL");
}

const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
migrate(drizzle(migrationClient), {
  migrationsFolder: "db/migrations",
});

const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle(queryClient, { schema });
