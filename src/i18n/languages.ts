import type { Locale } from "next-intl";

// Display data for every locale in routing.ts. `Record<Locale, …>` makes TypeScript require
// an entry for each locale – adding a language without a name here is a type error.
// Names are written in their own language and are never translated.
export const LANGUAGES: Record<Locale, { name: string; short: string }> = {
  en: { name: "English", short: "EN" },
  cs: { name: "Čeština", short: "CS" },
};
