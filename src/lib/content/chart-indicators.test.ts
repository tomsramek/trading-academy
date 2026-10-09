import { describe, expect, it } from "vitest";

import { buildIndicators } from "./chart-indicators";

const candles = [...Array(60).keys()].map((step) => {
  const close = 100 + Math.sin(step / 5) * 10;
  return {
    time: step * 86_400,
    open: close - 1,
    high: close + 2,
    low: close - 2,
    close,
    volume: 10 + step,
  };
});

const legend = (key: string) => `legend:${key}`;

describe("buildIndicators", () => {
  it("draws nothing when no indicator is chosen", () => {
    expect(buildIndicators(undefined, candles, legend, "chart")).toEqual({
      overlays: [],
      panels: [],
    });
  });

  it("names averages by period and colors them in order", () => {
    const { overlays } = buildIndicators(
      { sma: [7], ema: [25], wma: [9] },
      candles,
      legend,
      "chart",
    );
    expect(overlays.map((overlay) => [overlay.label, overlay.color])).toEqual([
      ["SMA 7", "--chart-1"],
      ["EMA 25", "--chart-3"],
      ["WMA 9", "--chart-5"],
    ]);
  });

  it("stacks panels in a fixed order with their reference lines", () => {
    const { panels } = buildIndicators(
      { mfi: true, macd: true, rsi: true },
      candles,
      legend,
      "chart",
    );
    expect(panels.map((panel) => [panel.label, panel.guides])).toEqual([
      ["legend:rsi", [70, 30]],
      ["legend:macd", [0]],
      ["legend:mfi", [80, 20]],
    ]);
  });

  it("draws Supertrend green and red, hiding the jump where it flips", () => {
    const { overlays } = buildIndicators(
      { supertrend: true },
      candles,
      legend,
      "chart",
    );
    const points = overlays[0]?.series[0]?.points ?? [];
    expect(new Set(points.map((point) => point.color))).toEqual(
      new Set(["--bull", "--bear"]),
    );
    points.forEach((point, index) => {
      const flipped = index > 0 && points[index - 1]?.color !== point.color;
      expect(point.hidden).toBe(flipped);
    });
  });

  it("colors volume bars by the candle direction", () => {
    const { panels } = buildIndicators(
      { volume: true },
      candles,
      legend,
      "chart",
    );
    const bars = panels[0]?.series[0]?.points ?? [];
    // Every test candle closes above its open.
    expect(bars.every((bar) => bar.color === "--bull")).toBe(true);
  });

  it("stops the build when an indicator needs volume the data does not have", () => {
    const withoutVolume = candles.map((candle) => ({
      ...candle,
      volume: undefined,
    }));
    expect(() =>
      buildIndicators({ mfi: true }, withoutVolume, legend, "BTC chart"),
    ).toThrow(/BTC chart.*no volume/);
  });

  it("stops the build with more than three panels or averages", () => {
    expect(() =>
      buildIndicators(
        { rsi: true, macd: true, cci: true, obv: true },
        candles,
        legend,
        "chart",
      ),
    ).toThrow(/at most three panels/);
    expect(() =>
      buildIndicators({ sma: [7, 25], ema: [9, 21] }, candles, legend, "chart"),
    ).toThrow(/at most three moving averages/);
  });

  it("rejects a typo in an indicator name", () => {
    expect(() =>
      buildIndicators(
        // @ts-expect-error – a typo written in MDX, which is not type-checked.
        { macdd: true },
        candles,
        legend,
        "chart",
      ),
    ).toThrow(/macdd/);
  });
});
