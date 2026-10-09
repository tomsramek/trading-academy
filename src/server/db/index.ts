import "server-only";

import postgres from "postgres";
import { z } from "zod";

/*
 * The connection to PostgreSQL. Server-only: importing this file from a client component stops the
 * build, so the database and its password never reach the browser.
 */

const envSchema = z.object({
  // postgres://user:password@host:5432/database
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
});

// Read lazily on first use: pages that never touch the database keep working without DATABASE_URL.
function databaseUrl(): string {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error(
      `DATABASE_URL is missing or invalid – copy .env.example to .env.local:\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data.DATABASE_URL;
}

// In development every file change reloads the modules; keeping the client on globalThis stops each
// reload from opening a new pool of connections.
const globalForDb = globalThis as { sql?: postgres.Sql };

export function db(): postgres.Sql {
  globalForDb.sql ??= postgres(databaseUrl(), {
    // A small pool: one app instance on a small server.
    max: 10,
  });
  return globalForDb.sql;
}
