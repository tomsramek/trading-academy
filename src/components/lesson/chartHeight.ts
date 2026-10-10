import { cva } from "class-variance-authority";

import type { ChartIndicators } from "@/lib/content/chart";

// Height of a candlestick chart – taller when indicators get their own panels under the price. Shared
// by the chart and its placeholder while the chart code loads, so nothing jumps.
export const chartHeight = cva(
  "relative overflow-hidden rounded-lg border border-border bg-card",
  {
    variants: {
      panels: {
        0: "h-80 sm:h-96",
        1: "h-96 sm:h-112",
        2: "h-112 sm:h-128",
        3: "h-128 sm:h-144",
      },
    },
  },
);

export function panelCount(indicators: ChartIndicators): 0 | 1 | 2 | 3 {
  return Math.min(indicators.panels.length, 3) as 0 | 1 | 2 | 3;
}
