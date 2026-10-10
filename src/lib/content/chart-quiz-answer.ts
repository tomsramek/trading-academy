import type { StepLine } from "./indicator-steps";

/*
 * The part of <ChartQuiz> that runs in the browser: the prepared chart and the answer check. Kept apart
 * from chart-quiz.ts, whose zod schema would otherwise be sent to every lesson.
 */

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type ChartQuizData = {
  candles: Candle[];
  overlay: StepLine[];
  panel?: { lines: StepLine[]; bars?: (number | null)[]; guides: number[] };
  // Indexes of the first and last right candle among the shown ones.
  answer: [number, number];
};

export function isCorrect(choice: number, answer: [number, number]) {
  return choice >= answer[0] && choice <= answer[1];
}
