import { cn } from "@/lib/utils";
import type { PatternCandle } from "@/lib/content/candle-patterns";

type SvgCandleProps = {
  candle: PatternCandle;
  // Horizontal center of the candle in SVG units.
  x: number;
  width: number;
  // Converts a price to the SVG y coordinate (prices grow upwards, SVG y grows downwards).
  y: (price: number) => number;
  className?: string;
};

// One candlestick inside an <svg>: the wick from low to high and the body from open to close.
// Colors come from the design tokens through CSS classes, so the theme switch needs no JavaScript.
export function SvgCandle({ candle, x, width, y, className }: SvgCandleProps) {
  const rising = candle.close >= candle.open;
  const top = y(Math.max(candle.open, candle.close));
  // A doji has almost no body – keep it visible as a thin line.
  const bodyHeight = Math.max(Math.abs(y(candle.open) - y(candle.close)), 1.5);

  return (
    <g
      className={cn(
        rising ? "fill-bull stroke-bull" : "fill-bear stroke-bear",
        className,
      )}
    >
      <line
        x1={x}
        x2={x}
        y1={y(candle.high)}
        y2={y(candle.low)}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <rect
        x={x - width / 2}
        y={top}
        width={width}
        height={bodyHeight}
        rx={2}
        strokeWidth={0}
      />
    </g>
  );
}
