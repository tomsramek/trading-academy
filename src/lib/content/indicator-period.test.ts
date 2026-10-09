import { describe, expect, it } from "vitest";

import btc from "@content/market-data/btcusdt-1d-2023-10-2024-12.json";

import {
  PERIOD_INDICATORS,
  periodIndicator,
  periodSignals,
  type PeriodIndicator,
} from "./indicator-period";

const candles = btc.candles;

function signals(indicator: PeriodIndicator, period: number) {
  return periodSignals(
    indicator,
    candles,
    periodIndicator(indicator, candles, period),
  );
}

function count(indicator: PeriodIndicator, period: number) {
  const result = signals(indicator, period);
  return "count" in result ? result.count : Number.NaN;
}

describe("periodIndicator", () => {
  it("names the line by its period", () => {
    expect(periodIndicator("ema", candles, 9).overlays[0]?.label).toBe("EMA 9");
    expect(periodIndicator("rsi", candles, 6).panels[0]?.label).toBe("RSI 6");
  });

  it("draws every indicator with values", () => {
    for (const indicator of PERIOD_INDICATORS) {
      const drawn = periodIndicator(indicator, candles, 10);
      const series = (drawn.overlays[0] ?? drawn.panels[0])?.series[0];
      expect(series?.points.length, indicator).toBeGreaterThan(300);
    }
  });
});

describe("periodSignals", () => {
  it("a shorter average is crossed by the price more often", () => {
    expect(count("sma", 7)).toBeGreaterThan(count("sma", 50));
    expect(count("ema", 7)).toBeGreaterThan(count("ema", 50));
  });

  it("a shorter RSI enters the 70/30 zones more often", () => {
    expect(count("rsi", 6)).toBeGreaterThan(count("rsi", 30));
  });

  it("counts a crossing only when the line goes from one side to the other", () => {
    const flat = [100, 101, 99, 101, 99].map((close, index) => ({
      time: index * 86_400,
      open: close,
      high: close,
      low: close,
      close,
    }));
    // SMA 2: 100.5, 100, 100, 100 – the closes 101, 99, 101, 99 cross it three times.
    expect(periodSignals("sma", flat, periodIndicator("sma", flat, 2))).toEqual(
      { kind: "crosses", count: 3 },
    );
  });

  it("gives ATR as the average range in percent", () => {
    const result = signals("atr", 14);
    expect(result.kind).toBe("range");
    if (result.kind === "range") {
      // Bitcoin moved roughly 2–5 % a day in 2023–2024.
      expect(result.average).toBeGreaterThan(1);
      expect(result.average).toBeLessThan(8);
    }
  });
});
