import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import {
  CurriculumSection,
  type HomeCourse,
} from "@/components/home/CurriculumSection";
import { FaqSection } from "@/components/home/FaqSection";
import { Hero } from "@/components/home/Hero";
import { LevelsSection } from "@/components/home/LevelsSection";
import { WhySection } from "@/components/home/WhySection";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/i18n/page-metadata";
import { sortCourses } from "@/lib/content/course-summary";
import { websiteData } from "@/lib/structured-data";
import { getCourses } from "@/server/content";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("Metadata"),
  ]);
  const metadata = pageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    hrefFor: () => "/",
  });
  // The site name alone, without the "– Trading Academy" suffix of the subpages.
  return { ...metadata, title: { absolute: t("title") } };
}

export default async function Home() {
  const [courses, locale, t] = await Promise.all([
    getCourses(),
    getLocale(),
    getTranslations("Metadata"),
  ]);
  // Only published courses come back in production, so drafts never show up here.
  const homeCourses: HomeCourse[] = sortCourses(courses).map((course) => ({
    slug: course.slugs[locale],
    title: course.meta.title[locale],
    level: course.meta.level,
    lessons: course.modules.reduce(
      (count, courseModule) => count + courseModule.lessons.length,
      0,
    ),
    modules: course.modules.map(
      (courseModule) => courseModule.meta.title[locale],
    ),
  }));

  return (
    <>
      <JsonLd data={websiteData(locale, t("description"))} />
      <Hero />
      <WhySection />
      <LevelsSection />
      <CurriculumSection courses={homeCourses} />
      <FaqSection />
    </>
  );
}
