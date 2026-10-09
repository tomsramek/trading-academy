import { describe, expect, it } from "vitest";

import btc from "@content/market-data/btcusdt-1d-2023-10-2024-12.json";

import { buildIndicatorSteps, type StepIndicator } from "./indicator-steps";

const candles = btc.candles;

function stepsOf(indicator: StepIndicator, from = "2024-03-01") {
  return buildIndicatorSteps({ indicator, from, label: "test" }, candles);
}

describe("buildIndicatorSteps", () => {
  it("shows the first window whole and then 24 steps", () => {
    const data = stepsOf("sma");
    // SMA 7: six candles of lead-in, then 24 steps.
    expect(data.candles).toHaveLength(30);
    expect(new Date((data.candles[0]?.time ?? 0) * 1000).toISOString()).toMatch(
      /^2024-03-01/,
    );
    expect(data.steps).toHaveLength(24);
    expect(data.steps[0]?.window).toEqual([0, 6]);
  });

  it("starts with the first candle when the value needs no window", () => {
    const data = stepsOf("macd");
    expect(data.candles).toHaveLength(24);
    expect(data.steps[0]?.candle).toBe(0);
  });

  it("SMA: the value is the mean of the closes in the window", () => {
    const data = stepsOf("sma");
    for (const step of data.steps) {
      const index = candles.findIndex(
        (candle) => candle.time === data.candles[step.candle]?.time,
      );
      const window = candles.slice(index - data.period + 1, index + 1);
      const mean =
        window.reduce((sum, candle) => sum + candle.close, 0) / data.period;
      expect(step.values.value).toBeCloseTo(mean, 6);
      expect(step.values.sum).toBeCloseTo(mean * data.period, 4);
    }
  });

  it("EMA: each value moves a weight's share of the way to the close", () => {
    for (const { values } of stepsOf("ema").steps) {
      const { previous = 0, close = 0, weight = 0, value } = values;
      expect(value).toBeCloseTo(previous + weight * (close - previous), 6);
    }
  });

  it("Bollinger: the bands are two deviations from the middle", () => {
    for (const { values } of stepsOf("bollinger").steps) {
      const { middle = 0, deviation = 0 } = values;
      expect(values.upper).toBeCloseTo(middle + 2 * deviation, 6);
      expect(values.lower).toBeCloseTo(middle - 2 * deviation, 6);
    }
  });

  it("RSI: the value follows from the average gain and loss", () => {
    for (const { values } of stepsOf("rsi").steps) {
      const { gain = 0, loss = 1 } = values;
      expect(values.value).toBeCloseTo(100 - 100 / (1 + gain / loss), 6);
    }
  });

  it("MACD: the fast minus the slow EMA, the histogram minus the signal", () => {
    for (const { values } of stepsOf("macd").steps) {
      const { fast = 0, slow = 0, macd = 0, signal = 0 } = values;
      expect(macd).toBeCloseTo(fast - slow, 6);
      expect(values.histogram).toBeCloseTo(macd - signal, 6);
    }
  });

  it("Stochastic: where the close sits between the lowest low and the highest high", () => {
    for (const step of stepsOf("stochastic").steps) {
      const { high = 0, low = 0, close = 0 } = step.values;
      expect(step.values.value).toBeCloseTo(
        ((close - low) / (high - low)) * 100,
        6,
      );
      expect(step.levels?.map((level) => level.price)).toEqual([high, low]);
    }
  });

  it("ATR: Wilder's average of the true range", () => {
    for (const { values } of stepsOf("atr").steps) {
      const { range = 0, upGap = 0, downGap = 0, previous = 0 } = values;
      expect(values.trueRange).toBe(Math.max(range, upGap, downGap));
      expect(values.value).toBeCloseTo(
        (previous * 13 + (values.trueRange ?? 0)) / 14,
        6,
      );
    }
  });

  it("OBV: adds the volume on an up close and subtracts it on a down close", () => {
    for (const { values, variant } of stepsOf("obv").steps) {
      const { previous = 0, volume = 0 } = values;
      const change =
        variant === "up" ? volume : variant === "down" ? -volume : 0;
      expect(values.value).toBeCloseTo(previous + change, 6);
    }
  });

  it("explains the first value differently when the chart starts with it", () => {
    const data = buildIndicatorSteps(
      { indicator: "ema", period: 5, candles: 12, label: "test" },
      candles,
    );
    expect(data.steps[0]?.variant).toBe("first");
    expect(data.steps[0]?.candle).toBe(4);
    expect(data.steps[1]?.variant).toBe("next");
  });

  it("stops the build when the start date is not in the data", () => {
    expect(() =>
      buildIndicatorSteps(
        { indicator: "sma", from: "2019-01-01", label: "Bad chart" },
        candles,
      ),
    ).toThrow(/Bad chart.*2019-01-01/);
  });
});
