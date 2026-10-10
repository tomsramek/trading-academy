import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { getCourse, getCourses } from "@/server/content";
import { OG_SIZE, ogImage } from "@/server/og-image";

// A shared course: its title and level, with Professor Wick standing proud.
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Trading Academy";

// Rendered at build time for every course, like the course pages. Route handlers get no params from
// the [locale] layout, so the locale is generated here too.
export async function generateStaticParams() {
  const courses = await getCourses();
  return routing.locales.flatMap((locale) =>
    courses.map((course) => ({ locale, course: course.slugs[locale] })),
  );
}
export const dynamicParams = false;

export default async function Image({
  params,
}: PageProps<"/[locale]/courses/[course]">) {
  const { locale: requested, course: slug } = await params;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const [t, tCourses, course] = await Promise.all([
    getTranslations({ locale, namespace: "OgImage" }),
    getTranslations({ locale, namespace: "Courses" }),
    getCourse(slug, locale),
  ]);
  if (!course) {
    return ogImage({ title: t("title"), footer: t("footer"), pose: "coffee" });
  }
  return ogImage({
    title: course.meta.title[locale],
    level: {
      value: course.meta.level,
      label: tCourses(`level.${course.meta.level}`),
    },
    footer: t("footer"),
    pose: "standing",
  });
}
