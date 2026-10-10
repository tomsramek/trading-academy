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
  // Czech URLs are in Czech: /courses → /cs/kurzy. Course and lesson slugs are translated in the content
  // (course.json and the lesson metadata), these are only the fixed parts of the paths.
  pathnames: {
    "/": "/",
    "/courses": { en: "/courses", cs: "/kurzy" },
    "/courses/[course]": { en: "/courses/[course]", cs: "/kurzy/[course]" },
    "/courses/[course]/[lesson]": {
      en: "/courses/[course]/[lesson]",
      cs: "/kurzy/[course]/[lesson]",
    },
    "/glossary": { en: "/glossary", cs: "/slovnik" },
    "/terms": { en: "/terms", cs: "/podminky-uzivani" },
    "/risk-warning": { en: "/risk-warning", cs: "/upozorneni-na-rizika" },
    "/privacy": { en: "/privacy", cs: "/ochrana-osobnich-udaju" },
    "/sign-in": { en: "/sign-in", cs: "/prihlaseni" },
    "/account": { en: "/account", cs: "/ucet" },
    "/ui": "/ui",
    "/ui/lesson": "/ui/lesson",
  },
});
