import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import { TextPage } from "@/components/legal/TextPage";
import { alternateLinks } from "@/i18n/alternates";
import { getPage } from "@/server/pages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { meta } = await getPage("privacy", locale);
  return {
    title: meta.title,
    description: meta.description,
    alternates: alternateLinks(locale, () => "/privacy"),
  };
}

export default async function PrivacyPage() {
  const locale = await getLocale();
  return <TextPage page={await getPage("privacy", locale)} />;
}
