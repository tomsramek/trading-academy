"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import {
  ColorType,
  createChart,
  createSeriesMarkers,
  LineSeries,
  PriceScaleMode,
  type IChartApi,
  type UTCTimestamp,
} from "lightweight-charts";

import type { IndicatorPoint } from "@/lib/content/indicators";

import { tokenReader } from "./chartColors";
import { ChartZoomButtons } from "./ChartZoomButtons";

type LineChartCanvasProps = {
  lines: { label: string; color: 1 | 2 | 3 | 5; points: IndicatorPoint[] }[];
  // What the chart shows, for screen readers (the chart itself is a picture drawn on a canvas).
  label: string;
  logarithmic: boolean;
  percent: boolean;
  markers: { time: number; label: string }[];
};

// The interactive part of <LineChart>: the same behaviour as the candlestick charts – zoom buttons,
// drag to move, hover for values, colors from the design tokens that follow the theme.
export function LineChartCanvas({
  lines,
  label,
  logarithmic,
  percent,
  markers,
}: LineChartCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const locale = useLocale();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
    const chart = createChart(container, {
      autoSize: true,
      localization: {
        locale,
        priceFormatter: (value: number) =>
          percent ? `${number.format(value)} %` : number.format(value),
      },
      layout: { fontFamily: getComputedStyle(container).fontFamily },
      rightPriceScale: {
        mode: logarithmic ? PriceScaleMode.Logarithmic : PriceScaleMode.Normal,
      },
      // The page must keep scrolling over the chart: no zoom by mouse wheel, no vertical drag.
      handleScroll: { mouseWheel: false, vertTouchDrag: false },
      handleScale: { mouseWheel: false },
    });
    chartRef.current = chart;

    const series = lines.map((line) => {
      const lineSeries = chart.addSeries(LineSeries, {
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: true,
      });
      lineSeries.setData(
        line.points.map((point) => ({
          time: point.time as UTCTimestamp,
          value: point.value,
        })),
      );
      return lineSeries;
    });
    const firstSeries = series[0];
    const markerPlugin = firstSeries
      ? createSeriesMarkers(firstSeries)
      : undefined;

    const paint = () => {
      const color = tokenReader(container);
      chart.applyOptions({
        layout: {
          background: { type: ColorType.Solid, color: color("--card") },
          textColor: color("--muted-foreground"),
        },
        grid: {
          vertLines: { color: color("--border") },
          horzLines: { color: color("--border") },
        },
        rightPriceScale: { borderColor: color("--border") },
        timeScale: { borderColor: color("--border") },
      });
      series.forEach((lineSeries, index) => {
        const line = lines[index];
        if (line) {
          lineSeries.applyOptions({ color: color(`--chart-${line.color}`) });
        }
      });
      markerPlugin?.setMarkers(
        markers.map((marker) => ({
          time: marker.time as UTCTimestamp,
          text: marker.label,
          position: "aboveBar",
          shape: "circle",
          color: color("--primary"),
        })),
      );
    };
    paint();
    chart.timeScale().fitContent();

    // Repaint with the new token colors when next-themes switches the `dark` class on <html>.
    const observer = new MutationObserver(paint);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
      chartRef.current = null;
      chart.remove();
    };
  }, [lines, logarithmic, percent, markers, locale]);

  const points = Math.max(0, ...lines.map((line) => line.points.length));

  return (
    <>
      <ChartZoomButtons chartRef={chartRef} points={points} />
      <div
        ref={containerRef}
        // A group, not an image: the chart library adds a focusable attribution link inside.
        role="group"
        aria-label={label}
        className="h-72 overflow-hidden rounded-lg border border-border bg-card sm:h-80"
      />
    </>
  );
}
