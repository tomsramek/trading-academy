import type { Locale } from "next-intl";

// URL slugs of a course and its lessons in every language. Plain data, so it can go to the browser.
export type CourseSlugs = {
  slugs: Record<Locale, string>;
  lessons: Record<Locale, string>[];
}[];

type CourseParams = { course?: string; lesson?: string };

/**
 * The same course or lesson in another language: { course: "zaklady-kryptomen" } (cs) →
 * { course: "crypto-basics" } (en). Unknown slugs are left as they are.
 */
export function translateCourseParams(
  params: CourseParams,
  from: Locale,
  to: Locale,
  courses: CourseSlugs,
): CourseParams {
  const course = courses.find((item) => item.slugs[from] === params.course);
  if (!course) {
    return params;
  }
  const lesson = course.lessons.find((item) => item[from] === params.lesson);
  return {
    course: course.slugs[to],
    lesson: lesson ? lesson[to] : params.lesson,
  };
}
