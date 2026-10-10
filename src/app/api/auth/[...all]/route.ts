import { toNextJsHandler } from "better-auth/next-js";

import { LOGIN_ENABLED } from "@/lib/features";
import { auth } from "@/server/auth";

// Better Auth's endpoints: /api/auth/sign-in/magic-link, /api/auth/magic-link/verify, /api/auth/get-session …
// The handler is created on the first request, so the build needs no login secrets.
// While login is not public, the endpoints do not exist.
const notFound = () => new Response(null, { status: 404 });

export async function GET(request: Request) {
  return LOGIN_ENABLED ? toNextJsHandler(auth()).GET(request) : notFound();
}

export async function POST(request: Request) {
  return LOGIN_ENABLED ? toNextJsHandler(auth()).POST(request) : notFound();
}
