import { describe, expect, it } from "vitest";

import type { Course } from "@/server/content";

import { summarizeCourse, totalProgress } from "./progress-summary";

// A minimal course: two modules, the first ends with a quiz.
const lesson = (slug: string) =>
  ({ slug }) as Course["modules"][number]["lessons"][number];
const course = {
  slug: "basics",
  modules: [
    {
      slug: "m1",
      lessons: [lesson("a"), lesson("b")],
      quiz: { questions: [] },
    },
    { slug: "m2", lessons: [lesson("c")] },
  ],
} as unknown as Course;

const empty = { lessons: {}, quizzes: {} };

describe("summarizeCourse", () => {
  it("is not started without any progress", () => {
    const summary = summarizeCourse(course, empty);
    expect(summary.state).toBe("notStarted");
    expect(summary.next?.slug).toBe("a");
    expect(summary.gaps).toHaveLength(2);
  });

  it("lists what is missing and where to continue", () => {
    const summary = summarizeCourse(course, {
      lessons: { basics: ["a"] },
      quizzes: {},
    });
    expect(summary.state).toBe("started");
    expect(summary.lessons).toEqual({ done: 1, total: 3 });
    expect(summary.quizzes).toEqual({ done: 0, total: 1 });
    expect(summary.next?.slug).toBe("b");
    expect(
      summary.gaps.map((gap) => gap.missingLessons.map((item) => item.slug)),
    ).toEqual([["b"], ["c"]]);
  });

  it("is finished only with every lesson and quiz", () => {
    const lessonsOnly = summarizeCourse(course, {
      lessons: { basics: ["a", "b", "c"] },
      quizzes: {},
    });
    expect(lessonsOnly.state).toBe("started");
    expect(lessonsOnly.gaps).toHaveLength(1);
    expect(lessonsOnly.gaps[0]?.missingLessons).toEqual([]);

    const all = summarizeCourse(course, {
      lessons: { basics: ["a", "b", "c"] },
      quizzes: { basics: { m1: { best: 3, last: 2, total: 5, attempts: 2 } } },
    });
    expect(all.state).toBe("finished");
    expect(all.next).toBeUndefined();
  });

  it("ignores progress of lessons that no longer exist", () => {
    const summary = summarizeCourse(course, {
      lessons: { basics: ["gone", "a"] },
      quizzes: {},
    });
    expect(summary.lessons.done).toBe(1);
  });
});

describe("totalProgress", () => {
  it("adds up lessons, quizzes and finished courses", () => {
    const totals = totalProgress([
      summarizeCourse(course, empty),
      summarizeCourse(course, {
        lessons: { basics: ["a", "b", "c"] },
        quizzes: {
          basics: { m1: { best: 5, last: 5, total: 5, attempts: 1 } },
        },
      }),
    ]);
    expect(totals).toEqual({
      lessons: { done: 3, total: 6 },
      quizzes: { done: 1, total: 2 },
      courses: { done: 1, total: 2 },
    });
  });
});
