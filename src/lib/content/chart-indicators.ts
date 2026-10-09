import { z } from "zod";

import type {
  ChartIndicators,
  ChartSeries,
  ChartToken,
  IndicatorsInput,
  PanelIndicator,
} from "./chart";
import { PANEL_INDICATORS, indicatorsSchema } from "./chart";
import {
  atrPercent,
  bollinger,
  cci,
  ema,
  kdj,
  macd,
  mfi,
  obv,
  parabolicSar,
  rsi,
  sma,
  stochastic,
  stochRsi,
  supertrend,
  vwap,
  williamsR,
  wma,
  type IndicatorPoint,
  type TrendPoint,
} from "./indicators";

type ChartCandle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

// Indicators named in the legend by a translated text; average lines are named by their period.
export type LegendKey =
  "bollinger" | "vwap" | "sar" | "supertrend" | PanelIndicator;

const AVERAGE_COLORS = ["--chart-1", "--chart-3", "--chart-5"] as const;

const line = (
  color: ChartToken,
  points: ChartSeries["points"],
  dashed = false,
): ChartSeries => ({ kind: "line", color, dashed, points });

// Up and down bars in the candle colors.
const histogram = (
  points: IndicatorPoint[],
  up: (point: IndicatorPoint, index: number) => boolean,
): ChartSeries => ({
  kind: "histogram",
  color: "--bull",
  points: points.map((point, index) => ({
    ...point,
    color: up(point, index) ? "--bull" : "--bear",
  })),
});

// A trend line in two colors, without the jump where the trend flips – as on Binance.
function trendLine(points: TrendPoint[]): ChartSeries {
  return line(
    "--bull",
    points.map((point, index) => ({
      time: point.time,
      value: point.value,
      color: point.up ? "--bull" : "--bear",
      hidden: index > 0 && points[index - 1]?.up !== point.up,
    })),
  );
}

/**
 * Validates the indicators written in MDX and computes them from the candles.
 * Throws with the chart's label on a typo or missing volume, which stops `yarn build`.
 */
export function buildIndicators(
  input: IndicatorsInput | undefined,
  candles: ChartCandle[],
  legend: (key: LegendKey) => string,
  chartLabel: string,
): ChartIndicators {
  const result = indicatorsSchema.safeParse(input ?? {});
  if (!result.success) {
    throw new Error(
      `Invalid indicators in <CandleChart label="${chartLabel}">:\n${z.prettifyError(result.error)}`,
    );
  }
  const chosen = result.data;

  const withVolume = () =>
    candles.map((candle) => {
      if (candle.volume === undefined) {
        throw new Error(
          `Invalid indicators in <CandleChart label="${chartLabel}">: the data has no volume – fetch it again with yarn content:fetch-candles`,
        );
      }
      return { ...candle, volume: candle.volume };
    });

  const averages = [
    ...chosen.sma.map((period) => ({
      label: `SMA ${period}`,
      points: sma(candles, period),
    })),
    ...chosen.ema.map((period) => ({
      label: `EMA ${period}`,
      points: ema(candles, period),
    })),
    ...chosen.wma.map((period) => ({
      label: `WMA ${period}`,
      points: wma(candles, period),
    })),
  ];
  const overlays: ChartIndicators["overlays"] = averages.map(
    (average, index) => {
      const color = AVERAGE_COLORS[index] ?? "--chart-1";
      return {
        label: average.label,
        color,
        series: [line(color, average.points)],
      };
    },
  );

  if (chosen.bollinger) {
    const bands = bollinger(candles);
    overlays.push({
      label: legend("bollinger"),
      color: "--chart-5",
      series: [
        line("--chart-5", bands.upper),
        line("--chart-5", bands.middle, true),
        line("--chart-5", bands.lower),
      ],
    });
  }
  if (chosen.vwap) {
    overlays.push({
      label: legend("vwap"),
      color: "--chart-3",
      series: [line("--chart-3", vwap(withVolume()))],
    });
  }
  if (chosen.sar) {
    overlays.push({
      label: legend("sar"),
      color: "--bull",
      series: [
        {
          kind: "dots",
          color: "--bull",
          points: parabolicSar(candles).map((point) => ({
            time: point.time,
            value: point.value,
            color: point.up ? "--bull" : "--bear",
          })),
        },
      ],
    });
  }
  if (chosen.supertrend) {
    overlays.push({
      label: legend("supertrend"),
      color: "--bull",
      series: [trendLine(supertrend(candles))],
    });
  }

  const PANELS: Record<
    PanelIndicator,
    () => Omit<ChartIndicators["panels"][number], "label">
  > = {
    volume: () => ({
      format: "volume",
      guides: [],
      series: [
        histogram(
          withVolume().map((candle) => ({
            time: candle.time,
            value: candle.volume,
          })),
          (_, index) => {
            const candle = candles[index];
            return candle ? candle.close >= candle.open : true;
          },
        ),
      ],
    }),
    rsi: () => ({
      guides: [70, 30],
      series: [line("--chart-5", rsi(candles))],
    }),
    atr: () => ({
      format: "percent",
      guides: [],
      series: [line("--chart-2", atrPercent(candles))],
    }),
    macd: () => {
      const values = macd(candles);
      return {
        guides: [0],
        series: [
          histogram(values.histogram, (point) => point.value >= 0),
          line("--chart-1", values.macd),
          line("--chart-3", values.signal),
        ],
      };
    },
    stochRsi: () => {
      const values = stochRsi(candles);
      return {
        guides: [80, 20],
        series: [line("--chart-1", values.k), line("--chart-3", values.d)],
      };
    },
    stochastic: () => {
      const values = stochastic(candles);
      return {
        guides: [80, 20],
        series: [line("--chart-1", values.k), line("--chart-3", values.d)],
      };
    },
    kdj: () => {
      const values = kdj(candles);
      return {
        guides: [80, 20],
        series: [
          line("--chart-1", values.k),
          line("--chart-3", values.d),
          line("--chart-5", values.j),
        ],
      };
    },
    williamsR: () => ({
      guides: [-20, -80],
      series: [line("--chart-5", williamsR(candles))],
    }),
    cci: () => ({
      guides: [100, -100],
      series: [line("--chart-5", cci(candles))],
    }),
    obv: () => ({
      format: "volume",
      guides: [],
      series: [line("--chart-1", obv(withVolume()))],
    }),
    mfi: () => ({
      guides: [80, 20],
      series: [line("--chart-5", mfi(withVolume()))],
    }),
  };

  const panels = PANEL_INDICATORS.filter((name) => chosen[name]).map(
    (name) => ({ label: legend(name), ...PANELS[name]() }),
  );

  return { overlays, panels };
}
