import { useTranslations } from "next-intl";

import {
  CANDLE_PATTERNS,
  isCandlePatternName,
} from "@/lib/content/candle-patterns";

import { SvgCandle } from "./SvgCandle";

const SPACING = 36; // distance between candle centers in SVG units
const BODY_WIDTH = 20;
const HEIGHT = 180;
const PADDING = 12;

type CandlePatternProps = {
  // Name of the pattern, e.g. "hammer" – see CANDLE_PATTERNS.
  name: string;
};

// Illustrative candlestick pattern in a lesson: <CandlePattern name="hammer" />
// The trend before the pattern is faded, the pattern itself is highlighted.
export function CandlePattern({ name }: CandlePatternProps) {
  const t = useTranslations("Lesson");

  // MDX is not type-checked, so an unknown name stops the build here.
  if (!isCandlePatternName(name)) {
    throw new Error(
      `Unknown <CandlePattern name="${name}">. Known: ${Object.keys(CANDLE_PATTERNS).join(", ")}`,
    );
  }

  const { candles, patternStart } = CANDLE_PATTERNS[name];
  const width = candles.length * SPACING;
  const high = Math.max(...candles.map((candle) => candle.high));
  const low = Math.min(...candles.map((candle) => candle.low));
  const y = (price: number) =>
    PADDING + ((high - price) / (high - low)) * (HEIGHT - 2 * PADDING);

  return (
    <figure className="not-prose my-8 flex flex-col items-center gap-3">
      <svg
        viewBox={`0 0 ${width} ${HEIGHT}`}
        role="img"
        aria-label={`${t(`pattern.${name}.name`)}: ${t(`pattern.${name}.description`)}`}
        className="h-48 w-auto max-w-full rounded-lg border border-border bg-card sm:h-56"
      >
        <rect
          x={patternStart * SPACING + 4}
          y={4}
          width={(candles.length - patternStart) * SPACING - 8}
          height={HEIGHT - 8}
          rx={6}
          className="fill-primary/10"
        />
        {candles.map((candle, index) => (
          <SvgCandle
            // The candles never change order, so the position is a stable key.
            key={index}
            candle={candle}
            x={index * SPACING + SPACING / 2}
            width={BODY_WIDTH}
            y={y}
            className={index < patternStart ? "opacity-40" : undefined}
          />
        ))}
      </svg>
      <figcaption className="flex max-w-md flex-col gap-1 text-center text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">
          {t(`pattern.${name}.name`)}
        </span>
        <span>{t(`pattern.${name}.description`)}</span>
      </figcaption>
    </figure>
  );
}
