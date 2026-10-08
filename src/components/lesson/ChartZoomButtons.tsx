"use client";

import type { RefObject } from "react";
import type { IChartApi } from "lightweight-charts";
import { Maximize2Icon, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

type ChartZoomButtonsProps = {
  // The chart lives outside React (a canvas); the buttons reach it through this ref.
  chartRef: RefObject<IChartApi | null>;
  // Number of data points, so zooming out stops a little past the whole chart.
  points: number;
};

// Zoom without gestures – not everyone knows about pinching or dragging the axes. Shared by all lesson
// charts.
export function ChartZoomButtons({ chartRef, points }: ChartZoomButtonsProps) {
  const t = useTranslations("Lesson.chart");

  // Zooms around the middle of the visible part: factor < 1 zooms in, > 1 out.
  const zoom = (factor: number) => {
    const timeScale = chartRef.current?.timeScale();
    const range = timeScale?.getVisibleLogicalRange();
    if (!timeScale || !range) {
      return;
    }
    const center = (range.from + range.to) / 2;
    // At least 10 points stay visible, and zooming out stops a little past the whole chart.
    const half = Math.min(
      Math.max(((range.to - range.from) / 2) * factor, 5),
      points * 0.6,
    );
    timeScale.setVisibleLogicalRange({
      from: center - half,
      to: center + half,
    });
  };

  return (
    <div className="mb-2 flex justify-end gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() => zoom(0.6)}
        aria-label={t("zoomIn")}
        title={t("zoomIn")}
      >
        <ZoomInIcon aria-hidden="true" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => zoom(1 / 0.6)}
        aria-label={t("zoomOut")}
        title={t("zoomOut")}
      >
        <ZoomOutIcon aria-hidden="true" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => chartRef.current?.timeScale().fitContent()}
        aria-label={t("zoomReset")}
        title={t("zoomReset")}
      >
        <Maximize2Icon aria-hidden="true" />
      </Button>
    </div>
  );
}
