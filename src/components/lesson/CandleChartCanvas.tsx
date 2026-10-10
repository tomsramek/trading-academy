"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import {
  CandlestickSeries,
  ColorType,
  HistogramSeries,
  LineSeries,
  createChart,
  createSeriesMarkers,
  LineStyle,
  type IChartApi,
  type IPriceLine,
  type ISeriesApi,
  type ISeriesMarkersPluginApi,
  type SeriesMarkerPosition,
  type SeriesMarkerShape,
  type Logical,
  type LogicalRange,
  type Time,
  type UTCTimestamp,
} from "lightweight-charts";

import type {
  ChartAnnotations,
  ChartIndicators,
  ChartSeries,
  ChartToken,
  LevelKind,
  MarkerKind,
} from "@/lib/content/chart";

import type { Candle } from "./CandleChart";
import { tokenReader, withAlpha, type ColorOf } from "./chartColors";
import { chartHeight, panelCount } from "./chartHeight";
import { ChartZoomButtons } from "./ChartZoomButtons";

type CandleChartCanvasProps = {
  candles: Candle[];
  // What the chart shows, for screen readers (the chart itself is a picture drawn on a canvas).
  label: string;
  annotations: ChartAnnotations;
  indicators: ChartIndicators;
};

// Token of each level: green for levels below the price that hold it up, red for the ones that stop it.
const LEVEL_TOKENS: Record<LevelKind, string> = {
  support: "--bull",
  resistance: "--bear",
  entry: "--primary",
  stopLoss: "--bear",
  takeProfit: "--bull",
};

const MARKER_STYLES = {
  buy: { position: "belowBar", shape: "arrowUp" },
  sell: { position: "aboveBar", shape: "arrowDown" },
  event: { position: "aboveBar", shape: "circle" },
  high: { position: "aboveBar", shape: "circle" },
  low: { position: "belowBar", shape: "circle" },
} as const satisfies Record<
  MarkerKind,
  { position: SeriesMarkerPosition; shape: SeriesMarkerShape }
>;

const MARKER_TOKENS: Record<MarkerKind, string> = {
  buy: "--bull",
  sell: "--bear",
  event: "--primary",
  high: "--chart-3",
  low: "--chart-3",
};

// The interactive part of <CandleChart>: pinch or drag the axes to zoom, drag to move, hover for values.
// Drawn by lightweight-charts from TradingView; its logo in the corner is the attribution the licence requires.
export function CandleChartCanvas({
  candles,
  label,
  annotations,
  indicators,
}: CandleChartCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const zonesRef = useRef<HTMLDivElement>(null);
  // The chart lives outside React (a canvas), the zoom buttons reach it through this ref.
  const chartRef = useRef<IChartApi | null>(null);
  // The zoom survives a redraw (e.g. a new period from a slider): the visible range is kept here.
  const rangeRef = useRef<LogicalRange | null>(null);
  // Prices and dates follow the language of the page: 59 572,83 in Czech, 59,572.83 in English.
  const locale = useLocale();

  useEffect(() => {
    const container = containerRef.current;
    const zoneLayer = zonesRef.current;
    if (!container || !zoneLayer) {
      return;
    }

    // Two decimals for normal prices, three significant digits below 1 – otherwise a price like
    // 0.00005 would show as "0".
    const price = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
    const smallPrice = new Intl.NumberFormat(locale, {
      maximumSignificantDigits: 3,
    });
    const chart = createChart(container, {
      autoSize: true,
      localization: {
        locale,
        priceFormatter: (value: number) =>
          Math.abs(value) < 1 && value !== 0
            ? smallPrice.format(value)
            : price.format(value),
      },
      layout: { fontFamily: getComputedStyle(container).fontFamily },
      // The page must keep scrolling over the chart: no zoom by mouse wheel, no vertical drag.
      // Zoom works by pinching or dragging the axes, moving by dragging sideways.
      handleScroll: { mouseWheel: false, vertTouchDrag: false },
      handleScale: { mouseWheel: false },
    });
    chartRef.current = chart;
    const series = chart.addSeries(CandlestickSeries, { borderVisible: false });
    // lightweight-charts marks timestamps with its own type; our data stores plain numbers.
    series.setData(
      candles.map((candle) => ({
        ...candle,
        time: candle.time as UTCTimestamp,
      })),
    );

    const priceLines = annotations.levels.map((level) =>
      series.createPriceLine({
        price: level.price,
        title: level.label,
        lineWidth: 2,
        // Planned trade levels are dashed, market levels solid.
        lineStyle:
          level.kind === "support" || level.kind === "resistance"
            ? LineStyle.Solid
            : LineStyle.Dashed,
        axisLabelVisible: true,
      }),
    );
    const markers = createSeriesMarkers(series);

    // Indicator lines over the candles (pane 0) and in panels under them (pane 1, 2, 3); the price
    // keeps most of the height. No labels on the price axis, the legend names them.
    const drawn = [
      ...indicators.overlays.flatMap((overlay) =>
        overlay.series.map((definition) => ({
          definition,
          pane: 0,
          format: undefined,
        })),
      ),
      ...indicators.panels.flatMap((panel, index) =>
        panel.series.map((definition) => ({
          definition,
          pane: index + 1,
          format: panel.format,
        })),
      ),
    ].map(({ definition, pane, format }) => ({
      definition,
      series: addIndicatorSeries(chart, definition, pane, format),
    }));
    // Dashed reference lines (RSI 30 and 70…) hang on the first series of their panel.
    const guides = indicators.panels.flatMap((panel) => {
      const first = drawn.find(
        (item) => item.definition === panel.series[0],
      )?.series;
      return panel.guides.map((value) =>
        first?.createPriceLine({
          price: value,
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: true,
        }),
      );
    });
    chart.panes().forEach((pane, index) => {
      pane.setStretchFactor(index === 0 ? 3 : 1);
    });

    // Zones are HTML boxes over the canvas, so their colors come from CSS; only their position is
    // computed from the time scale – on every zoom, move and resize. Subscribed before the first
    // layout, so the initial size and range are not missed.
    const placeZones = () =>
      placeZoneBoxes(zoneLayer, chart, candles, annotations.zones);
    chart.timeScale().subscribeVisibleLogicalRangeChange(placeZones);
    chart.timeScale().subscribeSizeChange(placeZones);

    const paint = () => {
      const color = tokenReader(container);
      applyColors(color, chart, series);
      colorAnnotations(color, annotations, priceLines, markers);
      drawn.forEach(({ definition, series: indicatorSeries }) =>
        paintIndicator(color, definition, indicatorSeries),
      );
      guides.forEach((line) =>
        line?.applyOptions({ color: color("--muted-foreground") }),
      );
    };
    paint();
    if (rangeRef.current) {
      chart.timeScale().setVisibleLogicalRange(rangeRef.current);
    } else {
      chart.timeScale().fitContent();
    }
    const keepRange = (range: LogicalRange | null) => {
      rangeRef.current = range;
    };
    chart.timeScale().subscribeVisibleLogicalRangeChange(keepRange);

    // The chart is drawn on a canvas, so CSS cannot recolor it. Watch the `dark` class that next-themes
    // sets on <html> and repaint with the new token colors – the zoom and position stay as they are.
    const observer = new MutationObserver(paint);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
      chart.timeScale().unsubscribeVisibleLogicalRangeChange(placeZones);
      chart.timeScale().unsubscribeVisibleLogicalRangeChange(keepRange);
      chart.timeScale().unsubscribeSizeChange(placeZones);
      chartRef.current = null;
      chart.remove();
    };
  }, [candles, annotations, indicators, locale]);

  return (
    <>
      <ChartZoomButtons chartRef={chartRef} points={candles.length} />
      <div
        role="img"
        aria-label={label}
        className={chartHeight({
          panels: panelCount(indicators),
        })}
      >
        <div ref={containerRef} className="absolute inset-0" />
        <div
          ref={zonesRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
        >
          {annotations.zones.map((zone) => (
            <div
              key={`${zone.from}-${zone.to}`}
              data-zone
              className="absolute top-0 border-x border-primary/40 bg-primary/10"
            >
              {zone.label && (
                <span className="absolute top-1 left-1.5 text-xs font-medium whitespace-nowrap text-foreground">
                  {zone.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

type IndicatorSeries = ISeriesApi<"Line"> | ISeriesApi<"Histogram">;

// Adds one indicator series in its pane: a line, dots (Parabolic SAR) or bars (volume, MACD).
function addIndicatorSeries(
  chart: IChartApi,
  definition: ChartSeries,
  pane: number,
  format: ChartIndicators["panels"][number]["format"],
): IndicatorSeries {
  const priceFormat =
    format === "percent"
      ? ({ type: "percent", precision: 1, minMove: 0.1 } as const)
      : format === "volume"
        ? ({ type: "volume" } as const)
        : undefined;
  const common = {
    priceLineVisible: false,
    lastValueVisible: false,
    ...(priceFormat && { priceFormat }),
  };
  if (definition.kind === "histogram") {
    return chart.addSeries(HistogramSeries, common, pane);
  }
  return chart.addSeries(
    LineSeries,
    {
      ...common,
      crosshairMarkerVisible: false,
      lineWidth: definition.dashed || definition.kind === "dots" ? 1 : 2,
      lineStyle: definition.dashed ? LineStyle.Dashed : LineStyle.Solid,
      lineVisible: definition.kind === "line",
      pointMarkersVisible: definition.kind === "dots",
      pointMarkersRadius: 1.5,
    },
    pane,
  );
}

// Sets the data with the current theme's colors.
function paintIndicator(
  color: ColorOf,
  definition: ChartSeries,
  series: IndicatorSeries,
) {
  // Bars are softened so they do not compete with the candles.
  const pointColor = (token: ChartToken) =>
    definition.kind === "histogram"
      ? withAlpha(color(token), 0.5)
      : color(token);
  series.applyOptions({ color: color(definition.color) });
  series.setData(
    definition.points.map((point) => ({
      time: point.time as UTCTimestamp,
      value: point.value,
      ...(point.hidden
        ? { color: "transparent" }
        : point.color && { color: pointColor(point.color) }),
    })),
  );
}

function applyColors(
  color: ColorOf,
  chart: IChartApi,
  series: ISeriesApi<"Candlestick">,
) {
  chart.applyOptions({
    layout: {
      background: { type: ColorType.Solid, color: color("--card") },
      textColor: color("--muted-foreground"),
      // Lines between the price, volume and RSI panels.
      panes: {
        separatorColor: color("--border"),
        separatorHoverColor: color("--border"),
      },
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

function colorAnnotations(
  color: ColorOf,
  annotations: ChartAnnotations,
  priceLines: IPriceLine[],
  markers: ISeriesMarkersPluginApi<Time>,
) {
  priceLines.forEach((line, index) => {
    const level = annotations.levels[index];
    if (level) {
      line.applyOptions({ color: color(LEVEL_TOKENS[level.kind]) });
    }
  });
  markers.setMarkers(
    annotations.markers.map((marker) => ({
      time: marker.time as UTCTimestamp,
      text: marker.label,
      ...MARKER_STYLES[marker.kind],
      color: color(MARKER_TOKENS[marker.kind]),
    })),
  );
}

// Moves every zone box between the x coordinates of its first and last candle.
function placeZoneBoxes(
  layer: HTMLElement,
  chart: IChartApi,
  candles: Candle[],
  zones: ChartAnnotations["zones"],
) {
  const timeScale = chart.timeScale();
  const width = timeScale.width();
  // The boxes cover the price panel only – not the volume or RSI panels, nor the dates.
  const height = chart.paneSize(0).height;
  const boxes = layer.querySelectorAll<HTMLElement>("[data-zone]");

  zones.forEach((zone, index) => {
    const box = boxes[index];
    if (!box) {
      return;
    }
    // Centers of the first and last candle. Candle indexes work also outside the visible range
    // (a coordinate can then be negative). Logical = candle index in lightweight-charts' own type;
    // it must be a whole number – fractional indexes return 0.
    const first = candles.findIndex((candle) => candle.time === zone.from);
    const last = candles.findIndex((candle) => candle.time === zone.to);
    const firstCenter = timeScale.logicalToCoordinate(first as Logical);
    const lastCenter = timeScale.logicalToCoordinate(last as Logical);
    if (firstCenter === null || lastCenter === null) {
      return;
    }
    // Extend by half a candle on both sides, so the box covers the whole first and last candle.
    const halfCandle = timeScale.options().barSpacing / 2;
    const left = firstCenter - halfCandle;
    const right = lastCenter + halfCandle;
    const start = Math.max(0, left);
    const end = Math.min(width, right);
    box.style.display = end > start ? "block" : "none";
    box.style.left = `${start}px`;
    box.style.width = `${end - start}px`;
    box.style.height = `${height}px`;
  });
}
