import type { Locale } from "next-intl";

import { SITE_URL } from "@/lib/site";

import { getPathname } from "./navigation";

export type Href = Parameters<typeof getPathname>[0]["href"];

/** The full public address of a page: "https://trading-academy.app/cs/kurzy". */
export function absoluteUrl(locale: Locale, href: Href) {
  return `${SITE_URL}${getPathname({ locale, href })}`;
}
