import { LOGIN_ENABLED } from "@/lib/features";
import { getProgress } from "@/server/progress";
import { getSession } from "@/server/session";

// The signed-in user's progress for the (static) course pages: 401 when nobody is signed in.
export async function GET() {
  if (!LOGIN_ENABLED) {
    return new Response(null, { status: 404 });
  }
  const session = await getSession();
  if (!session) {
    return Response.json({ signedIn: false }, { status: 401 });
  }
  return Response.json(await getProgress(session.user.id), {
    // Personal data – never stored by a shared cache.
    headers: { "Cache-Control": "private, no-store" },
  });
}
