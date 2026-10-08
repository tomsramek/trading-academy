import { useLocale, useTranslations } from "next-intl";
import { z } from "zod";

import {
  annotationsSchema,
  indicatorsSchema,
  toTimestamp,
  type AnnotationsInput,
  type ChartAnnotations,
  type ChartIndicators,
  type IndicatorsInput,
  type LevelKind,
  type MarkerKind,
} from "@/lib/content/chart";
import { atrPercent, ema, rsi, sma } from "@/lib/content/indicators";
import { cn } from "@/lib/utils";

import { CandleChartCanvas } from "./CandleChartCanvas";
import { ChartSource } from "./ChartSource";

export type Candle = {
  // Start of the period as a Unix timestamp in seconds (UTC).
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  // Traded amount of the base asset; only in data fetched with volume.
  volume?: number;
};

// Shape of the JSON files from `yarn content:fetch-candles`. Illustrative data has only `candles`.
export type CandleDataset = {
  candles: Candle[];
  source?: string;
  license?: string;
  symbol?: string;
  interval?: string;
};

type CandleChartProps = AnnotationsInput & {
  data: CandleDataset;
  // Moving averages, RSI and volume: indicators={{ sma: [50, 200], volume: true }}
  indicators?: IndicatorsInput;
  // What the chart shows – read by screen readers instead of the drawing.
  label: string;
  caption?: string;
};

// Candlestick chart in a lesson:
//   import btc from "@content/market-data/btcusdt-1d-2024-h1.json";
//   <CandleChart data={btc} label="Bitcoin in the first half of 2024" levels={[{ price: 73000, kind: "resistance" }]} />
// Real market data always shows its source and licence; generated data is marked as illustrative.
export function CandleChart({
  data,
  label,
  caption,
  levels,
  markers,
  zones,
  indicators,
}: CandleChartProps) {
  const t = useTranslations("Lesson.chart");
  const locale = useLocale();
  const annotations = resolveAnnotations(
    { levels, markers, zones },
    data.candles,
    label,
    (kind) => t(`kind.${kind}`),
  );
  const drawn = resolveIndicators(indicators, data.candles, label);
  const hasAnnotations =
    annotations.levels.length +
      annotations.markers.length +
      annotations.zones.length >
    0;
  const price = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  const day = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  });

  return (
    <figure className="not-prose my-8">
      <CandleChartCanvas
        candles={data.candles}
        label={label}
        annotations={annotations}
        indicators={drawn}
      />
      <figcaption className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
        {(drawn.lines.length > 0 || drawn.volume || drawn.rsi || drawn.atr) && (
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            {drawn.lines.map((line) => (
              <li key={line.label} className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-0.5 w-4 rounded-full",
                    LINE_SWATCH[line.color],
                  )}
                />
                {line.label}
              </li>
            ))}
            {drawn.volume && <li>{t("volume")}</li>}
            {drawn.rsi && <li>{t("rsi")}</li>}
            {drawn.atr && <li>{t("atr")}</li>}
          </ul>
        )}
        {caption && <span>{caption}</span>}
        {/* The drawn annotations as text for screen readers. */}
        {hasAnnotations && (
          <ul className="sr-only">
            {annotations.levels.map((level) => (
              <li key={`level-${level.kind}-${level.price}`}>
                {level.label}: {price.format(level.price)}
              </li>
            ))}
            {annotations.markers.map((marker) => (
              <li key={`marker-${marker.kind}-${marker.time}`}>
                {marker.label}: {day.format(marker.time * 1000)}
              </li>
            ))}
            {annotations.zones.map((zone) => (
              <li key={`zone-${zone.from}-${zone.to}`}>
                {zone.label ?? t("zone")}:{" "}
                {day.formatRange(zone.from * 1000, zone.to * 1000)}
              </li>
            ))}
          </ul>
        )}
        <ChartSource
          source={data.source}
          license={data.license}
          prefix={
            data.symbol && data.interval
              ? `${formatSymbol(data.symbol)} · ${data.interval.toUpperCase()}`
              : undefined
          }
        />
      </figcaption>
    </figure>
  );
}

// Swatch next to each average line in the legend – the same --chart-N token as the line.
const LINE_SWATCH = {
  1: "bg-chart-1",
  3: "bg-chart-3",
  5: "bg-chart-5",
} as const;

const LINE_COLORS = [1, 3, 5] as const;

// Validates the indicators written in MDX and computes their values from the candles.
function resolveIndicators(
  input: IndicatorsInput | undefined,
  candles: Candle[],
  chartLabel: string,
): ChartIndicators {
  const result = indicatorsSchema.safeParse(input ?? {});
  if (!result.success) {
    throw new Error(
      `Invalid indicators in <CandleChart label="${chartLabel}">:\n${z.prettifyError(result.error)}`,
    );
  }
  const {
    sma: smaPeriods,
    ema: emaPeriods,
    rsi: withRsi,
    volume,
    atr: withAtr,
  } = result.data;

  const averages = [
    ...smaPeriods.map((period) => ({
      label: `SMA ${period}`,
      points: sma(candles, period),
    })),
    ...emaPeriods.map((period) => ({
      label: `EMA ${period}`,
      points: ema(candles, period),
    })),
  ];

  let volumeBars: ChartIndicators["volume"];
  if (volume) {
    volumeBars = candles.map((candle) => {
      if (candle.volume === undefined) {
        throw new Error(
          `Invalid indicators in <CandleChart label="${chartLabel}">: the data has no volume – fetch it again with yarn content:fetch-candles`,
        );
      }
      return {
        time: candle.time,
        value: candle.volume,
        up: candle.close >= candle.open,
      };
    });
  }

  return {
    lines: averages.map((average, index) => ({
      ...average,
      color: LINE_COLORS[index] ?? 1,
    })),
    volume: volumeBars,
    rsi: withRsi ? rsi(candles) : undefined,
    atr: withAtr ? atrPercent(candles) : undefined,
  };
}

// Validates the annotations written in MDX and prepares them for drawing.
// An invalid annotation throws, which stops `yarn build` with the chart label in the message.
function resolveAnnotations(
  input: AnnotationsInput,
  candles: Candle[],
  chartLabel: string,
  kindLabel: (kind: LevelKind | MarkerKind) => string,
): ChartAnnotations {
  const result = annotationsSchema.safeParse(input);
  if (!result.success) {
    throw new Error(
      `Invalid annotations in <CandleChart label="${chartLabel}">:\n${z.prettifyError(result.error)}`,
    );
  }

  const times = new Set(candles.map((candle) => candle.time));
  const timeOf = (date: string) => {
    const time = toTimestamp(date);
    if (!times.has(time)) {
      throw new Error(
        `Invalid annotations in <CandleChart label="${chartLabel}">: ${date} is not in the chart data`,
      );
    }
    return time;
  };

  const { levels, markers, zones } = result.data;
  return {
    levels: levels.map((level) => ({
      ...level,
      label: level.label ?? kindLabel(level.kind),
    })),
    markers: markers.map((marker) => ({
      kind: marker.kind,
      time: timeOf(marker.time),
      label: marker.label ?? kindLabel(marker.kind),
    })),
    zones: zones.map((zone) => ({
      from: timeOf(zone.from),
      to: timeOf(zone.to),
      label: zone.label,
    })),
  };
}

// "BTCUSDT" → "BTC/USDT"
function formatSymbol(symbol: string): string {
  const quote = ["USDT", "USDC", "EUR", "BTC"].find((asset) =>
    symbol.endsWith(asset),
  );
  return quote ? `${symbol.slice(0, -quote.length)}/${quote}` : symbol;
}
