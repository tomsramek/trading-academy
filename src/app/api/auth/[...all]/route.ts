import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/server/auth";

// Better Auth's endpoints: /api/auth/sign-in/magic-link, /api/auth/magic-link/verify, /api/auth/get-session …
// The handler is created on the first request, so the build needs no login secrets.
export async function GET(request: Request) {
  return toNextJsHandler(auth()).GET(request);
}

export async function POST(request: Request) {
  return toNextJsHandler(auth()).POST(request);
}
