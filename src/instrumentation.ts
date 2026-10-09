/*
 * Runs once when the server starts, before it handles any request.
 * Applies new database migrations: if one fails, the server does not start, the new container
 * never becomes healthy and Coolify keeps the previous version running.
 */
export async function register() {
  // Only the Node.js server talks to the database (not the Edge runtime) – and only when it has one.
  if (process.env.NEXT_RUNTIME !== "nodejs" || !process.env.DATABASE_URL) {
    return;
  }
  const { runMigrations } = await import("./server/db/migrate");
  await runMigrations();
}
