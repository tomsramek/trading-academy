import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "cs"],
  defaultLocale: "en",
  // English URLs have no prefix (/courses), Czech ones do (/cs/courses).
  localePrefix: "as-needed",
});
