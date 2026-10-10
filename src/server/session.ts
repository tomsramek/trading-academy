import "server-only";

import { headers } from "next/headers";

import { auth } from "./auth";

/** The signed-in user's session from the request's cookie, or null. Makes the page dynamic. */
export async function getSession() {
  return auth().api.getSession({ headers: await headers() });
}
