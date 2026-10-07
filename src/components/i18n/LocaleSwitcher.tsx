"use client";

import NextLink from "next/link";
import { useParams } from "next/navigation";
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
import {
  translateCourseParams,
  type CourseSlugs,
} from "@/lib/content/localized-slugs";

type Props = {
  // URL slugs of the courses and lessons in every language – a lesson has a different address in each.
  courseSlugs: CourseSlugs;
  // "bottom" opens the menu below the button (header), "top" above it (bottom of the mobile menu).
  side?: "bottom" | "top";
};

export function LocaleSwitcher({ courseSlugs, side = "bottom" }: Props) {
  const t = useTranslations("LocaleSwitcher");
  const currentLocale = useLocale();
  // The route without the locale, e.g. "/courses/[course]" for /courses/crypto-basics and
  // /cs/kurzy/zaklady-kryptomen, and its params in the current language.
  const pathname = usePathname();
  const params = useParams<{ course?: string; lesson?: string }>();

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
                href={getPathname({
                  locale,
                  href: hrefWithParams(
                    pathname,
                    translateCourseParams(
                      params,
                      currentLocale,
                      locale,
                      courseSlugs,
                    ),
                  ),
                })}
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

// A route with params for getPathname. The params exist on their routes, so the empty fallback is
// never used – it only satisfies the types.
function hrefWithParams(
  pathname: ReturnType<typeof usePathname>,
  params: { course?: string; lesson?: string },
) {
  const course = params.course ?? "";
  switch (pathname) {
    case "/courses/[course]":
      return { pathname, params: { course } };
    case "/courses/[course]/[lesson]":
      return { pathname, params: { course, lesson: params.lesson ?? "" } };
    default:
      return pathname;
  }
}
