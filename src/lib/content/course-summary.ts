import type { Locale } from "next-intl";

import type { Course } from "@/server/content";

import { LEVELS, type Level } from "./levels";

// What a course card needs, in one language. Plain data, so it can be passed to client components.
export type CourseSummary = {
  // The folder name – identifies the course in the saved progress.
  id: string;
  // URL slug in this language.
  slug: string;
  title: string;
  description: string;
  level: Level;
  // Step on the recommended main path, undefined = elective.
  path: number | undefined;
  lessons: number;
  // Lesson file names in order – for the progress bar.
  lessonIds: string[];
  minutes: number;
};

export function toCourseSummary(course: Course, locale: Locale): CourseSummary {
  const lessons = course.modules.flatMap((module) => module.lessons);
  return {
    id: course.slug,
    slug: course.slugs[locale],
    title: course.meta.title[locale],
    description: course.meta.description[locale],
    level: course.meta.level,
    path: course.meta.path,
    lessons: lessons.length,
    lessonIds: lessons.map((lesson) => lesson.slug),
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
