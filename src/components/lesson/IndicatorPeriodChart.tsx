"use client";

import { useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import type { ChartAnnotations } from "@/lib/content/chart";
import {
  DEFAULT_PERIODS,
  INDICATOR_NAMES,
  periodIndicator,
  periodSignals,
  type PeriodIndicator,
} from "@/lib/content/indicator-period";

import type { Candle } from "./CandleChart";
import { CandleChartCanvas } from "./CandleChartCanvas";

type IndicatorPeriodChartProps = {
  candles: Candle[];
  indicator: PeriodIndicator;
  min: number;
  max: number;
  value?: number;
  label: string;
};

// Nothing is annotated – a stable object, so the chart is not redrawn without a reason.
const NO_ANNOTATIONS: ChartAnnotations = { levels: [], markers: [], zones: [] };

// The chart and the slider: every move recomputes the line and the number of signals.
export function IndicatorPeriodChart({
  candles,
  indicator,
  min,
  max,
  value,
  label,
}: IndicatorPeriodChartProps) {
  const t = useTranslations("Lesson.indicatorPeriod");
  const locale = useLocale();
  const sliderId = useId();
  const standard = DEFAULT_PERIODS[indicator];
  const [period, setPeriod] = useState(
    value ?? Math.min(Math.max(standard, min), max),
  );

  const drawn = periodIndicator(indicator, candles, period);
  const signals = periodSignals(indicator, candles, drawn);
  const lineLabel = (drawn.overlays[0] ?? drawn.panels[0])?.label ?? "";
  const tempo =
    period < standard
      ? "tempoFaster"
      : period > standard
        ? "tempoSlower"
        : "tempoStandard";
  const percent = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });

  return (
    <div className="flex flex-col gap-4">
      <CandleChartCanvas
        candles={candles}
        label={`${label} (${lineLabel})`}
        annotations={NO_ANNOTATIONS}
        indicators={drawn}
      />
      <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor={sliderId} className="font-medium">
            {t("period", { line: INDICATOR_NAMES[indicator] })}
          </label>
          <output htmlFor={sliderId} className="font-mono text-lg">
            {period}
          </output>
        </div>
        <input
          id={sliderId}
          type="range"
          min={min}
          max={max}
          value={period}
          onChange={(event) => setPeriod(Number(event.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            {min} · {t("standard", { period: standard })} · {max}
          </span>
          {period !== standard && standard >= min && standard <= max && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPeriod(standard)}
            >
              {t("reset")}
            </Button>
          )}
        </div>
        {/* Announced when the slider stops moving. */}
        <p aria-live="polite" className="text-sm">
          <span className="font-semibold">
            {signals.kind === "range"
              ? t("range", { average: percent.format(signals.average) })
              : t(signals.kind, { count: signals.count })}
          </span>{" "}
          {t(tempo)}
        </p>
      </div>
    </div>
  );
}
