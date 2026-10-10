/*
 * Runs once when the server starts, before it handles any request.
 * Applies new database migrations: if one fails, the server does not start, the new container
 * never becomes healthy and Coolify keeps the previous version running.
 * Then removes expired sessions and sign-in links – now and once a day.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export async function register() {
  // Only the Node.js server talks to the database (not the Edge runtime) – and only when it has one.
  if (process.env.NEXT_RUNTIME !== "nodejs" || !process.env.DATABASE_URL) {
    return;
  }
  const { runMigrations } = await import("./server/db/migrate");
  await runMigrations();

  const { deleteExpired } = await import("./server/db/cleanup");
  const cleanUp = async () => {
    try {
      const removed = await deleteExpired();
      console.info(
        `[db] removed ${removed.sessions} expired sessions, ${removed.links} expired links`,
      );
    } catch (error) {
      // A failed clean-up must not take the site down; it runs again tomorrow.
      console.error("[db] clean-up failed", error);
    }
  };
  await cleanUp();
  // unref: the timer does not keep the process alive when the server shuts down.
  setInterval(cleanUp, DAY_MS).unref();
}
