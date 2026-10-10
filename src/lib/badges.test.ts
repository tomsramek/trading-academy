import { describe, expect, it } from "vitest";

import type { Course } from "@/server/content";

import { computeBadges, type LessonRecord, type QuizRecord } from "./badges";

const lesson = (slug: string) =>
  ({ slug }) as Course["modules"][number]["lessons"][number];
const course = (slug: string, path?: number) =>
  ({
    slug,
    meta: { level: "beginner", path },
    modules: [
      {
        slug: "m1",
        lessons: [lesson("a"), lesson("b")],
        quiz: { questions: [] },
      },
      { slug: "m2", lessons: [lesson("c")] },
    ],
  }) as unknown as Course;

const courses = [course("one", 1), course("two")];
const at = (iso: string) => new Date(iso);
const done = (courseSlug: string, slug: string, iso: string): LessonRecord => ({
  course: courseSlug,
  lesson: slug,
  completedAt: at(iso),
});
const quiz = (courseSlug: string, best: number, iso: string): QuizRecord => ({
  course: courseSlug,
  module: "m1",
  total: 5,
  best,
  bestAt: at(iso),
  createdAt: at(iso),
});

function badge(
  id: string,
  lessons: LessonRecord[],
  quizzes: QuizRecord[] = [],
) {
  const found = computeBadges(
    courses,
    lessons,
    quizzes,
    (item) => item.slug,
  ).find((item) => item.id === id);
  if (!found) {
    throw new Error(`no badge ${id}`);
  }
  return found;
}

describe("computeBadges", () => {
  it("earns a course badge with every lesson and quiz, dated by the last of them", () => {
    const lessons = [
      done("one", "a", "2026-10-01T10:00:00Z"),
      done("one", "b", "2026-10-02T10:00:00Z"),
      done("one", "c", "2026-10-04T10:00:00Z"),
    ];
    expect(badge("course-one", lessons).earnedAt).toBeUndefined();
    expect(badge("course-one", lessons).progress).toEqual({
      done: 3,
      total: 4,
    });
    const withQuiz = badge("course-one", lessons, [
      quiz("one", 2, "2026-10-03T10:00:00Z"),
    ]);
    expect(withQuiz.earnedAt).toEqual(at("2026-10-04T10:00:00Z"));
  });

  it("earns the path badge only when every path course is finished", () => {
    const allOne = [
      done("one", "a", "2026-10-01T10:00:00Z"),
      done("one", "b", "2026-10-01T11:00:00Z"),
      done("one", "c", "2026-10-01T12:00:00Z"),
    ];
    // Course "two" is an elective – it does not count.
    expect(
      badge("path", allOne, [quiz("one", 1, "2026-10-01T13:00:00Z")]).earnedAt,
    ).toEqual(at("2026-10-01T13:00:00Z"));
  });

  it("dates lesson milestones by the lesson that reached them and ignores removed lessons", () => {
    const lessons = [
      done("one", "gone", "2026-09-30T10:00:00Z"),
      done("one", "b", "2026-10-02T10:00:00Z"),
      done("one", "a", "2026-10-01T10:00:00Z"),
    ];
    expect(badge("lessons-1", lessons).earnedAt).toEqual(
      at("2026-10-01T10:00:00Z"),
    );
  });

  it("knows the first quiz, the first perfect quiz and a course with every quiz perfect", () => {
    const quizzes = [
      quiz("one", 3, "2026-10-01T10:00:00Z"),
      quiz("two", 5, "2026-10-05T10:00:00Z"),
    ];
    expect(badge("quiz-first", [], quizzes).earnedAt).toEqual(
      at("2026-10-01T10:00:00Z"),
    );
    expect(badge("quiz-perfect", [], quizzes).earnedAt).toEqual(
      at("2026-10-05T10:00:00Z"),
    );
    expect(badge("quiz-course-perfect", [], quizzes).earnedAt).toEqual(
      at("2026-10-05T10:00:00Z"),
    );
  });

  it("counts different days in Prague time", () => {
    const lessons = [
      // 23:30 and 00:30 Prague time (UTC+2 in October) – two days.
      done("one", "a", "2026-10-01T21:30:00Z"),
      done("one", "b", "2026-10-01T22:30:00Z"),
      done("one", "c", "2026-10-03T08:00:00Z"),
    ];
    const three = badge("days-3", lessons);
    expect(three.earnedAt).toEqual(at("2026-10-03T08:00:00Z"));
    expect(badge("days-7", lessons).progress).toEqual({ done: 3, total: 7 });
  });
});
