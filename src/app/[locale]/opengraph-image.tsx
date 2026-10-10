import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { OG_SIZE, ogImage } from "@/server/og-image";

// The picture for shared links to pages without their own: the home page, the catalog, the glossary…
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Trading Academy";

// Rendered at build time for every locale, like the pages.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: PageProps<"/[locale]">) {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "OgImage" });
  return ogImage({ title: t("title"), footer: t("footer"), pose: "coffee" });
}
