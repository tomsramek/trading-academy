import "server-only";

import { lt } from "drizzle-orm";

import { db } from ".";
import { sessions, verifications } from "./schema";

/**
 * Deletes expired sessions and sign-in links – the privacy policy promises they do not linger.
 * Returns how many rows went.
 */
export async function deleteExpired() {
  const now = new Date();
  const [expiredSessions, expiredLinks] = await Promise.all([
    db()
      .delete(sessions)
      .where(lt(sessions.expiresAt, now))
      .returning({ id: sessions.id }),
    db()
      .delete(verifications)
      .where(lt(verifications.expiresAt, now))
      .returning({ id: verifications.id }),
  ]);
  return { sessions: expiredSessions.length, links: expiredLinks.length };
}
