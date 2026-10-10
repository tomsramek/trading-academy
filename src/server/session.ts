import "server-only";

import { headers } from "next/headers";

import { auth } from "./auth";

/** The signed-in user's session from the request's cookie, or null. Makes the page dynamic. */
export async function getSession() {
  // Headers first: during the build this marks the page as dynamic and stops there, so Better Auth
  // is created only at request time, when its secrets exist.
  const requestHeaders = await headers();
  return auth().api.getSession({ headers: requestHeaders });
}
