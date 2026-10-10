import type { Metadata } from "next";
import type { Locale } from "next-intl";

import { SITE_NAME } from "@/lib/site";

import { alternateLinks } from "./alternates";
import { getPathname } from "./navigation";

type Href = Parameters<typeof getPathname>[0]["href"];

type PageMetadataOptions = {
  locale: Locale;
  title: string;
  description: string;
  // The page's address in a given language – for the canonical URL, hreflang and the shared link.
  hrefFor: (locale: Locale) => Href;
  // "article" for lessons, "website" for everything else.
  type?: "website" | "article";
};

/**
 * Title, description, canonical URL, hreflang and the Open Graph preview of an indexable page.
 * A page's `openGraph` replaces the layout's whole object, so it is filled in completely here –
 * otherwise a shared lesson would show the home page's title and address.
 */
export function pageMetadata({
  locale,
  title,
  description,
  hrefFor,
  type = "website",
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: alternateLinks(locale, hrefFor),
    openGraph: {
      type,
      siteName: SITE_NAME,
      title,
      description,
      locale: locale === "cs" ? "cs_CZ" : "en_US",
      url: getPathname({ locale, href: hrefFor(locale) }),
    },
  };
}
