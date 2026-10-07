import type { Locale } from "next-intl";

import type { Course } from "@/server/content";

import { LEVELS, type Level } from "./schema";

// What a course card needs, in one language. Plain data, so it can be passed to client components.
export type CourseSummary = {
  // URL slug in this language.
  slug: string;
  title: string;
  description: string;
  level: Level;
  lessons: number;
  minutes: number;
};

export function toCourseSummary(course: Course, locale: Locale): CourseSummary {
  const lessons = course.modules.flatMap((module) => module.lessons);
  return {
    slug: course.slugs[locale],
    title: course.meta.title[locale],
    description: course.meta.description[locale],
    level: course.meta.level,
    lessons: lessons.length,
    minutes: lessons.reduce(
      (sum, lesson) => sum + lesson.meta[locale].minutes,
      0,
    ),
  };
}

// Beginner courses first, then intermediate and advanced; within a level by `order` from course.json.
export function sortCourses(courses: Course[]): Course[] {
  return courses.toSorted(
    (a, b) =>
      LEVELS.indexOf(a.meta.level) - LEVELS.indexOf(b.meta.level) ||
      a.meta.order - b.meta.order,
  );
}
