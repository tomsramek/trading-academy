"use client";

import NextLink from "next/link";
import { CheckIcon, ChevronDownIcon, GlobeIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getPathname, usePathname } from "@/i18n/navigation";
import { LANGUAGES } from "@/i18n/languages";
import { routing } from "@/i18n/routing";

type Props = {
  // "bottom" opens the menu below the button (header), "top" above it (bottom of the mobile menu).
  side?: "bottom" | "top";
};

export function LocaleSwitcher({ side = "bottom" }: Props) {
  const t = useTranslations("LocaleSwitcher");
  const currentLocale = useLocale();
  // Current path without the locale prefix, e.g. "/courses" for both /courses and /cs/courses.
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
        <GlobeIcon />
        <span aria-hidden="true">{LANGUAGES[currentLocale].short}</span>
        <span className="sr-only">
          {t("label")}: {LANGUAGES[currentLocale].name}
        </span>
        <ChevronDownIcon className="size-3 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} align="end" className="w-40 glass">
        {routing.locales.map((locale) => (
          // getPathname gives "/" for English and "/cs/…" for Czech. next-intl's <Link locale> would
          // always add a prefix (/en), which then only redirects back to "/".
          <DropdownMenuLinkItem
            key={locale}
            render={
              <NextLink
                href={getPathname({ href: pathname, locale })}
                lang={locale}
                hrefLang={locale}
                aria-current={locale === currentLocale ? "true" : undefined}
              />
            }
            className="justify-between"
          >
            {LANGUAGES[locale].name}
            {locale === currentLocale && <CheckIcon className="text-link" />}
          </DropdownMenuLinkItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
