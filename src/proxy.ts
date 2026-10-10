import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Resolves the locale from the URL: /… → English (rewritten to /en/…), /cs/… → Czech.
export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next.js internals, files with an extension (favicon.ico, robots.txt…)
  // and the generated share images – their URLs already contain the locale (/en/…/opengraph-image),
  // and the middleware would redirect the English ones to a URL without /en.
  matcher: "/((?!api|_next|_vercel|.*/opengraph-image|.*\\..*).*)",
};
