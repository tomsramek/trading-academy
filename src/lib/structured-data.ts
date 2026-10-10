import type { Locale } from "next-intl";

import { absoluteUrl } from "@/i18n/absolute-url";
import type { Course, Lesson } from "@/server/content";

import { courseHref, lessonHref } from "./content/course-navigation";
import { SITE_NAME, SITE_URL } from "./site";

/*
 * schema.org descriptions of the academy for search engines and AI assistants (rendered by JsonLd).
 * Kept to the facts on the page: the courses are free, online and made by one author.
 */

export type StructuredData = { "@context": "https://schema.org" } & Record<
  string,
  unknown
>;

const AUTHOR = {
  "@type": "Person",
  name: "Tom Sramek",
  url: "https://tomsramek.com",
};

const ORGANIZATION = {
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/apple-icon.png`,
  founder: AUTHOR,
};

const LEVEL_NAMES = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
} as const;

const context = "https://schema.org" as const;

/** The site itself – on the home page. */
export function websiteData(
  locale: Locale,
  description: string,
): StructuredData {
  return {
    "@context": context,
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl(locale, "/"),
    description,
    inLanguage: locale,
    publisher: ORGANIZATION,
  };
}

/** A course: free, online, with its level, length, outcomes and modules. */
export function courseData(course: Course, locale: Locale): StructuredData {
  const lessons = course.modules.flatMap(
    (courseModule) => courseModule.lessons,
  );
  const minutes = lessons.reduce(
    (total, lesson) => total + lesson.meta[locale].minutes,
    0,
  );
  return {
    "@context": context,
    "@type": "Course",
    name: course.meta.title[locale],
    description: course.meta.description[locale],
    url: absoluteUrl(locale, courseHref(course, locale)),
    // The generated share image; its route is not translated, so the internal path is used.
    image: `${SITE_URL}/${locale}/courses/${course.slugs[locale]}/opengraph-image`,
    inLanguage: locale,
    educationalLevel: LEVEL_NAMES[course.meta.level],
    teaches: course.meta.outcomes[locale],
    isAccessibleForFree: true,
    provider: ORGANIZATION,
    author: AUTHOR,
    offers: {
      "@type": "Offer",
      category: "Free",
      price: 0,
      priceCurrency: "EUR",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      courseWorkload: `PT${minutes}M`,
    },
    syllabusSections: course.modules.map((courseModule) => ({
      "@type": "Syllabus",
      name: courseModule.meta.title[locale],
    })),
  };
}

/** The courses of the catalog, in the order they are shown. */
export function courseListData(
  courses: Course[],
  locale: Locale,
): StructuredData {
  return {
    "@context": context,
    "@type": "ItemList",
    itemListElement: courses.map((course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(locale, courseHref(course, locale)),
    })),
  };
}

export type Breadcrumb = { name: string; url: string };

/** Where a page sits: Courses › Course › Lesson. */
export function breadcrumbData(items: Breadcrumb[]): StructuredData {
  return {
    "@context": context,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** The breadcrumbs of a lesson. */
export function lessonBreadcrumbs(
  course: Course,
  lesson: Lesson,
  locale: Locale,
  coursesTitle: string,
): Breadcrumb[] {
  return [
    { name: coursesTitle, url: absoluteUrl(locale, "/courses") },
    {
      name: course.meta.title[locale],
      url: absoluteUrl(locale, courseHref(course, locale)),
    },
    {
      name: lesson.meta[locale].title,
      url: absoluteUrl(locale, lessonHref(course, lesson, locale)),
    },
  ];
}

/** Questions and answers shown on the page, e.g. the FAQ on the home page. */
export function faqData(
  items: { question: string; answer: string }[],
): StructuredData {
  return {
    "@context": context,
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}
