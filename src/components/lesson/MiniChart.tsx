import type { ChartToken } from "@/lib/content/chart";
import type { StepLine } from "@/lib/content/indicator-steps";
import { cn } from "@/lib/utils";

import { SvgCandle } from "./SvgCandle";

type MiniCandle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

type MiniChartProps = {
  candles: MiniCandle[];
  // Lines over the candles and in the panel under them, one value per candle.
  overlay?: StepLine[];
  panel?: {
    lines: StepLine[];
    bars?: (number | null)[];
    guides: number[];
  };
  // Lines are drawn only up to this candle – they grow step by step. Without it they are complete.
  drawnUntil?: number;
  // Highlighted candles the current value is computed from.
  highlight?: [number, number];
  // The candle of the current step: a dot on each of its line values.
  focus?: number;
  // Horizontal lines over the window, e.g. the highest high and the lowest low.
  levels?: { price: number; kind: "high" | "low" }[];
  // Chart quiz: the chosen candle and, after checking, the first and last right candle.
  selected?: number;
  answer?: [number, number];
  onCandleClick?: (index: number) => void;
};

// Size of the drawing in SVG units; the SVG scales to the width of the page.
const WIDTH = 480;
const PRICE_HEIGHT = 200;
const PANEL_GAP = 12;
const PANEL_HEIGHT = 84;
const PADDING = 8;

const STROKE: Record<ChartToken, string> = {
  "--chart-1": "stroke-chart-1",
  "--chart-2": "stroke-chart-2",
  "--chart-3": "stroke-chart-3",
  "--chart-4": "stroke-chart-4",
  "--chart-5": "stroke-chart-5",
  "--bull": "stroke-bull",
  "--bear": "stroke-bear",
};

const FILL: Record<ChartToken, string> = {
  "--chart-1": "fill-chart-1",
  "--chart-2": "fill-chart-2",
  "--chart-3": "fill-chart-3",
  "--chart-4": "fill-chart-4",
  "--chart-5": "fill-chart-5",
  "--bull": "fill-bull",
  "--bear": "fill-bear",
};

const LEVEL_STROKE = { high: "stroke-bull", low: "stroke-bear" } as const;

// A linear scale from [min, max] to [bottom, top] in SVG units, with a little room around.
function scale(values: number[], top: number, bottom: number) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const room = (max - min || Math.abs(max) || 1) * 0.06;
  const low = min - room;
  const high = max + room;
  return (value: number) =>
    bottom - ((value - low) / (high - low)) * (bottom - top);
}

// SVG path through the defined values; a missing value breaks the line.
function linePath(
  values: (number | null)[],
  x: (index: number) => number,
  y: (value: number) => number,
  until: number,
) {
  let path = "";
  let drawing = false;
  values.forEach((value, index) => {
    if (value === null || index > until) {
      drawing = false;
      return;
    }
    path += `${drawing ? "L" : "M"}${x(index).toFixed(1)} ${y(value).toFixed(1)} `;
    drawing = true;
  });
  return path.trim();
}

// A small candlestick chart drawn as SVG, for explanations and the chart quiz. It has no axes or
// numbers – they would be unreadable on a phone; the text next to it carries the values.
export function MiniChart({
  candles,
  overlay = [],
  panel,
  drawnUntil,
  highlight,
  focus,
  levels = [],
  selected,
  answer,
  onCandleClick,
}: MiniChartProps) {
  const until = drawnUntil ?? candles.length - 1;
  const slot = (WIDTH - PADDING * 2) / candles.length;
  const x = (index: number) => PADDING + slot * (index + 0.5);
  const height = panel ? PRICE_HEIGHT + PANEL_GAP + PANEL_HEIGHT : PRICE_HEIGHT;

  const overlayValues = overlay.flatMap((line) =>
    line.values.filter((value): value is number => value !== null),
  );
  const y = scale(
    [
      ...candles.flatMap((candle) => [candle.high, candle.low]),
      ...overlayValues,
      ...levels.map((level) => level.price),
    ],
    PADDING,
    PRICE_HEIGHT - PADDING,
  );

  const panelTop = PRICE_HEIGHT + PANEL_GAP;
  const panelValues = panel
    ? [
        ...panel.lines.flatMap((line) =>
          line.values.filter((value): value is number => value !== null),
        ),
        ...(panel.bars ?? []).filter(
          (value): value is number => value !== null,
        ),
        ...panel.guides,
      ]
    : [];
  const panelY = scale(
    panelValues.length > 0 ? panelValues : [0, 1],
    panelTop + 4,
    panelTop + PANEL_HEIGHT - 4,
  );

  const dot = (line: StepLine, at: (value: number) => number) => {
    if (focus === undefined) {
      return null;
    }
    const value = line.values[focus];
    return value === null || value === undefined ? null : (
      <circle
        cx={x(focus)}
        cy={at(value)}
        r={4}
        className={cn(FILL[line.color], "stroke-card")}
        strokeWidth={1.5}
      />
    );
  };

  const outline = (from: number, to: number, className: string) => (
    <rect
      x={x(from) - slot / 2 + 1}
      y={PADDING / 2}
      width={slot * (to - from + 1) - 2}
      height={PRICE_HEIGHT - PADDING}
      rx={4}
      className={cn("fill-none", className)}
      strokeWidth={2}
    />
  );

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${height}`}
      className="h-auto w-full"
      aria-hidden="true"
    >
      <rect
        width={WIDTH}
        height={PRICE_HEIGHT}
        rx={8}
        className="fill-card stroke-border"
      />
      {panel && (
        <rect
          y={panelTop}
          width={WIDTH}
          height={PANEL_HEIGHT}
          rx={8}
          className="fill-card stroke-border"
        />
      )}

      {highlight && (
        <rect
          x={x(highlight[0]) - slot / 2}
          y={1}
          width={slot * (highlight[1] - highlight[0] + 1)}
          height={height - 2}
          rx={4}
          className="fill-primary/10 stroke-primary/50"
        />
      )}

      {candles.map((candle, index) => (
        <SvgCandle
          key={candle.time}
          candle={candle}
          x={x(index)}
          width={Math.max(slot * 0.6, 2)}
          y={y}
          className={cn(
            highlight &&
              (index < highlight[0] || index > highlight[1]) &&
              "opacity-40",
          )}
        />
      ))}

      {highlight &&
        levels.map((level) => (
          <line
            key={level.kind}
            x1={x(highlight[0]) - slot / 2}
            x2={x(highlight[1]) + slot / 2}
            y1={y(level.price)}
            y2={y(level.price)}
            className={LEVEL_STROKE[level.kind]}
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
        ))}

      {overlay.map((line, index) => (
        <path
          key={`overlay-${index}`}
          d={linePath(line.values, x, y, until)}
          className={cn("fill-none", STROKE[line.color])}
          strokeWidth={line.dashed ? 1.5 : 2.5}
          strokeDasharray={line.dashed ? "5 4" : undefined}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}
      {overlay.map((line, index) => (
        <g key={`overlay-dot-${index}`}>{dot(line, y)}</g>
      ))}

      {panel && (
        <>
          {panel.guides.map((guide) => (
            <line
              key={guide}
              x1={0}
              x2={WIDTH}
              y1={panelY(guide)}
              y2={panelY(guide)}
              className="stroke-muted-foreground/60"
              strokeDasharray="3 3"
            />
          ))}
          {(panel.bars ?? []).map((bar, index) =>
            bar === null || index > until ? null : (
              <rect
                key={candles[index]?.time ?? index}
                x={x(index) - slot * 0.3}
                y={Math.min(panelY(bar), panelY(0))}
                width={slot * 0.6}
                height={Math.max(Math.abs(panelY(bar) - panelY(0)), 1)}
                className={bar >= 0 ? "fill-bull/50" : "fill-bear/50"}
              />
            ),
          )}
          {panel.lines.map((line, index) => (
            <path
              key={`panel-${index}`}
              d={linePath(line.values, x, panelY, until)}
              className={cn("fill-none", STROKE[line.color])}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
          {panel.lines.map((line, index) => (
            <g key={`panel-dot-${index}`}>{dot(line, panelY)}</g>
          ))}
        </>
      )}

      {selected !== undefined &&
        !(answer && selected >= answer[0] && selected <= answer[1]) &&
        outline(
          selected,
          selected,
          answer === undefined ? "stroke-primary" : "stroke-bear",
        )}
      {answer && outline(answer[0], answer[1], "stroke-bull")}

      {onCandleClick &&
        candles.map((candle, index) => (
          <rect
            key={`hit-${candle.time}`}
            x={x(index) - slot / 2}
            y={0}
            width={slot}
            height={height}
            className="cursor-pointer fill-transparent"
            onClick={() => onCandleClick(index)}
          />
        ))}
    </svg>
  );
}
