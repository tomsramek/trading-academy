import { z } from "zod";

/*
 * Annotations of a lesson chart, written in MDX:
 *   levels={[{ price: 73000, kind: "resistance" }]}
 *   markers={[{ time: "2024-05-01", kind: "buy" }]}
 *   zones={[{ from: "2024-02-26", to: "2024-03-14", label: "Rally" }]}
 * MDX is not type-checked, so <CandleChart> validates them with these schemas – a typo stops the build.
 */

export const LEVEL_KINDS = [
  "support",
  "resistance",
  "entry",
  "stopLoss",
  "takeProfit",
] as const;
export type LevelKind = (typeof LEVEL_KINDS)[number];

// buy/sell show a trade; event marks a neutral moment (a halving, news) without suggesting a trade;
// high/low mark a swing high or low (market structure) above or below the candle.
export const MARKER_KINDS = ["buy", "sell", "event", "high", "low"] as const;
export type MarkerKind = (typeof MARKER_KINDS)[number];

// "2024-03-05" – a day in UTC, the format used in lessons.
const isoDate = z.iso.date();

export const annotationsSchema = z.strictObject({
  levels: z
    .array(
      z.strictObject({
        price: z.number().positive(),
        kind: z.enum(LEVEL_KINDS),
        label: z.string().trim().min(1).optional(),
      }),
    )
    .default([]),
  markers: z
    .array(
      z.strictObject({
        time: isoDate,
        kind: z.enum(MARKER_KINDS),
        label: z.string().trim().min(1).optional(),
      }),
    )
    .default([]),
  zones: z
    .array(
      z
        .strictObject({
          from: isoDate,
          to: isoDate,
          label: z.string().trim().min(1).optional(),
        })
        .refine((zone) => zone.from <= zone.to, "from must not be after to"),
    )
    .default([]),
});

export type AnnotationsInput = z.input<typeof annotationsSchema>;

// Indicators drawn in their own panel under the price, in the order the panels are stacked.
export const PANEL_INDICATORS = [
  "volume",
  "rsi",
  "atr",
  "macd",
  "stochRsi",
  "stochastic",
  "kdj",
  "williamsR",
  "cci",
  "obv",
  "mfi",
] as const;
export type PanelIndicator = (typeof PANEL_INDICATORS)[number];

// Indicators of a lesson chart, written in MDX: indicators={{ sma: [50, 200], volume: true }}.
// At most three average lines and three panels under the price, so the chart stays readable.
const period = z.int().min(2).max(400);
export const indicatorsSchema = z
  .strictObject({
    sma: z.array(period).max(3).default([]),
    ema: z.array(period).max(3).default([]),
    wma: z.array(period).max(3).default([]),
    // Over the candles, with Binance's default settings.
    bollinger: z.boolean().default(false),
    // Over the last 14 candles, as on Binance.
    vwap: z.boolean().default(false),
    sar: z.boolean().default(false),
    supertrend: z.boolean().default(false),
    // Each of these gets its own panel under the chart.
    // Traded volume as bars; the data must contain `volume` (so must VWAP, OBV and MFI).
    volume: z.boolean().default(false),
    // RSI 14 with the 30 and 70 lines.
    rsi: z.boolean().default(false),
    // ATR 14 as a percentage of the price: how much the price typically moves a day.
    atr: z.boolean().default(false),
    macd: z.boolean().default(false),
    stochRsi: z.boolean().default(false),
    stochastic: z.boolean().default(false),
    kdj: z.boolean().default(false),
    williamsR: z.boolean().default(false),
    cci: z.boolean().default(false),
    obv: z.boolean().default(false),
    mfi: z.boolean().default(false),
  })
  .refine(
    (indicators) =>
      indicators.sma.length + indicators.ema.length + indicators.wma.length <=
      3,
    "at most three moving averages in one chart",
  )
  .refine(
    (indicators) =>
      PANEL_INDICATORS.filter((name) => indicators[name]).length <= 3,
    "at most three panels under one chart",
  );

export type IndicatorsInput = z.input<typeof indicatorsSchema>;

// Design tokens the indicator lines are drawn in.
export type ChartToken =
  | "--chart-1"
  | "--chart-2"
  | "--chart-3"
  | "--chart-4"
  | "--chart-5"
  | "--bull"
  | "--bear";

// One drawn series. A point with its own color overrides the series color (volume and MACD bars,
// SAR dots, Supertrend); a hidden point hides the line segment that leads to it.
export type ChartSeries = {
  kind: "line" | "dots" | "histogram";
  color: ChartToken;
  dashed?: boolean;
  points: {
    time: number;
    value: number;
    color?: ChartToken;
    hidden?: boolean;
  }[];
};

// Indicators ready for drawing: lines over the candles and panels under them, each with a legend label.
export type ChartIndicators = {
  overlays: { label: string; color: ChartToken; series: ChartSeries[] }[];
  panels: {
    label: string;
    series: ChartSeries[];
    // Dashed reference lines, e.g. RSI 30 and 70.
    guides: number[];
    format?: "percent" | "volume";
  }[];
};

// Annotations ready for drawing: dates as Unix seconds, every label filled in.
export type ChartAnnotations = {
  levels: { price: number; kind: LevelKind; label: string }[];
  markers: { time: number; kind: MarkerKind; label: string }[];
  zones: { from: number; to: number; label?: string }[];
};

// "2024-03-05" → Unix timestamp in seconds at 00:00 UTC (the start of a daily candle).
export function toTimestamp(date: string): number {
  return Date.parse(`${date}T00:00:00Z`) / 1000;
}

// Props of a <LineChart> written in MDX – equity curves, comparisons of markets, funding rates.
export const lineChartSchema = z.strictObject({
  // Which series of the data file to draw, each with its legend label. At most four lines.
  lines: z
    .array(
      z.strictObject({
        key: z.string().min(1),
        label: z.string().trim().min(1),
      }),
    )
    .min(1)
    .max(4),
  // A logarithmic price axis – for curves that grow many times over.
  logarithmic: z.boolean().default(false),
  // Values are percentages (shown with a % sign).
  percent: z.boolean().default(false),
  // Neutral markers on the first line, e.g. a halving.
  markers: z
    .array(
      z.strictObject({
        time: isoDate,
        label: z.string().trim().min(1),
      }),
    )
    .default([]),
});

export type LineChartInput = z.input<typeof lineChartSchema>;
