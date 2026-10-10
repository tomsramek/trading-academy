import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import { TextPage } from "@/components/legal/TextPage";
import { pageMetadata } from "@/i18n/page-metadata";
import { getPage } from "@/server/pages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { meta } = await getPage("risk-warning", locale);
  return pageMetadata({
    locale,
    title: meta.title,
    description: meta.description,
    hrefFor: () => "/risk-warning",
  });
}

export default async function RiskWarningPage() {
  const locale = await getLocale();
  return <TextPage page={await getPage("risk-warning", locale)} />;
}
