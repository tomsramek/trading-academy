"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import type {
  IndicatorStepsData,
  Step,
  StepIndicator,
} from "@/lib/content/indicator-steps";

import { MiniChart } from "./MiniChart";

type IndicatorStepsPlayerProps = {
  data: IndicatorStepsData;
  label: string;
};

// How long one step stays on screen while playing.
const STEP_MS = 1800;

// How each number of a step is written: prices, percentages, ratios, volumes.
type NumberKind = "price" | "signedPrice" | "percent" | "ratio" | "volume";
const NUMBER_KINDS: Record<StepIndicator, Record<string, NumberKind>> = {
  sma: { sum: "price", value: "price" },
  ema: { value: "price", previous: "price", close: "price", weight: "ratio" },
  bollinger: {
    middle: "price",
    deviation: "price",
    upper: "price",
    lower: "price",
  },
  rsi: {
    change: "signedPrice",
    gain: "price",
    loss: "price",
    strength: "ratio",
    value: "percent",
  },
  macd: {
    fast: "price",
    slow: "price",
    macd: "signedPrice",
    signal: "signedPrice",
    histogram: "signedPrice",
  },
  stochastic: { high: "price", low: "price", close: "price", value: "percent" },
  atr: {
    range: "price",
    upGap: "price",
    downGap: "price",
    trueRange: "price",
    previous: "price",
    value: "price",
  },
  obv: {
    close: "price",
    previousClose: "price",
    volume: "volume",
    previous: "volume",
    value: "volume",
  },
};

// The explanation of an indicator, one candle at a time: the chart grows with every step, the
// highlighted candles are the ones the value comes from, and the text shows the numbers.
export function IndicatorStepsPlayer({
  data,
  label,
}: IndicatorStepsPlayerProps) {
  const t = useTranslations("Lesson.indicatorSteps");
  const locale = useLocale();
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const last = data.steps.length - 1;
  const step = data.steps[current];

  // Playing moves one step on after a while; it stops by itself at the last step.
  useEffect(() => {
    if (!playing) {
      return;
    }
    const timer = setTimeout(() => {
      setCurrent((index) => Math.min(index + 1, last));
      if (current + 1 >= last) {
        setPlaying(false);
      }
    }, STEP_MS);
    return () => clearTimeout(timer);
  }, [playing, current, last]);

  if (!step) {
    return null;
  }

  const formats: Record<NumberKind, Intl.NumberFormat> = {
    price: new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }),
    signedPrice: new Intl.NumberFormat(locale, {
      maximumFractionDigits: 2,
      signDisplay: "exceptZero",
    }),
    percent: new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }),
    ratio: new Intl.NumberFormat(locale, { maximumFractionDigits: 3 }),
    volume: new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }),
  };
  const day = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  });

  const explanation = explain(step, data, (key, value) =>
    formats[NUMBER_KINDS[data.indicator][key] ?? "price"].format(value),
  );
  const candle = data.candles[step.candle];

  function go(index: number) {
    setPlaying(false);
    setCurrent(Math.max(0, Math.min(index, last)));
  }

  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-col gap-4 rounded-xl border border-border p-4 sm:p-5"
    >
      <MiniChart
        candles={data.candles}
        overlay={data.overlay}
        panel={data.panel}
        drawnUntil={step.candle}
        highlight={step.window}
        focus={step.candle}
        levels={step.levels}
      />
      <p className="text-xs text-muted-foreground">
        {t(`legend.${data.indicator}`, { period: data.period })}
      </p>

      {/* Announced by screen readers on every step. */}
      <p aria-live="polite" className="min-h-18 text-sm sm:text-base">
        <span className="font-semibold">
          {candle && day.format(candle.time * 1000)}:
        </span>{" "}
        {t(explanation.key, {
          ...explanation.values,
          period: data.period,
          periodMinusOne: data.period - 1,
        })}
      </p>

      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-xs text-muted-foreground">
          {t("progress", { current: current + 1, total: data.steps.length })}
          <input
            type="range"
            min={0}
            max={last}
            value={current}
            onChange={(event) => go(Number(event.target.value))}
            className="w-full accent-primary"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => go(current - 1)}
            disabled={current === 0}
          >
            <ChevronLeftIcon aria-hidden="true" />
            {t("previous")}
          </Button>
          <Button
            variant="outline"
            onClick={() => go(current + 1)}
            disabled={current === last}
          >
            {t("next")}
            <ChevronRightIcon aria-hidden="true" />
          </Button>
          {current === last ? (
            <Button variant="ghost" onClick={() => go(0)}>
              <RotateCcwIcon aria-hidden="true" />
              {t("restart")}
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => setPlaying(!playing)}>
              {playing ? (
                <PauseIcon aria-hidden="true" />
              ) : (
                <PlayIcon aria-hidden="true" />
              )}
              {playing ? t("pause") : t("play")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// The explanation of each step. RSI, EMA and ATR compute their first value differently; OBV says
// which way the close went.
const EXPLANATIONS = {
  sma: { next: "explain.sma" },
  ema: { first: "explain.emaFirst", next: "explain.ema" },
  bollinger: { next: "explain.bollinger" },
  rsi: { first: "explain.rsiFirst", next: "explain.rsi" },
  macd: { next: "explain.macd" },
  stochastic: { next: "explain.stochastic" },
  atr: { first: "explain.atrFirst", next: "explain.atr" },
  obv: {
    up: "explain.obvUp",
    down: "explain.obvDown",
    flat: "explain.obvFlat",
  },
} as const;
type ExplanationKey = {
  [
    Name in StepIndicator
  ]: (typeof EXPLANATIONS)[Name][keyof (typeof EXPLANATIONS)[Name]];
}[StepIndicator];

// The text key of a step and its numbers, formatted for the page language.
function explain(
  step: Step,
  data: IndicatorStepsData,
  format: (key: string, value: number) => string,
) {
  const keys: Partial<Record<Step["variant"], ExplanationKey>> =
    EXPLANATIONS[data.indicator];
  const key = keys[step.variant] ?? keys.next;
  if (!key) {
    throw new Error(
      `No explanation of ${data.indicator} for a "${step.variant}" step`,
    );
  }
  const values = Object.fromEntries(
    Object.entries(step.values).map(([name, value]) => [
      name,
      format(name, value),
    ]),
  );
  return { key, values };
}
