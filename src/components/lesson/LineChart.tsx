import { useTranslations } from "next-intl";
import { z } from "zod";

import {
  lineChartSchema,
  toTimestamp,
  type LineChartInput,
} from "@/lib/content/chart";
import type { IndicatorPoint } from "@/lib/content/indicators";
import { cn } from "@/lib/utils";

import { ChartSource } from "./ChartSource";
import { LineChartCanvas } from "./LineChartCanvas";

// Shape of the JSON files for line charts: named series of { time, value } points.
export type LineDataset = {
  series: Record<string, IndicatorPoint[]>;
  source?: string;
  license?: string;
};

type LineChartProps = LineChartInput & {
  data: LineDataset;
  // What the chart shows – read by screen readers instead of the drawing.
  label: string;
  caption?: string;
};

// The --chart-N token of each line, in order.
const LINE_COLORS = [1, 3, 5, 2] as const;

const SWATCH = {
  1: "bg-chart-1",
  2: "bg-chart-2",
  3: "bg-chart-3",
  5: "bg-chart-5",
} as const;

// Line chart in a lesson – an equity curve of a backtest, markets side by side, a funding rate:
//   import results from "./backtest.json";
//   <LineChart data={results} lines={[{ key: "buyHold", label: "Buy and hold" }]} label="…" logarithmic />
export function LineChart({
  data,
  label,
  caption,
  lines,
  logarithmic,
  percent,
  markers,
}: LineChartProps) {
  const t = useTranslations("Lesson.chart");
  const result = lineChartSchema.safeParse({
    lines,
    logarithmic,
    percent,
    markers,
  });
  if (!result.success) {
    throw new Error(
      `Invalid <LineChart label="${label}">:\n${z.prettifyError(result.error)}`,
    );
  }

  const drawn = result.data.lines.map((line, index) => {
    const points = data.series[line.key];
    if (!points) {
      throw new Error(
        `Invalid <LineChart label="${label}">: the data has no series "${line.key}"`,
      );
    }
    return { label: line.label, color: LINE_COLORS[index] ?? 1, points };
  });
  const times = new Set(drawn[0]?.points.map((point) => point.time));
  const drawnMarkers = result.data.markers.map((marker) => {
    const time = toTimestamp(marker.time);
    if (!times.has(time)) {
      throw new Error(
        `Invalid <LineChart label="${label}">: ${marker.time} is not in the first line`,
      );
    }
    return { time, label: marker.label };
  });

  return (
    <figure className="not-prose my-8">
      <LineChartCanvas
        lines={drawn}
        label={label}
        logarithmic={result.data.logarithmic}
        percent={result.data.percent}
        markers={drawnMarkers}
      />
      <figcaption className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {drawn.map((line) => (
            <li key={line.label} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className={cn("h-0.5 w-4 rounded-full", SWATCH[line.color])}
              />
              {line.label}
            </li>
          ))}
          {result.data.logarithmic && <li>{t("logarithmic")}</li>}
        </ul>
        {caption && <span>{caption}</span>}
        <ChartSource source={data.source} license={data.license} />
      </figcaption>
    </figure>
  );
}
