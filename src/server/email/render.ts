import "server-only";

import { getTranslations } from "next-intl/server";

import type { Locale } from "next-intl";

import { magicLinkEmail } from "./magic-link";

// How long a sign-in link works – the auth setup (#34) must use the same value.
export const MAGIC_LINK_MINUTES = 15;

/** The sign-in e-mail in the user's language, ready for sendEmail(). */
export async function renderMagicLinkEmail(locale: Locale, url: string) {
  const t = await getTranslations({ locale, namespace: "Email.magicLink" });
  return magicLinkEmail(
    {
      subject: t("subject"),
      heading: t("heading"),
      intro: t("intro"),
      button: t("button"),
      expiry: t("expiry", { minutes: MAGIC_LINK_MINUTES }),
      ignore: t("ignore"),
      noReply: t("noReply"),
    },
    url,
    locale,
  );
}
