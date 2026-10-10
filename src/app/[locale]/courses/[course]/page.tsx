import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { CheckIcon } from "lucide-react";

import { CourseOutline } from "@/components/courses/CourseOutline";
import { CourseProgress } from "@/components/progress/CourseProgress";
import { RiskNotice } from "@/components/legal/RiskNotice";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { LevelBadge } from "@/components/courses/LevelBadge";
import { buttonVariants } from "@/components/ui/button";
import { absoluteUrl } from "@/i18n/absolute-url";
import { pageMetadata } from "@/i18n/page-metadata";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { courseHref, lessonHref } from "@/lib/content/course-navigation";
import { LOGIN_ENABLED } from "@/lib/features";
import { breadcrumbData, courseData } from "@/lib/structured-data";
import { cn } from "@/lib/utils";
import { getCourse, getCourses } from "@/server/content";

// One page per course and language, generated at build time; other course URLs are 404.
// [locale] comes from the layout, the course slug differs per language.
export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  if (!hasLocale(routing.locales, params.locale)) {
    return [];
  }
  const locale = params.locale;
  return (await getCourses()).map((course) => ({
    course: course.slugs[locale],
  }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/courses/[course]">): Promise<Metadata> {
  const { course: slug } = await params;
  const locale = await getLocale();
  const course = await getCourse(slug, locale);
  if (!course) {
    return {};
  }
  return pageMetadata({
    locale,
    title: course.meta.title[locale],
    description: course.meta.description[locale],
    hrefFor: (other) => courseHref(course, other),
  });
}

export default async function CoursePage({
  params,
}: PageProps<"/[locale]/courses/[course]">) {
  const { course: slug } = await params;
  const locale = await getLocale();
  const [course, t, tCourses] = await Promise.all([
    getCourse(slug, locale),
    getTranslations("CourseDetail"),
    getTranslations("Courses"),
  ]);
  if (!course) {
    notFound();
  }

  const lessons = course.modules.flatMap((module) => module.lessons);
  const firstLesson = lessons[0];
  const minutes = lessons.reduce(
    (sum, lesson) => sum + lesson.meta[locale].minutes,
    0,
  );

  return (
    <Container className="flex flex-col gap-12 py-12 sm:py-16">
      <JsonLd data={courseData(course, locale)} />
      <JsonLd
        data={breadcrumbData([
          { name: tCourses("title"), url: absoluteUrl(locale, "/courses") },
          {
            name: course.meta.title[locale],
            url: absoluteUrl(locale, courseHref(course, locale)),
          },
        ])}
      />
      <header className="flex max-w-3xl flex-col gap-5">
        <nav aria-label={t("breadcrumb")}>
          <Link
            href="/courses"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← {tCourses("title")}
          </Link>
        </nav>
        <LevelBadge level={course.meta.level} />
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {course.meta.title[locale]}
        </h1>
        <p className="text-xl text-pretty text-muted-foreground">
          {course.meta.description[locale]}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("modules", { count: course.modules.length })} ·{" "}
          {tCourses("lessons", { count: lessons.length })} ·{" "}
          {tCourses("minutes", { count: minutes })}
        </p>
        {/* Seen before the reader starts the course. */}
        <RiskNotice />
        {firstLesson && LOGIN_ENABLED ? (
          <CourseProgress
            course={course.slug}
            lessons={lessons.map((lesson) => ({
              id: lesson.slug,
              href: lessonHref(course, lesson, locale),
            }))}
          />
        ) : firstLesson ? (
          <Link
            href={lessonHref(course, firstLesson, locale)}
            className={cn(buttonVariants({ size: "lg" }), "w-fit")}
          >
            {t("start")}
          </Link>
        ) : (
          <p className="text-muted-foreground">{t("noLessons")}</p>
        )}
      </header>

      <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold tracking-tight">
              {t("audience")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {course.meta.audience[locale]}
            </p>
          </section>
          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold tracking-tight">
              {t("outcomes")}
            </h2>
            <ul className="flex flex-col gap-2 text-lg">
              {course.meta.outcomes[locale].map((outcome) => (
                <li key={outcome} className="flex gap-3">
                  <CheckIcon
                    className="mt-1 size-5 shrink-0 text-bull"
                    aria-hidden="true"
                  />
                  {outcome}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t("outline")}
          </h2>
          <CourseOutline course={course} />
        </section>
      </div>
    </Container>
  );
}
