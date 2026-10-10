"use server";

import {
  lessonDoneSchema,
  quizResultSchema,
  type LessonDoneInput,
  type QuizResultInput,
} from "@/lib/progress";
import { LOGIN_ENABLED } from "@/lib/features";

import {
  findLessonQuiz,
  hasQuizResult,
  quizLength,
  saveQuizAttempt,
  setLessonDone,
} from "../progress";
import { getSession } from "../session";

/*
 * Server Actions that change the user's progress. Each checks the input, the session and that the
 * lesson or quiz exists – the browser is never trusted.
 */

type Result =
  { ok: true } | { ok: false; error: "signedOut" | "invalid" | "quizFirst" };

export async function markLesson(input: LessonDoneInput): Promise<Result> {
  const parsed = lessonDoneSchema.safeParse(input);
  if (!LOGIN_ENABLED || !parsed.success) {
    return { ok: false, error: "invalid" };
  }
  const session = await getSession();
  if (!session) {
    return { ok: false, error: "signedOut" };
  }
  const { course, lesson, done } = parsed.data;
  const found = await findLessonQuiz(course, lesson);
  if (!found) {
    return { ok: false, error: "invalid" };
  }
  // A lesson that ends with a quiz is done only once the quiz was taken (any attempt counts).
  if (
    done &&
    found.quizModule &&
    !(await hasQuizResult(session.user.id, course, found.quizModule))
  ) {
    return { ok: false, error: "quizFirst" };
  }
  await setLessonDone(session.user.id, course, lesson, done);
  return { ok: true };
}

export async function saveQuizResult(input: QuizResultInput): Promise<Result> {
  const parsed = quizResultSchema.safeParse(input);
  if (!LOGIN_ENABLED || !parsed.success) {
    return { ok: false, error: "invalid" };
  }
  const session = await getSession();
  if (!session) {
    return { ok: false, error: "signedOut" };
  }
  const { course, module, correct, total } = parsed.data;
  // The quiz must exist and have exactly this many questions.
  if ((await quizLength(course, module)) !== total) {
    return { ok: false, error: "invalid" };
  }
  await saveQuizAttempt(session.user.id, course, module, correct, total);
  return { ok: true };
}
