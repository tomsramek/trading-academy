import { useTranslations } from "next-intl";

import type { PatternCandle } from "@/lib/content/candle-patterns";

import { SvgCandle } from "./SvgCandle";

const WIDTH = 420;
const BODY_WIDTH = 28;
const RISING_X = 130;
const FALLING_X = 290;
const MIDDLE_X = (RISING_X + FALLING_X) / 2;

// Both candles have the same shape, so the body and wick labels in the middle fit both.
const RISING: PatternCandle = { open: 30, high: 90, low: 10, close: 70 };
const FALLING: PatternCandle = { open: 70, high: 90, low: 10, close: 30 };

// Price 0–100 → SVG y (prices grow upwards, SVG y grows downwards).
const y = (price: number) => 20 + (100 - price) * 1.6;

type Side = "left" | "right";

// The parts of a candlestick, a rising and a falling one side by side: <CandleAnatomy />
export function CandleAnatomy() {
  const t = useTranslations("Lesson.anatomy");

  const point = (label: string, price: number, x: number, side: Side) => {
    const edge =
      side === "left" ? x - BODY_WIDTH / 2 - 6 : x + BODY_WIDTH / 2 + 6;
    const textX = side === "left" ? edge - 22 : edge + 22;
    return (
      <g key={`${x}-${price}`}>
        <line
          x1={edge}
          x2={side === "left" ? textX + 4 : textX - 4}
          y1={y(price)}
          y2={y(price)}
          strokeDasharray="3 3"
          className="stroke-muted-foreground"
        />
        <text
          x={textX}
          y={y(price)}
          dominantBaseline="middle"
          textAnchor={side === "left" ? "end" : "start"}
          className="fill-muted-foreground"
        >
          {label}
        </text>
      </g>
    );
  };

  const part = (label: string, from: number, to: number) => (
    <text
      x={MIDDLE_X}
      y={(y(from) + y(to)) / 2}
      dominantBaseline="middle"
      textAnchor="middle"
      className="fill-foreground font-medium"
    >
      {label}
    </text>
  );

  return (
    <figure className="not-prose my-8 flex flex-col items-center gap-3">
      <svg
        viewBox={`0 0 ${WIDTH} 230`}
        role="img"
        aria-label={t("label")}
        className="w-full max-w-md rounded-lg border border-border bg-card text-sm"
      >
        <SvgCandle candle={RISING} x={RISING_X} width={BODY_WIDTH} y={y} />
        <SvgCandle candle={FALLING} x={FALLING_X} width={BODY_WIDTH} y={y} />

        {point(t("high"), RISING.high, RISING_X, "left")}
        {point(t("close"), RISING.close, RISING_X, "left")}
        {point(t("open"), RISING.open, RISING_X, "left")}
        {point(t("low"), RISING.low, RISING_X, "left")}

        {point(t("high"), FALLING.high, FALLING_X, "right")}
        {point(t("open"), FALLING.open, FALLING_X, "right")}
        {point(t("close"), FALLING.close, FALLING_X, "right")}
        {point(t("low"), FALLING.low, FALLING_X, "right")}

        {part(t("upperWick"), 90, 70)}
        {part(t("body"), 70, 30)}
        {part(t("lowerWick"), 30, 10)}

        <text
          x={RISING_X}
          y={218}
          textAnchor="middle"
          className="fill-bull font-semibold"
        >
          {t("rising")}
        </text>
        <text
          x={FALLING_X}
          y={218}
          textAnchor="middle"
          className="fill-bear font-semibold"
        >
          {t("falling")}
        </text>
      </svg>
    </figure>
  );
}
