import { magicLinkClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Better Auth in the browser: sign in, sign out, the current session. Talks to /api/auth on the same
// origin, so no base URL is needed.
export const authClient = createAuthClient({
  plugins: [magicLinkClient()],
});
