import { describe, expect, it } from "vitest";

import { atrPercent, ema, rsi, sma } from "./indicators";

// Candles one day apart; only the fields an indicator needs.
function closes(values: number[]) {
  return values.map((close, index) => ({ time: index * 86_400, close }));
}

function values(points: { value: number }[]) {
  return points.map((point) => point.value);
}

describe("sma", () => {
  it("averages the last `period` closes and starts on the period-th candle", () => {
    const points = sma(closes([1, 2, 3, 4, 5]), 3);
    expect(values(points)).toEqual([2, 3, 4]);
    expect(points[0]?.time).toBe(2 * 86_400);
  });

  it("returns nothing when there are fewer candles than the period", () => {
    expect(sma(closes([1, 2]), 3)).toEqual([]);
  });
});

describe("ema", () => {
  it("starts from the simple average and then weighs recent closes more", () => {
    // Weight 2 / (3 + 1) = 0.5: 2 → 4 · 0.5 + 2 · 0.5 = 3 → 10 · 0.5 + 3 · 0.5 = 6.5.
    expect(values(ema(closes([1, 2, 3, 4, 10]), 3))).toEqual([2, 3, 6.5]);
  });
});

describe("rsi", () => {
  it("is 100 when the price only rises", () => {
    expect(values(rsi(closes([1, 2, 3, 4, 5]), 3))).toEqual([100, 100]);
  });

  it("is 50 when rises and falls are equal", () => {
    // Changes +1, −1, +1, −1: the average gain and loss are both 2 / 4.
    const [first] = rsi(closes([10, 11, 10, 11, 10]), 4);
    expect(first?.value).toBeCloseTo(50);
  });

  it("smooths later values the Wilder way", () => {
    // Period 2: changes +2, −2 → gain 1, loss 1 → 50. Next change +2: gain (1 + 2) / 2 = 1.5, loss 0.5 → 75.
    expect(values(rsi(closes([10, 12, 10, 12]), 2))).toEqual([50, 75]);
  });
});

describe("atrPercent", () => {
  it("uses the true range including gaps from the previous close", () => {
    const bars = [
      { time: 0, high: 11, low: 9, close: 10 },
      // A gap up: high − previous close (14 − 10 = 4) beats high − low (14 − 12 = 2).
      { time: 1, high: 14, low: 12, close: 13 },
    ];
    // Period 2: (2 + 4) / 2 = 3, as a percentage of the close 13.
    const [point] = atrPercent(bars, 2);
    expect(point?.value).toBeCloseTo((3 / 13) * 100);
  });
});
