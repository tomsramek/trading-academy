import type { MetadataRoute } from "next";
import type { Locale } from "next-intl";

import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { courseHref, lessonHref } from "@/lib/content/course-navigation";
import { SITE_URL } from "@/lib/site";
import { getCourses } from "@/server/content";
import { getPage, type PageName } from "@/server/pages";

type Href = Parameters<typeof getPathname>[0]["href"];

// Pages from content/pages, with the date of their last change.
const TEXT_PAGES: { name: PageName; href: Href }[] = [
  { name: "support", href: "/support" },
  { name: "terms", href: "/terms" },
  { name: "risk-warning", href: "/risk-warning" },
  { name: "privacy", href: "/privacy" },
];

const absolute = (locale: Locale, href: Href) =>
  `${SITE_URL}${getPathname({ locale, href })}`;

/**
 * One entry per page and language, each listing all its language versions (hreflang), so search
 * engines find the Czech pages too. Only published courses come back in production; sign-in and the
 * account are left out (they are not content and have noindex).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await getCourses();

  const pages: { hrefFor: (locale: Locale) => Href; lastModified?: string }[] =
    [
      { hrefFor: () => "/" },
      { hrefFor: () => "/courses" },
      { hrefFor: () => "/glossary" },
      ...courses.flatMap((course) => [
        { hrefFor: (locale: Locale) => courseHref(course, locale) },
        ...course.modules.flatMap((courseModule) =>
          courseModule.lessons.map((lesson) => ({
            hrefFor: (locale: Locale) => lessonHref(course, lesson, locale),
          })),
        ),
      ]),
      ...(await Promise.all(
        TEXT_PAGES.map(async ({ name, href }) => ({
          hrefFor: () => href,
          // The same date in both languages; the English file is the reference.
          lastModified: (await getPage(name, routing.defaultLocale)).meta
            .updated,
        })),
      )),
    ];

  return pages.flatMap(({ hrefFor, lastModified }) => {
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [
        locale,
        absolute(locale, hrefFor(locale)),
      ]),
    );
    return routing.locales.map((locale) => ({
      url: absolute(locale, hrefFor(locale)),
      lastModified,
      alternates: {
        languages: {
          ...languages,
          "x-default": absolute(
            routing.defaultLocale,
            hrefFor(routing.defaultLocale),
          ),
        },
      },
    }));
  });
}
