import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "cs"],
  defaultLocale: "en",
  // English URLs have no prefix (/courses), Czech ones do (/cs/courses).
  localePrefix: "as-needed",
  // No automatic redirect based on the browser language or a cookie – the locale comes only from the URL.
  localeDetection: false,
  // Without detection the NEXT_LOCALE cookie has no purpose – the site sets no cookies at all.
  localeCookie: false,
});
