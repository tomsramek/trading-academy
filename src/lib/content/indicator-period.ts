import type { ChartIndicators } from "./chart";
import {
  atrPercent,
  bollinger,
  cci,
  ema,
  mfi,
  rsi,
  sma,
  stochastic,
  williamsR,
  wma,
  type IndicatorPoint,
} from "./indicators";

/*
 * <IndicatorPeriod>: a chart with a slider for the indicator's period. The client recomputes the
 * line on every move and counts the signals it would give, so a shorter period visibly means more
 * signals – false ones included.
 */

export const PERIOD_INDICATORS = [
  "sma",
  "ema",
  "wma",
  "bollinger",
  "rsi",
  "stochastic",
  "williamsR",
  "cci",
  "mfi",
  "atr",
] as const;
export type PeriodIndicator = (typeof PERIOD_INDICATORS)[number];

// Names of the indicators as on Binance's chart menu.
export const INDICATOR_NAMES: Record<PeriodIndicator, string> = {
  sma: "SMA",
  ema: "EMA",
  wma: "WMA",
  bollinger: "BOLL",
  rsi: "RSI",
  stochastic: "Stochastic %K",
  williamsR: "Williams %R",
  cci: "CCI",
  mfi: "MFI",
  atr: "ATR",
};

// The common defaults (as in Binance's Trading View mode) – the slider marks them. Binance's
// Original mode differs for some: RSI 6/12/24, CCI 9.
export const DEFAULT_PERIODS: Record<PeriodIndicator, number> = {
  sma: 25,
  ema: 25,
  wma: 25,
  bollinger: 20,
  rsi: 14,
  stochastic: 14,
  williamsR: 14,
  cci: 20,
  mfi: 14,
  atr: 14,
};

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

const withVolume = (candles: Candle[]) =>
  candles.map((candle) => ({ ...candle, volume: candle.volume ?? 0 }));

// The indicator for one period, ready for <CandleChartCanvas>.
export function periodIndicator(
  indicator: PeriodIndicator,
  candles: Candle[],
  period: number,
): ChartIndicators {
  const overlay = (label: string, points: IndicatorPoint[]) => ({
    overlays: [
      {
        label,
        color: "--chart-1" as const,
        series: [
          { kind: "line" as const, color: "--chart-1" as const, points },
        ],
      },
    ],
    panels: [],
  });
  const panel = (
    label: string,
    points: IndicatorPoint[],
    guides: number[],
    format?: "percent",
  ): ChartIndicators => ({
    overlays: [],
    panels: [
      {
        label,
        guides,
        format,
        series: [{ kind: "line", color: "--chart-5", points }],
      },
    ],
  });

  switch (indicator) {
    case "sma":
      return overlay(`SMA ${period}`, sma(candles, period));
    case "ema":
      return overlay(`EMA ${period}`, ema(candles, period));
    case "wma":
      return overlay(`WMA ${period}`, wma(candles, period));
    case "bollinger": {
      const bands = bollinger(candles, period);
      return {
        overlays: [
          {
            label: `BOLL ${period}, 2`,
            color: "--chart-5",
            series: [
              { kind: "line", color: "--chart-5", points: bands.upper },
              {
                kind: "line",
                color: "--chart-5",
                dashed: true,
                points: bands.middle,
              },
              { kind: "line", color: "--chart-5", points: bands.lower },
            ],
          },
        ],
        panels: [],
      };
    }
    case "rsi":
      return panel(`RSI ${period}`, rsi(candles, period), [70, 30]);
    case "stochastic":
      return panel(
        `Stochastic %K ${period}`,
        stochastic(candles, period, 1, 3).k,
        [80, 20],
      );
    case "williamsR":
      return panel(
        `Williams %R ${period}`,
        williamsR(candles, period),
        [-20, -80],
      );
    case "cci":
      return panel(`CCI ${period}`, cci(candles, period), [100, -100]);
    case "mfi":
      return panel(`MFI ${period}`, mfi(withVolume(candles), period), [80, 20]);
    case "atr":
      return panel(`ATR ${period}`, atrPercent(candles, period), [], "percent");
  }
}

// How often a line crosses from one side of a level to the other.
function crossings(values: number[], level: number) {
  let count = 0;
  values.forEach((value, index) => {
    const previous = values[index - 1];
    if (previous !== undefined && (previous - level) * (value - level) < 0) {
      count++;
    }
  });
  return count;
}

// How often a line enters a zone (above `high` or below `low`) from outside it.
function entries(values: number[], high: number, low: number) {
  let count = 0;
  values.forEach((value, index) => {
    const previous = values[index - 1];
    if (previous === undefined) {
      return;
    }
    if (
      (value > high && previous <= high) ||
      (value < low && previous >= low)
    ) {
      count++;
    }
  });
  return count;
}

export type PeriodSignals =
  // Averages: how often the close crossed the line.
  | { kind: "crosses"; count: number }
  // Bollinger: how often the close left the bands.
  | { kind: "outside"; count: number }
  // Oscillators: how often the line entered an overbought or oversold zone.
  | { kind: "zones"; count: number }
  // ATR: the average daily range, in percent.
  | { kind: "range"; average: number };

/** The signals the indicator would give with this period – the number to compare across periods. */
export function periodSignals(
  indicator: PeriodIndicator,
  candles: Candle[],
  drawn: ChartIndicators,
): PeriodSignals {
  const first = (drawn.overlays[0] ?? drawn.panels[0])?.series ?? [];
  const values = (index: number) =>
    (first[index]?.points ?? []).map((point) => point.value);
  const closeAt = new Map(candles.map((candle) => [candle.time, candle.close]));

  switch (indicator) {
    case "sma":
    case "ema":
    case "wma": {
      // The close minus the average: it changes sign whenever the price crosses the line.
      const gaps = (first[0]?.points ?? []).map(
        (point) => (closeAt.get(point.time) ?? point.value) - point.value,
      );
      return { kind: "crosses", count: crossings(gaps, 0) };
    }
    case "bollinger": {
      const [upper = [], , lower = []] = first.map((series) => series.points);
      const lowerAt = new Map(lower.map((point) => [point.time, point.value]));
      // Above the upper band = above 1, below the lower band = below 0.
      const position = upper.map((point) => {
        const close = closeAt.get(point.time) ?? point.value;
        const bottom = lowerAt.get(point.time) ?? point.value;
        return point.value === bottom
          ? 0.5
          : (close - bottom) / (point.value - bottom);
      });
      return { kind: "outside", count: entries(position, 1, 0) };
    }
    case "rsi":
      return { kind: "zones", count: entries(values(0), 70, 30) };
    case "stochastic":
    case "mfi":
      return { kind: "zones", count: entries(values(0), 80, 20) };
    case "williamsR":
      return { kind: "zones", count: entries(values(0), -20, -80) };
    case "cci":
      return { kind: "zones", count: entries(values(0), 100, -100) };
    case "atr": {
      const all = values(0);
      const average =
        all.reduce((sum, value) => sum + value, 0) / Math.max(all.length, 1);
      return { kind: "range", average };
    }
  }
}
