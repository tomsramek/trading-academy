"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import {
  CandlestickSeries,
  ColorType,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";

import type { Candle } from "./CandleChart";

type CandleChartCanvasProps = {
  candles: Candle[];
  // What the chart shows, for screen readers (the chart itself is a picture drawn on a canvas).
  label: string;
};

// The interactive part of <CandleChart>: pinch or drag the axes to zoom, drag to move, hover for values.
// Drawn by lightweight-charts from TradingView; its logo in the corner is the attribution the licence requires.
export function CandleChartCanvas({ candles, label }: CandleChartCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Prices and dates follow the language of the page: 59 572,83 in Czech, 59,572.83 in English.
  const locale = useLocale();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const price = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
    const chart = createChart(container, {
      autoSize: true,
      localization: {
        locale,
        priceFormatter: (value: number) => price.format(value),
      },
      layout: { fontFamily: getComputedStyle(container).fontFamily },
      // The page must keep scrolling over the chart: no zoom by mouse wheel, no vertical drag.
      // Zoom works by pinching or dragging the axes, moving by dragging sideways.
      handleScroll: { mouseWheel: false, vertTouchDrag: false },
      handleScale: { mouseWheel: false },
    });
    const series = chart.addSeries(CandlestickSeries, { borderVisible: false });
    // lightweight-charts marks timestamps with its own type; our data stores plain numbers.
    series.setData(
      candles.map((candle) => ({
        ...candle,
        time: candle.time as UTCTimestamp,
      })),
    );
    chart.timeScale().fitContent();
    applyColors(container, chart, series);

    // The chart is drawn on a canvas, so CSS cannot recolor it. Watch the `dark` class that next-themes
    // sets on <html> and repaint with the new token colors – the zoom and position stay as they are.
    const observer = new MutationObserver(() =>
      applyColors(container, chart, series),
    );
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
      chart.remove();
    };
  }, [candles, locale]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={label}
      className="h-80 overflow-hidden rounded-lg border border-border bg-card sm:h-96"
    />
  );
}

function applyColors(
  container: HTMLElement,
  chart: IChartApi,
  series: ISeriesApi<"Candlestick">,
) {
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
  series.applyOptions({
    upColor: color("--bull"),
    downColor: color("--bear"),
    wickUpColor: color("--bull"),
    wickDownColor: color("--bear"),
  });
}

// Reads a design token (e.g. "--bull") as rgb(), because lightweight-charts does not understand oklch().
// The browser converts any CSS color when it is drawn on a canvas, so a 1×1 canvas does the conversion.
function tokenReader(element: HTMLElement) {
  const styles = getComputedStyle(element);
  const context = document.createElement("canvas").getContext("2d", {
    willReadFrequently: true,
  });

  return (token: string): string => {
    const value = styles.getPropertyValue(token).trim();
    if (!context) {
      return value;
    }
    context.clearRect(0, 0, 1, 1);
    context.fillStyle = value;
    context.fillRect(0, 0, 1, 1);
    const [red = 0, green = 0, blue = 0, alpha = 255] = context.getImageData(
      0,
      0,
      1,
      1,
    ).data;
    return `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`;
  };
}
