import type { Metadata } from "next";
import type { Locale } from "next-intl";

import { getPathname } from "./navigation";
import { routing } from "./routing";

type Href = Parameters<typeof getPathname>[0]["href"];

/**
 * Canonical URL and hreflang links of a page whose address differs per language, so search engines
 * know /courses/crypto-basics and /cs/kurzy/zaklady-kryptomen are one page in two languages.
 */
export function alternateLinks(
  locale: Locale,
  hrefFor: (locale: Locale) => Href,
): Metadata["alternates"] {
  const languages = Object.fromEntries(
    routing.locales.map((other) => [
      other,
      getPathname({ locale: other, href: hrefFor(other) }),
    ]),
  );
  return {
    canonical: languages[locale],
    languages: { ...languages, "x-default": languages[routing.defaultLocale] },
  };
}
