import type { Course, Lesson, Module } from "@/server/content";

import type { Progress, QuizResult } from "./progress";

/*
 * What a user has done and what is missing, per course and in total – for the account page.
 * Pure: courses come from content/, progress from the database.
 */

export type ModuleGap = {
  module: Module;
  // Lessons of the module not done yet, in order.
  missingLessons: Lesson[];
  // undefined = the module has no quiz.
  quiz?: { result?: QuizResult };
};

export type CourseSummaryState = "notStarted" | "started" | "finished";

export type CourseProgressSummary = {
  course: Course;
  state: CourseSummaryState;
  lessons: { done: number; total: number };
  quizzes: { done: number; total: number };
  // The first lesson not done yet – where "Continue" goes.
  next?: Lesson;
  // Only modules where something is missing.
  gaps: ModuleGap[];
};

export type ProgressTotals = {
  lessons: { done: number; total: number };
  quizzes: { done: number; total: number };
  courses: { done: number; total: number };
};

export function summarizeCourse(
  course: Course,
  progress: Progress,
): CourseProgressSummary {
  const doneLessons = new Set(progress.lessons[course.slug] ?? []);
  const quizResults = progress.quizzes[course.slug] ?? {};
  const allLessons = course.modules.flatMap((module) => module.lessons);
  const quizModules = course.modules.filter((module) => module.quiz);

  const gaps = course.modules.flatMap((module): ModuleGap[] => {
    const missingLessons = module.lessons.filter(
      (lesson) => !doneLessons.has(lesson.slug),
    );
    const quiz = module.quiz ? { result: quizResults[module.slug] } : undefined;
    return missingLessons.length > 0 || (quiz && !quiz.result)
      ? [{ module, missingLessons, quiz }]
      : [];
  });

  const lessons = {
    done: allLessons.filter((lesson) => doneLessons.has(lesson.slug)).length,
    total: allLessons.length,
  };
  const quizzes = {
    done: quizModules.filter((module) => quizResults[module.slug]).length,
    total: quizModules.length,
  };
  const state: CourseSummaryState =
    lessons.done === 0 && quizzes.done === 0
      ? "notStarted"
      : gaps.length === 0
        ? "finished"
        : "started";

  return {
    course,
    state,
    lessons,
    quizzes,
    next: allLessons.find((lesson) => !doneLessons.has(lesson.slug)),
    gaps,
  };
}

export function totalProgress(
  summaries: CourseProgressSummary[],
): ProgressTotals {
  const sum = (
    pick: (summary: CourseProgressSummary) => { done: number; total: number },
  ) =>
    summaries.reduce(
      (total, summary) => ({
        done: total.done + pick(summary).done,
        total: total.total + pick(summary).total,
      }),
      { done: 0, total: 0 },
    );
  return {
    lessons: sum((summary) => summary.lessons),
    quizzes: sum((summary) => summary.quizzes),
    courses: {
      done: summaries.filter((summary) => summary.state === "finished").length,
      total: summaries.length,
    },
  };
}
