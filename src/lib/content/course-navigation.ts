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

// The lesson and its neighbours, for the previous / next buttons.
export function findLesson(course: Course, slug: string) {
  const lessons = listLessons(course);
  const index = lessons.findIndex((entry) => entry.lesson.slug === slug);
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
