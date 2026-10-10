import "server-only";

import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { z } from "zod";

import * as schema from "./schema";

/*
 * The connection to PostgreSQL. Server-only: importing this file from a client component stops the
 * build, so the database and its password never reach the browser.
 */

const envSchema = z.object({
  // postgres://user:password@host:5432/database
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
});

// Read lazily on first use: pages that never touch the database keep working without DATABASE_URL.
export function databaseUrl(): string {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error(
      `DATABASE_URL is missing or invalid – copy .env.example to .env.local:\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data.DATABASE_URL;
}

export type Database = PostgresJsDatabase<typeof schema>;

// In development every file change reloads the modules; keeping the client on globalThis stops each
// reload from opening a new pool of connections.
const globalForDb = globalThis as { database?: Database };

/** The database with typed queries over the tables in ./schema. */
export function db(): Database {
  globalForDb.database ??= drizzle({
    // A small pool: one app instance on a small server.
    client: postgres(databaseUrl(), { max: 10 }),
    schema,
    // camelCase in TypeScript, snake_case columns in the database.
    casing: "snake_case",
  });
  return globalForDb.database;
}
