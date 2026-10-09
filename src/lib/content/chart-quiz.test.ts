import { describe, expect, it } from "vitest";

import btc from "@content/market-data/btcusdt-1d-2023-10-2024-12.json";

import { buildChartQuiz, isCorrect, type ChartQuizInput } from "./chart-quiz";

const base: ChartQuizInput = {
  question: "Where?",
  answer: "2024-03-05",
  explanation: "Because.",
  from: "2024-03-01",
  label: "test quiz",
};

describe("buildChartQuiz", () => {
  it("finds the answer among the shown candles", () => {
    const quiz = buildChartQuiz(base, btc.candles);
    expect(quiz.candles).toHaveLength(30);
    expect(quiz.answer).toEqual([4, 4]);
  });

  it("accepts a range of right candles", () => {
    const quiz = buildChartQuiz(
      { ...base, answer: ["2024-03-05", "2024-03-07"] },
      btc.candles,
    );
    expect(quiz.answer).toEqual([4, 6]);
    expect(isCorrect(5, quiz.answer)).toBe(true);
    expect(isCorrect(7, quiz.answer)).toBe(false);
  });

  it("draws the chosen indicators with values from the history before the chart", () => {
    const quiz = buildChartQuiz(
      { ...base, indicators: { sma: [7], panel: "rsi" } },
      btc.candles,
    );
    expect(quiz.overlay[0]?.values[0]).not.toBeNull();
    expect(quiz.panel?.guides).toEqual([70, 30]);
    expect(quiz.panel?.lines[0]?.values.every((value) => value !== null)).toBe(
      true,
    );
  });

  it("stops the build when the answer is not shown", () => {
    expect(() =>
      buildChartQuiz({ ...base, answer: "2024-06-01" }, btc.candles),
    ).toThrow(/test quiz.*2024-06-01/);
  });

  it("stops the build with more than two averages", () => {
    expect(() =>
      buildChartQuiz(
        { ...base, indicators: { sma: [7, 25], ema: [9] } },
        btc.candles,
      ),
    ).toThrow(/at most two averages/);
  });
});
