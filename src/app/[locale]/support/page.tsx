import type { Metadata } from "next";
import { ArrowUpRightIcon, CoffeeIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { ProfessorWick } from "@/components/brand/ProfessorWick";
import { TextPage } from "@/components/legal/TextPage";
import { buttonVariants } from "@/components/ui/button";
import { pageMetadata } from "@/i18n/page-metadata";
import { DONATE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import { getPage } from "@/server/pages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { meta } = await getPage("support", locale);
  return pageMetadata({
    locale,
    title: meta.title,
    description: meta.description,
    hrefFor: () => "/support",
  });
}

// What the academy costs and what stays free, with a plain link to the donation page.
export default async function SupportPage() {
  const locale = await getLocale();
  const t = await getTranslations("Support");

  return (
    <TextPage page={await getPage("support", locale)}>
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center sm:p-8">
        <ProfessorWick pose="coffee" className="max-w-48" />
        <p className="max-w-md text-pretty text-muted-foreground">
          {t("thanks")}
        </p>
        <a
          href={DONATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ size: "lg" }))}
        >
          <CoffeeIcon aria-hidden="true" />
          {t("donate")}
          <ArrowUpRightIcon aria-hidden="true" />
          <span className="sr-only"> ({t("opensInNewTab")})</span>
        </a>
      </div>
    </TextPage>
  );
}
