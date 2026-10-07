import { getLocale } from "next-intl/server";

import { CurriculumSection } from "@/components/home/CurriculumSection";
import { FaqSection } from "@/components/home/FaqSection";
import { Hero } from "@/components/home/Hero";
import { LevelsSection } from "@/components/home/LevelsSection";
import { WhySection } from "@/components/home/WhySection";
import { getCourses } from "@/server/content";

// The course presented on the home page.
const FIRST_COURSE = "crypto-basics";

export default async function Home() {
  const [courses, locale] = await Promise.all([getCourses(), getLocale()]);
  // Missing while the course is a draft – the section then says "coming soon".
  const course = courses.find((item) => item.slug === FIRST_COURSE);

  return (
    <>
      <Hero />
      <WhySection />
      <LevelsSection />
      <CurriculumSection courseSlug={course?.slugs[locale]} />
      <FaqSection />
    </>
  );
}
