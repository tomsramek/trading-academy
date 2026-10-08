import { getLocale } from "next-intl/server";

import {
  CurriculumSection,
  type HomeCourse,
} from "@/components/home/CurriculumSection";
import { FaqSection } from "@/components/home/FaqSection";
import { Hero } from "@/components/home/Hero";
import { LevelsSection } from "@/components/home/LevelsSection";
import { WhySection } from "@/components/home/WhySection";
import { sortCourses } from "@/lib/content/course-summary";
import { getCourses } from "@/server/content";

export default async function Home() {
  const [courses, locale] = await Promise.all([getCourses(), getLocale()]);
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
      <Hero />
      <WhySection />
      <LevelsSection />
      <CurriculumSection courses={homeCourses} />
      <FaqSection />
    </>
  );
}
