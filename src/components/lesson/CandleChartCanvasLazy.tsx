"use client";

import { lazy, Suspense, type ComponentProps } from "react";

import { chartHeight, panelCount } from "./chartHeight";

// The chart library (lightweight-charts) is loaded only on pages that draw a chart. A server component
// importing the canvas directly would put it into every lesson – the lesson page includes all lessons.
const CandleChartCanvas = lazy(() =>
  import("./CandleChartCanvas").then((module) => ({
    default: module.CandleChartCanvas,
  })),
);

type CandleChartCanvasLazyProps = ComponentProps<typeof CandleChartCanvas>;

export function CandleChartCanvasLazy(props: CandleChartCanvasLazyProps) {
  return (
    <Suspense
      fallback={
        // The zoom buttons and the chart box at their final size, so nothing jumps.
        <>
          <div className="mb-2 h-8" />
          <div
            className={chartHeight({ panels: panelCount(props.indicators) })}
          />
        </>
      }
    >
      <CandleChartCanvas {...props} />
    </Suspense>
  );
}
