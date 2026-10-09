import { z } from "zod";

import type { ChartToken } from "./chart";
import {
  atrPercent,
  bollinger,
  ema,
  macd,
  obv,
  rsi,
  sma,
  stochastic,
  type IndicatorPoint,
} from "./indicators";

/*
 * <IndicatorSteps>: how an indicator is computed, one candle at a time. The server computes every
 * step from the chart data; the client only moves between them.
 */

export const STEP_INDICATORS = [
  "sma",
  "ema",
  "bollinger",
  "rsi",
  "macd",
  "stochastic",
  "atr",
  "obv",
] as const;
export type StepIndicator = (typeof STEP_INDICATORS)[number];

// Indicators whose value comes from a window of the last `period` candles.
const WINDOWED: readonly StepIndicator[] = ["sma", "bollinger", "stochastic"];

// Binance's defaults; MACD has its fixed 12, 26, 9.
const DEFAULT_PERIODS: Record<StepIndicator, number> = {
  sma: 7,
  ema: 7,
  bollinger: 20,
  rsi: 14,
  macd: 12,
  stochastic: 14,
  atr: 14,
  obv: 1,
};

export const indicatorStepsSchema = z.strictObject({
  indicator: z.enum(STEP_INDICATORS),
  period: z.int().min(2).max(50).optional(),
  // The first candle shown, "2024-03-01"; the history before it still counts in the values.
  from: z.iso.date().optional(),
  // How many candles are shown – few enough to tell them apart on a phone. By default 24 steps
  // plus the candles the first window needs.
  candles: z.int().min(8).max(48).optional(),
  label: z.string().trim().min(1),
});
export type IndicatorStepsInput = z.input<typeof indicatorStepsSchema>;

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

// A line drawn over the candles or in the panel, one value per shown candle (null = no value yet).
export type StepLine = {
  color: ChartToken;
  dashed?: boolean;
  values: (number | null)[];
};

export type Step = {
  // The shown candle whose value this step computes.
  candle: number;
  // The shown candles the value is computed from.
  window: [number, number];
  // Which explanation fits: the first value is computed differently from the next ones.
  variant: "first" | "next" | "up" | "down" | "flat";
  // The numbers of the explanation, e.g. { sum, value }.
  values: Record<string, number>;
  // Horizontal lines over the window, e.g. the highest high and lowest low of the stochastic.
  levels?: { price: number; kind: "high" | "low" }[];
};

export type IndicatorStepsData = {
  indicator: StepIndicator;
  period: number;
  candles: Candle[];
  overlay: StepLine[];
  panel?: {
    lines: StepLine[];
    // MACD histogram; positive bars green, negative red.
    bars?: (number | null)[];
    guides: number[];
  };
  steps: Step[];
};

// Values of a computed indicator aligned to the shown candles.
function align(points: IndicatorPoint[], shown: Candle[]): (number | null)[] {
  const byTime = new Map(points.map((point) => [point.time, point.value]));
  return shown.map((candle) => byTime.get(candle.time) ?? null);
}

/**
 * Computes the shown candles, the lines and every step of the explanation.
 * Throws with the chart label when `from` is not in the data or there are too few candles.
 */
export function buildIndicatorSteps(
  input: IndicatorStepsInput,
  all: Candle[],
): IndicatorStepsData {
  const data = computeSteps(input, all);
  // A step whose window starts before the chart would highlight only part of it.
  const steps = data.steps.filter((step) => step.window[0] >= 0);
  if (steps.length === 0) {
    throw new Error(
      `Invalid <IndicatorSteps label="${input.label}">: no step fits in the chart – show more candles`,
    );
  }
  return { ...data, steps };
}

function computeSteps(
  input: IndicatorStepsInput,
  all: Candle[],
): IndicatorStepsData {
  const parsed = indicatorStepsSchema.parse(input);
  const { indicator } = parsed;
  const period = parsed.period ?? DEFAULT_PERIODS[indicator];
  const start = parsed.from
    ? all.findIndex(
        (candle) =>
          candle.time === Date.parse(`${parsed.from}T00:00:00Z`) / 1000,
      )
    : 0;
  if (start < 0) {
    throw new Error(
      `Invalid <IndicatorSteps label="${parsed.label}">: ${parsed.from} is not in the chart data`,
    );
  }
  // Indicators computed from a window of candles show the whole first window before the first step.
  const leadIn = WINDOWED.includes(indicator) ? period - 1 : 0;
  const end = start + (parsed.candles ?? 24 + leadIn);
  if (end > all.length) {
    throw new Error(
      `Invalid <IndicatorSteps label="${parsed.label}">: only ${all.length - start} candles after ${parsed.from ?? "the start"}`,
    );
  }
  // History up to the last shown candle – the values match a real chart, nothing from the future.
  const history = all.slice(0, end);
  const shown = all.slice(start, end);
  // Index in `history` of the shown candle `index`.
  const at = (index: number) => start + index;
  const windowOf = (index: number, size: number): [number, number] => [
    index - size + 1,
    index,
  ];
  const valueAt = (points: IndicatorPoint[], index: number) =>
    points.find((point) => point.time === history[at(index)]?.time)?.value;
  const shownIndexes = shown.map((_, index) => index);

  const base = { indicator, period, candles: shown };

  switch (indicator) {
    case "sma": {
      const line = sma(history, period);
      return {
        ...base,
        overlay: [{ color: "--chart-1", values: align(line, shown) }],
        steps: shownIndexes.flatMap((index) => {
          const value = valueAt(line, index);
          if (value === undefined) {
            return [];
          }
          return [
            {
              candle: index,
              window: windowOf(index, period),
              variant: "next" as const,
              values: { sum: value * period, value },
            },
          ];
        }),
      };
    }

    case "ema": {
      const line = ema(history, period);
      const firstTime = line[0]?.time;
      return {
        ...base,
        overlay: [{ color: "--chart-3", values: align(line, shown) }],
        steps: shownIndexes.flatMap((index) => {
          const value = valueAt(line, index);
          const close = shown[index]?.close;
          if (value === undefined || close === undefined) {
            return [];
          }
          const isFirst = shown[index]?.time === firstTime;
          // The candle before can be outside the chart – valueAt reads the history too.
          const previous = isFirst
            ? value
            : (valueAt(line, index - 1) ?? value);
          return [
            {
              candle: index,
              window: isFirst ? windowOf(index, period) : windowOf(index, 1),
              variant: isFirst ? ("first" as const) : ("next" as const),
              values: {
                value,
                previous,
                close,
                weight: 2 / (period + 1),
              },
            },
          ];
        }),
      };
    }

    case "bollinger": {
      const bands = bollinger(history, period);
      return {
        ...base,
        overlay: [
          { color: "--chart-5", values: align(bands.upper, shown) },
          {
            color: "--chart-5",
            dashed: true,
            values: align(bands.middle, shown),
          },
          { color: "--chart-5", values: align(bands.lower, shown) },
        ],
        steps: shownIndexes.flatMap((index) => {
          const middle = valueAt(bands.middle, index);
          const upper = valueAt(bands.upper, index);
          const lower = valueAt(bands.lower, index);
          if (
            middle === undefined ||
            upper === undefined ||
            lower === undefined
          ) {
            return [];
          }
          return [
            {
              candle: index,
              window: windowOf(index, period),
              variant: "next" as const,
              values: { middle, deviation: (upper - middle) / 2, upper, lower },
            },
          ];
        }),
      };
    }

    case "rsi": {
      const line = rsi(history, period);
      // The averages behind each RSI value, the same way rsi() computes them.
      const averages = wilderAverages(history, period);
      return {
        ...base,
        overlay: [],
        panel: {
          lines: [{ color: "--chart-5", values: align(line, shown) }],
          guides: [70, 30],
        },
        steps: shownIndexes.flatMap((index) => {
          const value = valueAt(line, index);
          const average = averages[at(index)];
          const close = shown[index]?.close;
          const previousClose = history[at(index) - 1]?.close;
          if (
            value === undefined ||
            !average ||
            close === undefined ||
            previousClose === undefined
          ) {
            return [];
          }
          const isFirst = at(index) === period;
          return [
            {
              candle: index,
              window: isFirst
                ? windowOf(index, period + 1)
                : windowOf(index, 2),
              variant: isFirst ? ("first" as const) : ("next" as const),
              values: {
                change: close - previousClose,
                gain: average.gain,
                loss: average.loss,
                strength: average.loss === 0 ? 0 : average.gain / average.loss,
                value,
              },
            },
          ];
        }),
      };
    }

    case "macd": {
      const fast = ema(history, 12);
      const slow = ema(history, 26);
      const result = macd(history);
      return {
        ...base,
        period: 12,
        overlay: [
          { color: "--chart-1", values: align(fast, shown) },
          { color: "--chart-3", values: align(slow, shown) },
        ],
        panel: {
          lines: [
            { color: "--chart-1", values: align(result.macd, shown) },
            { color: "--chart-3", values: align(result.signal, shown) },
          ],
          bars: align(result.histogram, shown),
          guides: [0],
        },
        steps: shownIndexes.flatMap((index) => {
          const fastValue = valueAt(fast, index);
          const slowValue = valueAt(slow, index);
          const signal = valueAt(result.signal, index);
          if (
            fastValue === undefined ||
            slowValue === undefined ||
            signal === undefined
          ) {
            return [];
          }
          const line = fastValue - slowValue;
          return [
            {
              candle: index,
              window: windowOf(index, 1),
              variant: "next" as const,
              values: {
                fast: fastValue,
                slow: slowValue,
                macd: line,
                signal,
                histogram: line - signal,
              },
            },
          ];
        }),
      };
    }

    case "stochastic": {
      const { k } = stochastic(history, period, 1, 3);
      return {
        ...base,
        overlay: [],
        panel: {
          lines: [{ color: "--chart-1", values: align(k, shown) }],
          guides: [80, 20],
        },
        steps: shownIndexes.flatMap((index) => {
          const value = valueAt(k, index);
          const close = shown[index]?.close;
          if (value === undefined || close === undefined) {
            return [];
          }
          const window = history.slice(at(index) - period + 1, at(index) + 1);
          const high = Math.max(...window.map((candle) => candle.high));
          const low = Math.min(...window.map((candle) => candle.low));
          return [
            {
              candle: index,
              window: windowOf(index, period),
              variant: "next" as const,
              values: { high, low, close, value },
              levels: [
                { price: high, kind: "high" as const },
                { price: low, kind: "low" as const },
              ],
            },
          ];
        }),
      };
    }

    case "atr": {
      // In price units here – the lesson computes it by hand; the percentage comes later.
      const percent = atrPercent(history, period);
      const line = percent.map((point) => ({
        time: point.time,
        value:
          (point.value / 100) *
          (history.find((candle) => candle.time === point.time)?.close ?? 0),
      }));
      return {
        ...base,
        overlay: [],
        panel: {
          lines: [{ color: "--chart-2", values: align(line, shown) }],
          guides: [],
        },
        steps: shownIndexes.flatMap((index) => {
          const value = valueAt(line, index);
          const candle = shown[index];
          const previousClose = history[at(index) - 1]?.close;
          if (value === undefined || !candle || previousClose === undefined) {
            return [];
          }
          const isFirst = at(index) === period - 1;
          const range = candle.high - candle.low;
          const upGap = Math.abs(candle.high - previousClose);
          const downGap = Math.abs(candle.low - previousClose);
          const previous = valueAt(line, index - 1) ?? value;
          return [
            {
              candle: index,
              window: isFirst ? windowOf(index, period) : windowOf(index, 2),
              variant: isFirst ? ("first" as const) : ("next" as const),
              values: {
                range,
                upGap,
                downGap,
                trueRange: Math.max(range, upGap, downGap),
                previous,
                value,
              },
            },
          ];
        }),
      };
    }

    case "obv": {
      const withVolume = history.map((candle) => {
        if (candle.volume === undefined) {
          throw new Error(
            `Invalid <IndicatorSteps label="${parsed.label}">: OBV needs data with volume`,
          );
        }
        return { ...candle, volume: candle.volume };
      });
      const line = obv(withVolume);
      return {
        ...base,
        period: 1,
        overlay: [],
        panel: {
          lines: [{ color: "--chart-1", values: align(line, shown) }],
          guides: [],
        },
        steps: shownIndexes.flatMap((index) => {
          const value = valueAt(line, index);
          const candle = withVolume[at(index)];
          const previous = withVolume[at(index) - 1];
          if (value === undefined || !candle || !previous) {
            return [];
          }
          const variant =
            candle.close > previous.close
              ? ("up" as const)
              : candle.close < previous.close
                ? ("down" as const)
                : ("flat" as const);
          return [
            {
              candle: index,
              window: windowOf(index, 2),
              variant,
              values: {
                close: candle.close,
                previousClose: previous.close,
                volume: candle.volume,
                previous: valueAt(line, index - 1) ?? 0,
                value,
              },
            },
          ];
        }),
      };
    }
  }
}

// Wilder's average gain and loss for every candle from `period` on – the inside of RSI.
function wilderAverages(candles: Candle[], period: number) {
  const result: ({ gain: number; loss: number } | undefined)[] = [];
  let gain = 0;
  let loss = 0;
  candles.forEach((candle, index) => {
    const previous = candles[index - 1];
    if (!previous) {
      result.push(undefined);
      return;
    }
    const change = candle.close - previous.close;
    const up = Math.max(change, 0);
    const down = Math.max(-change, 0);
    if (index <= period) {
      gain += up / period;
      loss += down / period;
    } else {
      gain = (gain * (period - 1) + up) / period;
      loss = (loss * (period - 1) + down) / period;
    }
    result.push(index >= period ? { gain, loss } : undefined);
  });
  return result;
}
