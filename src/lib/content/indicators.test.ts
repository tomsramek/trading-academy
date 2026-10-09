import { describe, expect, it } from "vitest";

import {
  atrPercent,
  bollinger,
  cci,
  ema,
  kdj,
  macd,
  mfi,
  obv,
  parabolicSar,
  rsi,
  sma,
  stochastic,
  stochRsi,
  supertrend,
  vwap,
  williamsR,
  wma,
} from "./indicators";

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

// Candles with a high, low and close; volume 1 unless given.
function bars(
  rows: [high: number, low: number, close: number, volume?: number][],
) {
  return rows.map(([high, low, close, volume = 1], index) => ({
    time: index * 86_400,
    open: close,
    high,
    low,
    close,
    volume,
  }));
}

// A steady rise and then a steady fall – every trend indicator must flip somewhere in between.
const RISE_AND_FALL = bars(
  [...Array(30).keys()].map((step) => {
    const close = step < 15 ? 100 + step * 2 : 128 - (step - 15) * 2;
    return [close + 1, close - 1, close];
  }),
);

describe("wma", () => {
  it("weighs the newest close the most", () => {
    // (1 · 1 + 2 · 2 + 3 · 3) / 6
    expect(values(wma(closes([1, 2, 3]), 3))).toEqual([14 / 6]);
  });
});

describe("bollinger", () => {
  it("puts the bands two population standard deviations from the average", () => {
    const { upper, middle, lower } = bollinger(closes([1, 2, 3]), 3, 2);
    const deviation = Math.sqrt(2 / 3);
    expect(middle[0]?.value).toBe(2);
    expect(upper[0]?.value).toBeCloseTo(2 + 2 * deviation);
    expect(lower[0]?.value).toBeCloseTo(2 - 2 * deviation);
  });
});

describe("vwap", () => {
  it("weighs typical prices by volume over the last `period` candles, as on Binance", () => {
    const candles = [
      { time: 0, high: 3, low: 1, close: 2, volume: 1 },
      { time: 3_600, high: 5, low: 3, close: 4, volume: 3 },
      { time: 86_400, high: 11, low: 9, close: 10, volume: 5 },
    ];
    // Period 2: (2 · 1 + 4 · 3) / 4 = 3.5, then (4 · 3 + 10 · 5) / 8 = 7.75 – no daily restart.
    expect(values(vwap(candles, 2))).toEqual([3.5, 7.75]);
  });
});

describe("parabolicSar", () => {
  it("trails below a rising price and flips above it when the price turns", () => {
    const points = parabolicSar(RISE_AND_FALL);
    const rising = points.slice(0, 10);
    expect(rising.every((point) => point.up)).toBe(true);
    rising.forEach((point, index) => {
      expect(point.value).toBeLessThan(RISE_AND_FALL[index + 1]?.low ?? 0);
    });
    expect(points.at(-1)?.up).toBe(false);
    expect(points.at(-1)?.value).toBeGreaterThan(
      RISE_AND_FALL.at(-1)?.high ?? 0,
    );
  });
});

describe("supertrend", () => {
  it("sits below the price in the rise and above it in the fall", () => {
    const points = supertrend(RISE_AND_FALL, 3, 2);
    const last = points.at(-1);
    expect(points.some((point) => point.up)).toBe(true);
    expect(last?.up).toBe(false);
    expect(last?.value).toBeGreaterThan(RISE_AND_FALL.at(-1)?.close ?? 0);
    // In the rise the line is under the close.
    const rise = points.filter((point) => point.time < 14 * 86_400 && point.up);
    rise.forEach((point) => {
      const candle = RISE_AND_FALL.find((bar) => bar.time === point.time);
      expect(point.value).toBeLessThan(candle?.close ?? 0);
    });
  });
});

describe("macd", () => {
  it("is the fast EMA minus the slow EMA, with a signal line and histogram", () => {
    const candles = closes(
      [...Array(40).keys()].map((step) => 100 + step ** 1.5),
    );
    const result = macd(candles, 3, 6, 4);
    const fast = ema(candles, 3);
    const slow = ema(candles, 6);
    const last = result.macd.at(-1);
    expect(last?.value).toBeCloseTo(
      (fast.at(-1)?.value ?? 0) - (slow.at(-1)?.value ?? 0),
    );
    const signal = result.signal.at(-1)?.value ?? 0;
    expect(result.histogram.at(-1)?.value).toBeCloseTo(
      (last?.value ?? 0) - signal,
    );
    // The signal needs four MACD values first.
    expect(result.signal).toHaveLength(result.macd.length - 3);
  });

  it("is zero for a flat price", () => {
    const flat = macd(closes(Array(40).fill(100)));
    expect(flat.macd.every((point) => point.value === 0)).toBe(true);
  });
});

describe("stochastic family", () => {
  const atHighs = bars([
    [10, 8, 9],
    [11, 9, 11],
    [12, 10, 12],
    [13, 11, 13],
  ]);

  it("stochastic is 100 when the close is the highest high", () => {
    expect(values(stochastic(atHighs, 3, 1, 1).k)).toEqual([100, 100]);
  });

  it("Williams %R is 0 at the high and −100 at the low", () => {
    const atLow = bars([
      [10, 8, 9],
      [11, 9, 10],
      [12, 7, 7],
    ]);
    expect(values(williamsR(atHighs, 3))).toEqual([0, 0]);
    expect(values(williamsR(atLow, 3))).toEqual([-100]);
  });

  it("KDJ smooths K and D by thirds from 50 and runs J ahead", () => {
    const { k, d, j } = kdj(atHighs, 3, 3, 3);
    // RSV 100: K = (2 · 50 + 100) / 3, D = (2 · 50 + K) / 3, J = 3K − 2D.
    const firstK = 200 / 3;
    const firstD = (100 + firstK) / 3;
    expect(k[0]?.value).toBeCloseTo(firstK);
    expect(d[0]?.value).toBeCloseTo(firstD);
    expect(j[0]?.value).toBeCloseTo(3 * firstK - 2 * firstD);
  });

  it("stochastic RSI stays between 0 and 100 and lines up with the candles", () => {
    const candles = closes(RISE_AND_FALL.map((bar) => bar.close));
    const { k, d } = stochRsi(candles, 5, 5, 3, 3);
    expect(k.length).toBeGreaterThan(0);
    [...k, ...d].forEach((point) => {
      expect(point.value).toBeGreaterThanOrEqual(0);
      expect(point.value).toBeLessThanOrEqual(100);
    });
    // RSI 5 starts on candle 5, the stochastic needs 5 RSI values, %K 3 of those.
    expect(k[0]?.time).toBe((5 + 4 + 2) * 86_400);
  });
});

describe("cci", () => {
  it("measures the distance from the average in mean deviations", () => {
    // Typical prices 1, 2, 3: average 2, mean deviation 2/3 → (3 − 2) / (0.015 · 2/3) = 100.
    const candles = bars([
      [1, 1, 1],
      [2, 2, 2],
      [3, 3, 3],
    ]);
    expect(cci(candles, 3)[0]?.value).toBeCloseTo(100);
  });
});

describe("obv", () => {
  it("adds volume on up closes and subtracts it on down closes", () => {
    const candles = bars([
      [10, 10, 10, 5],
      [11, 11, 11, 2],
      [9, 9, 9, 3],
      [9, 9, 9, 4],
    ]);
    expect(values(obv(candles))).toEqual([0, 2, -1, -1]);
  });
});

describe("mfi", () => {
  it("is 100 when money only flows in", () => {
    const candles = bars([
      [1, 1, 1],
      [2, 2, 2],
      [3, 3, 3],
    ]);
    expect(values(mfi(candles, 2))).toEqual([100]);
  });

  it("weighs the flows by volume", () => {
    // Up 1 → 2 with volume 3 (money 6), down 2 → 1 with volume 1 (money 1): ratio 6 → 100 − 100 / 7.
    const candles = bars([
      [1, 1, 1],
      [2, 2, 2, 3],
      [1, 1, 1, 1],
    ]);
    expect(mfi(candles, 2)[0]?.value).toBeCloseTo(100 - 100 / 7);
  });
});
