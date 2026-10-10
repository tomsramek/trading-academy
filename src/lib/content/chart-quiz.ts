import { z } from "zod";

import { toTimestamp } from "./chart";
import type { ChartQuizData } from "./chart-quiz-answer";
import type { StepLine } from "./indicator-steps";
import {
  bollinger,
  ema,
  macd,
  rsi,
  sma,
  stochastic,
  type IndicatorPoint,
} from "./indicators";

/*
 * <ChartQuiz>: "click the candle where…". The chart, the indicators and the right answer are
 * prepared at build time; the page only checks the choice.
 */

const isoDate = z.iso.date();
const period = z.int().min(2).max(200);

export const chartQuizSchema = z.strictObject({
  question: z.string().trim().min(1),
  // The right candle, or the first and last of several right candles.
  answer: z.union([isoDate, z.tuple([isoDate, isoDate])]),
  explanation: z.string().trim().min(1),
  // The first candle shown and how many – few enough to tell them apart on a phone.
  from: isoDate,
  candles: z.int().min(8).max(48).default(30),
  // What is drawn with the candles; values count the history before `from` too.
  indicators: z
    .strictObject({
      sma: z.array(period).max(2).default([]),
      ema: z.array(period).max(2).default([]),
      bollinger: z.boolean().default(false),
      // One panel under the chart at most.
      panel: z.enum(["rsi", "macd", "stochastic"]).optional(),
    })
    .default({ sma: [], ema: [], bollinger: false }),
  label: z.string().trim().min(1),
});
export type ChartQuizInput = z.input<typeof chartQuizSchema>;

type Candle = ChartQuizData["candles"][number];

const AVERAGE_COLORS = ["--chart-1", "--chart-3"] as const;

function align(points: IndicatorPoint[], shown: Candle[]) {
  const byTime = new Map(points.map((point) => [point.time, point.value]));
  return shown.map((candle) => byTime.get(candle.time) ?? null);
}

/** Prepares the quiz chart. Throws with the label when a date is not among the shown candles. */
export function buildChartQuiz(
  input: ChartQuizInput,
  all: Candle[],
): ChartQuizData {
  const props = chartQuizSchema.parse(input);
  const fail = (message: string) =>
    new Error(`Invalid <ChartQuiz label="${props.label}">: ${message}`);

  const start = all.findIndex(
    (candle) => candle.time === toTimestamp(props.from),
  );
  if (start < 0) {
    throw fail(`${props.from} is not in the chart data`);
  }
  const end = start + props.candles;
  if (end > all.length) {
    throw fail(`only ${all.length - start} candles after ${props.from}`);
  }
  const history = all.slice(0, end);
  const shown = all.slice(start, end);

  const [first, last] =
    typeof props.answer === "string"
      ? [props.answer, props.answer]
      : props.answer;
  const indexOf = (date: string) => {
    const index = shown.findIndex(
      (candle) => candle.time === toTimestamp(date),
    );
    if (index < 0) {
      throw fail(`the answer ${date} is not among the shown candles`);
    }
    return index;
  };
  const answer: [number, number] = [indexOf(first), indexOf(last)];
  if (answer[0] > answer[1]) {
    throw fail("the answer range must go forward in time");
  }

  const { indicators } = props;
  const averages = [
    ...indicators.sma.map((length) => sma(history, length)),
    ...indicators.ema.map((length) => ema(history, length)),
  ];
  if (averages.length > 2) {
    throw fail("at most two averages");
  }
  const overlay: StepLine[] = averages.map((points, index) => ({
    color: AVERAGE_COLORS[index] ?? "--chart-1",
    values: align(points, shown),
  }));
  if (indicators.bollinger) {
    const bands = bollinger(history);
    overlay.push(
      { color: "--chart-5", values: align(bands.upper, shown) },
      { color: "--chart-5", dashed: true, values: align(bands.middle, shown) },
      { color: "--chart-5", values: align(bands.lower, shown) },
    );
  }

  const panels = {
    rsi: () => ({
      lines: [
        { color: "--chart-5" as const, values: align(rsi(history), shown) },
      ],
      guides: [70, 30],
    }),
    macd: () => {
      const values = macd(history);
      return {
        lines: [
          { color: "--chart-1" as const, values: align(values.macd, shown) },
          { color: "--chart-3" as const, values: align(values.signal, shown) },
        ],
        bars: align(values.histogram, shown),
        guides: [0],
      };
    },
    stochastic: () => {
      const values = stochastic(history);
      return {
        lines: [
          { color: "--chart-1" as const, values: align(values.k, shown) },
          { color: "--chart-3" as const, values: align(values.d, shown) },
        ],
        guides: [80, 20],
      };
    },
  };

  return {
    candles: shown,
    overlay,
    panel: indicators.panel ? panels[indicators.panel]() : undefined,
    answer,
  };
}

// The browser imports these from chart-quiz-answer (no zod there); re-exported for the build code and tests.
export { isCorrect, type ChartQuizData } from "./chart-quiz-answer";
