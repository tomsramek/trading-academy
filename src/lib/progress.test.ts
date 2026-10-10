import { describe, expect, it } from "vitest";

import { lessonDoneSchema, quizResultSchema } from "./progress";

describe("progress inputs", () => {
  it("accepts content ids and rejects anything else", () => {
    expect(
      lessonDoneSchema.safeParse({
        course: "crypto-basics",
        lesson: "what-is-bitcoin",
        done: true,
      }).success,
    ).toBe(true);
    for (const bad of [
      "../etc",
      "Crypto Basics",
      "",
      "a".repeat(81),
      "x;drop",
    ]) {
      expect(
        lessonDoneSchema.safeParse({
          course: bad,
          lesson: "what-is-bitcoin",
          done: true,
        }).success,
        bad,
      ).toBe(false);
    }
  });

  it("keeps a quiz result within its questions", () => {
    const base = { course: "crypto-basics", module: "money-and-blockchain" };
    expect(
      quizResultSchema.safeParse({ ...base, correct: 5, total: 5 }).success,
    ).toBe(true);
    expect(
      quizResultSchema.safeParse({ ...base, correct: 6, total: 5 }).success,
    ).toBe(false);
    expect(
      quizResultSchema.safeParse({ ...base, correct: -1, total: 5 }).success,
    ).toBe(false);
    expect(
      quizResultSchema.safeParse({ ...base, correct: 1.5, total: 5 }).success,
    ).toBe(false);
    expect(
      quizResultSchema.safeParse({ ...base, correct: 0, total: 0 }).success,
    ).toBe(false);
  });
});
