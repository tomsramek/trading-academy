import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Resolves the locale from the URL: /… → English (rewritten to /en/…), /cs/… → Czech.
export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next.js internals and files with an extension (favicon.ico, robots.txt…).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
