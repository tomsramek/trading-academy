import "server-only";

import { and, eq, sql } from "drizzle-orm";

import type { Progress } from "@/lib/progress";

import { getCourses } from "./content";
import { db } from "./db";
import { lessonProgress, quizResults } from "./db/schema";

/** Everything the user has done – done lessons and quiz results. */
export async function getProgress(userId: string): Promise<Progress> {
  const [lessons, quizzes] = await Promise.all([
    db()
      .select({ course: lessonProgress.course, lesson: lessonProgress.lesson })
      .from(lessonProgress)
      .where(eq(lessonProgress.userId, userId)),
    db().select().from(quizResults).where(eq(quizResults.userId, userId)),
  ]);
  const progress: Progress = { lessons: {}, quizzes: {} };
  for (const row of lessons) {
    (progress.lessons[row.course] ??= []).push(row.lesson);
  }
  for (const row of quizzes) {
    (progress.quizzes[row.course] ??= {})[row.module] = {
      best: row.bestCorrect,
      last: row.lastCorrect,
      total: row.total,
      attempts: row.attempts,
    };
  }
  return progress;
}

/**
 * Where a lesson is: undefined when the course has no such lesson, otherwise the module whose quiz
 * the lesson ends with (only the last lesson of a module with a quiz).
 */
export async function findLessonQuiz(course: string, lesson: string) {
  const found = (await getCourses()).find((item) => item.slug === course);
  for (const courseModule of found?.modules ?? []) {
    if (courseModule.lessons.some((item) => item.slug === lesson)) {
      const endsWithQuiz =
        courseModule.quiz !== undefined &&
        courseModule.lessons.at(-1)?.slug === lesson;
      return { quizModule: endsWithQuiz ? courseModule.slug : undefined };
    }
  }
  return undefined;
}

/** True when the user has a saved result of the module's quiz. */
export async function hasQuizResult(
  userId: string,
  course: string,
  module: string,
) {
  const rows = await db()
    .select({ attempts: quizResults.attempts })
    .from(quizResults)
    .where(
      and(
        eq(quizResults.userId, userId),
        eq(quizResults.course, course),
        eq(quizResults.module, module),
      ),
    )
    .limit(1);
  return rows.length > 0;
}

/** The number of questions of the module's quiz, or undefined when there is no such quiz. */
export async function quizLength(course: string, module: string) {
  const found = (await getCourses()).find((item) => item.slug === course);
  return found?.modules.find((item) => item.slug === module)?.quiz?.questions
    .length;
}

export async function setLessonDone(
  userId: string,
  course: string,
  lesson: string,
  done: boolean,
) {
  if (done) {
    await db()
      .insert(lessonProgress)
      .values({ userId, course, lesson })
      .onConflictDoNothing();
  } else {
    await db()
      .delete(lessonProgress)
      .where(
        and(
          eq(lessonProgress.userId, userId),
          eq(lessonProgress.course, course),
          eq(lessonProgress.lesson, lesson),
        ),
      );
  }
}

/** Saves an attempt: the last result always, the best one only when it improved. */
export async function saveQuizAttempt(
  userId: string,
  course: string,
  module: string,
  correct: number,
  total: number,
) {
  await db()
    .insert(quizResults)
    .values({
      userId,
      course,
      module,
      total,
      bestCorrect: correct,
      lastCorrect: correct,
    })
    .onConflictDoUpdate({
      target: [quizResults.userId, quizResults.course, quizResults.module],
      set: {
        total,
        lastCorrect: correct,
        bestCorrect: sql`greatest(${quizResults.bestCorrect}, ${correct})`,
        attempts: sql`${quizResults.attempts} + 1`,
        updatedAt: new Date(),
      },
    });
}
