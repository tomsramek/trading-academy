import type { Course } from "@/server/content";

import type { Level } from "./content/schema";

/*
 * Badges are not stored – they follow from the saved progress, so they also count work done before
 * they existed. Each badge says whether it is earned, when, and how far along the user is.
 */

export type LessonRecord = {
  course: string;
  lesson: string;
  completedAt: Date;
};
export type QuizRecord = {
  course: string;
  module: string;
  total: number;
  best: number;
  bestAt: Date;
  createdAt: Date;
};

export type BadgeGroup = "courses" | "lessons" | "quizzes" | "days";
export type BadgeIcon =
  "course" | "path" | "lessons" | "quiz" | "perfect" | "trophy" | "days";
export type BadgeTone = Level | "gold" | "blue" | "green" | "violet";
// Texts under Badges.badge.<key> (title and description).
export type BadgeKey =
  | "course"
  | "path"
  | "firstLesson"
  | "lessons"
  | "firstQuiz"
  | "perfectQuiz"
  | "perfectCourse"
  | "days";

export type Badge = {
  id: string;
  group: BadgeGroup;
  icon: BadgeIcon;
  tone: BadgeTone;
  // Translation key under Badges.badge and its values (a course title, a number).
  key: BadgeKey;
  values: Record<string, string | number>;
  earnedAt?: Date;
  progress: { done: number; total: number };
};

export const LESSON_MILESTONES = [1, 10, 50, 100] as const;
export const DAY_MILESTONES = [3, 7] as const;

const latest = (dates: Date[]) =>
  dates.length > 0
    ? new Date(Math.max(...dates.map((date) => date.getTime())))
    : undefined;
const earliest = (dates: Date[]) =>
  dates.length > 0
    ? new Date(Math.min(...dates.map((date) => date.getTime())))
    : undefined;

// "2026-10-10" in Prague – a lesson at 23:30 and one at 00:30 are two different days.
const dayFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Prague",
});

/** Every badge, earned or not, for the given courses (in one language for the titles). */
export function computeBadges(
  courses: Course[],
  lessons: LessonRecord[],
  quizzes: QuizRecord[],
  title: (course: Course) => string,
): Badge[] {
  // Only progress of lessons and quizzes that still exist counts.
  const lessonKeys = new Set(
    courses.flatMap((course) =>
      course.modules.flatMap((module) =>
        module.lessons.map((lesson) => `${course.slug}/${lesson.slug}`),
      ),
    ),
  );
  const doneLessons = lessons
    .filter((record) => lessonKeys.has(`${record.course}/${record.lesson}`))
    .toSorted((a, b) => a.completedAt.getTime() - b.completedAt.getTime());
  const quizzesOf = (course: Course) =>
    course.modules
      .filter((module) => module.quiz)
      .map((module) =>
        quizzes.find(
          (record) =>
            record.course === course.slug && record.module === module.slug,
        ),
      );

  const courseBadges = courses.map((course): Badge => {
    const courseLessons = course.modules.flatMap((module) => module.lessons);
    const lessonRecords = courseLessons.map((lesson) =>
      doneLessons.find(
        (record) =>
          record.course === course.slug && record.lesson === lesson.slug,
      ),
    );
    const quizRecords = quizzesOf(course);
    const records = [...lessonRecords, ...quizRecords];
    const done = records.filter(Boolean).length;
    const earned = done === records.length && records.length > 0;
    return {
      id: `course-${course.slug}`,
      group: "courses",
      icon: "course",
      tone: course.meta.level,
      key: "course",
      values: { course: title(course) },
      earnedAt: earned
        ? latest([
            ...lessonRecords.flatMap((record) =>
              record ? [record.completedAt] : [],
            ),
            ...quizRecords.flatMap((record) =>
              record ? [record.createdAt] : [],
            ),
          ])
        : undefined,
      progress: { done, total: records.length },
    };
  });

  const pathBadges = courseBadges.filter(
    (_, index) => courses[index]?.meta.path !== undefined,
  );
  const path: Badge = {
    id: "path",
    group: "courses",
    icon: "path",
    tone: "gold",
    key: "path",
    values: { count: pathBadges.length },
    earnedAt:
      pathBadges.length > 0 && pathBadges.every((badge) => badge.earnedAt)
        ? latest(
            pathBadges.flatMap((badge) =>
              badge.earnedAt ? [badge.earnedAt] : [],
            ),
          )
        : undefined,
    progress: {
      done: pathBadges.filter((badge) => badge.earnedAt).length,
      total: pathBadges.length,
    },
  };

  const lessonBadges = LESSON_MILESTONES.filter(
    (count) => count <= lessonKeys.size,
  ).map((count): Badge => ({
    id: `lessons-${count}`,
    group: "lessons",
    icon: "lessons",
    tone: "green",
    key: count === 1 ? "firstLesson" : "lessons",
    values: { count },
    earnedAt: doneLessons[count - 1]?.completedAt,
    progress: { done: Math.min(doneLessons.length, count), total: count },
  }));

  const existingQuizzes = courses.flatMap((course) =>
    quizzesOf(course).flatMap((record) => (record ? [record] : [])),
  );
  const perfect = existingQuizzes.filter(
    (record) => record.best === record.total,
  );
  const perfectCourses = courses.flatMap((course) => {
    const records = quizzesOf(course);
    return records.length > 0 &&
      records.every((record) => record && record.best === record.total)
      ? [latest(records.flatMap((record) => (record ? [record.bestAt] : [])))]
      : [];
  });
  const bestCourseShare = Math.max(
    0,
    ...courses.map((course) => {
      const records = quizzesOf(course);
      return records.length > 0
        ? records.filter((record) => record && record.best === record.total)
            .length / records.length
        : 0;
    }),
  );
  const quizBadges: Badge[] = [
    {
      id: "quiz-first",
      group: "quizzes",
      icon: "quiz",
      tone: "blue",
      key: "firstQuiz",
      values: {},
      earnedAt: earliest(existingQuizzes.map((record) => record.createdAt)),
      progress: { done: Math.min(existingQuizzes.length, 1), total: 1 },
    },
    {
      id: "quiz-perfect",
      group: "quizzes",
      icon: "perfect",
      tone: "blue",
      key: "perfectQuiz",
      values: {},
      earnedAt: earliest(perfect.map((record) => record.bestAt)),
      progress: { done: Math.min(perfect.length, 1), total: 1 },
    },
    {
      id: "quiz-course-perfect",
      group: "quizzes",
      icon: "trophy",
      tone: "gold",
      key: "perfectCourse",
      values: {},
      earnedAt: earliest(
        perfectCourses.flatMap((date) => (date ? [date] : [])),
      ),
      // As a share of the course closest to it, in percent.
      progress: { done: Math.round(bestCourseShare * 100), total: 100 },
    },
  ];

  // The first lesson of each new day, in order.
  const firstOfDay: Date[] = [];
  const seenDays = new Set<string>();
  for (const record of doneLessons) {
    const day = dayFormat.format(record.completedAt);
    if (!seenDays.has(day)) {
      seenDays.add(day);
      firstOfDay.push(record.completedAt);
    }
  }
  const dayBadges = DAY_MILESTONES.map((count): Badge => ({
    id: `days-${count}`,
    group: "days",
    icon: "days",
    tone: "violet",
    key: "days",
    values: { count },
    earnedAt: firstOfDay[count - 1],
    progress: { done: Math.min(firstOfDay.length, count), total: count },
  }));

  return [...courseBadges, path, ...lessonBadges, ...quizBadges, ...dayBadges];
}
