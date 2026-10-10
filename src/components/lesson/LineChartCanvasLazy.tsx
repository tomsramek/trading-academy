"use client";

import { lazy, Suspense, type ComponentProps } from "react";

// The chart library (lightweight-charts) is loaded only on pages that draw a chart – see
// CandleChartCanvasLazy.
const LineChartCanvas = lazy(() =>
  import("./LineChartCanvas").then((module) => ({
    default: module.LineChartCanvas,
  })),
);

type LineChartCanvasLazyProps = ComponentProps<typeof LineChartCanvas>;

export function LineChartCanvasLazy(props: LineChartCanvasLazyProps) {
  return (
    <Suspense
      fallback={
        // The zoom buttons and the chart box at their final size, so nothing jumps.
        <>
          <div className="mb-2 h-8" />
          <div className="h-72 rounded-lg border border-border bg-card sm:h-80" />
        </>
      }
    >
      <LineChartCanvas {...props} />
    </Suspense>
  );
}
