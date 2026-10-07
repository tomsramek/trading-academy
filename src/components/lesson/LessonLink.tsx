import type { ComponentProps } from "react";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRightIcon } from "lucide-react";

import { routing } from "@/i18n/routing";

// Links in a lesson: pages of the academy keep the current language, other websites open in a new tab.
// An academy link is written in the language of the lesson file without the language prefix –
// "/kurzy/zaklady-kryptomen/bitcoin" in a Czech lesson becomes "/cs/kurzy/zaklady-kryptomen/bitcoin".
export function LessonLink({
  href = "",
  children,
  ...props
}: ComponentProps<"a">) {
  const t = useTranslations("Lesson");
  const locale = useLocale();

  if (href.startsWith("/")) {
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
    return (
      <NextLink href={`${prefix}${href === "/" ? "" : href}` || "/"} {...props}>
        {children}
      </NextLink>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <ArrowUpRightIcon
        aria-hidden="true"
        className="ml-0.5 inline size-[0.9em] align-baseline"
      />
      <span className="sr-only"> ({t("opensInNewTab")})</span>
    </a>
  );
}
