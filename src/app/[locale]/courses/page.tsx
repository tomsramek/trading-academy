import { Suspense } from "react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { CourseCatalog } from "@/components/courses/CourseCatalog";
import { CourseCatalogFromUrl } from "@/components/courses/CourseCatalogFromUrl";
import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/i18n/page-metadata";
import { sortCourses, toCourseSummary } from "@/lib/content/course-summary";
import { courseListData } from "@/lib/structured-data";
import { getCourses } from "@/server/content";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("Courses"),
  ]);
  return pageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    hrefFor: () => "/courses",
  });
}

export default async function CoursesPage() {
  const locale = await getLocale();
  const t = await getTranslations("Courses");
  const sorted = sortCourses(await getCourses());
  const courses = sorted.map((course) => toCourseSummary(course, locale));

  return (
    <Container className="flex flex-col gap-10 py-16 sm:py-20">
      <JsonLd data={courseListData(sorted, locale)} />
      <header className="flex max-w-3xl flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {t("title")}
        </h1>
        <p className="text-xl text-pretty text-muted-foreground">
          {t("description")}
        </p>
      </header>
      {/* The static HTML contains every course; the level filter from the URL is applied in the browser. */}
      <Suspense
        fallback={<CourseCatalog courses={courses} level={undefined} />}
      >
        <CourseCatalogFromUrl courses={courses} />
      </Suspense>
    </Container>
  );
}
