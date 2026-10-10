import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { findLesson } from "@/lib/content/course-navigation";
import { getCourse, getCourses } from "@/server/content";
import { OG_SIZE, ogImage } from "@/server/og-image";

// A shared lesson: its title under the course name, with Professor Wick and his coffee.
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Trading Academy";

// Rendered at build time for every lesson, like the lesson pages. Route handlers get no params from
// the [locale] layout, so the locale is generated here too.
export async function generateStaticParams() {
  const courses = await getCourses();
  return routing.locales.flatMap((locale) =>
    courses.flatMap((course) =>
      course.modules.flatMap((courseModule) =>
        courseModule.lessons.map((lesson) => ({
          locale,
          course: course.slugs[locale],
          lesson: lesson.slugs[locale],
        })),
      ),
    ),
  );
}
export const dynamicParams = false;

export default async function Image({
  params,
}: PageProps<"/[locale]/courses/[course]/[lesson]">) {
  const {
    locale: requested,
    course: courseSlug,
    lesson: lessonSlug,
  } = await params;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const [t, tCourses, course] = await Promise.all([
    getTranslations({ locale, namespace: "OgImage" }),
    getTranslations({ locale, namespace: "Courses" }),
    getCourse(courseSlug, locale),
  ]);
  const lesson =
    course && findLesson(course, lessonSlug, locale)?.current?.lesson;
  if (!course || !lesson) {
    return ogImage({ title: t("title"), footer: t("footer"), pose: "coffee" });
  }
  return ogImage({
    title: lesson.meta[locale].title,
    eyebrow: course.meta.title[locale],
    level: {
      value: course.meta.level,
      label: tCourses(`level.${course.meta.level}`),
    },
    footer: t("footer"),
    pose: "coffee",
  });
}
