import type { Locale } from "next-intl";

import type { Course, Lesson, Module } from "@/server/content";

// A lesson with its place in the course.
export type LessonEntry = {
  lesson: Lesson;
  module: Module;
  // 1-based numbers: module within the course, lesson within the whole course.
  moduleNumber: number;
  number: number;
};

// All lessons of a course in reading order.
export function listLessons(course: Course): LessonEntry[] {
  return course.modules
    .flatMap((module, moduleIndex) =>
      module.lessons.map((lesson) => ({
        lesson,
        module,
        moduleNumber: moduleIndex + 1,
        number: 0,
      })),
    )
    .map((entry, index) => ({ ...entry, number: index + 1 }));
}

// The lesson with this URL slug in the given language and its neighbours, for the previous / next buttons.
export function findLesson(course: Course, slug: string, locale: Locale) {
  const lessons = listLessons(course);
  const index = lessons.findIndex(
    (entry) => entry.lesson.slugs[locale] === slug,
  );
  if (index === -1) {
    return undefined;
  }
  return {
    current: lessons[index],
    previous: lessons[index - 1],
    next: lessons[index + 1],
    total: lessons.length,
  };
}

// Link targets for the locale-aware <Link> and getPathname: the path is translated by the routing
// (/courses → /cs/kurzy), the slugs come from the content.
export function courseHref(course: Course, locale: Locale) {
  return {
    pathname: "/courses/[course]",
    params: { course: course.slugs[locale] },
  } as const;
}

export function lessonHref(course: Course, lesson: Lesson, locale: Locale) {
  return {
    pathname: "/courses/[course]/[lesson]",
    params: { course: course.slugs[locale], lesson: lesson.slugs[locale] },
  } as const;
}
