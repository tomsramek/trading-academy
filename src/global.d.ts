import type { routing } from "@/i18n/routing";
import type messages from "../messages/en.json";

// Makes locales and message keys type-safe in useTranslations / getTranslations.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
