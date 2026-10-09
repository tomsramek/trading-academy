/*
 * Indicators drawn over lesson charts, computed from the candles at build time.
 * Each value belongs to the candle with the same time; the first candles have no value until there is
 * enough history (a 50-day average starts on the 50th candle).
 */

export type IndicatorPoint = { time: number; value: number };

type Closes = { time: number; close: number }[];

/** Simple moving average: the mean of the last `period` closes. */
export function sma(candles: Closes, period: number): IndicatorPoint[] {
  const points: IndicatorPoint[] = [];
  let sum = 0;
  candles.forEach((candle, index) => {
    sum += candle.close;
    const dropped = candles[index - period];
    if (dropped) {
      sum -= dropped.close;
    }
    if (index >= period - 1) {
      points.push({ time: candle.time, value: sum / period });
    }
  });
  return points;
}

/** Exponential moving average: recent closes weigh more. Starts from the simple average. */
export function ema(candles: Closes, period: number): IndicatorPoint[] {
  const weight = 2 / (period + 1);
  const [first] = sma(candles.slice(0, period), period);
  if (!first) {
    return [];
  }
  const points: IndicatorPoint[] = [first];
  let value = first.value;
  for (const candle of candles.slice(period)) {
    value = candle.close * weight + value * (1 - weight);
    points.push({ time: candle.time, value });
  }
  return points;
}

/** Relative strength index (Wilder): 0–100, how strong the recent rises were against the falls. */
export function rsi(candles: Closes, period = 14): IndicatorPoint[] {
  const points: IndicatorPoint[] = [];
  let gain = 0;
  let loss = 0;
  candles.forEach((candle, index) => {
    const previous = candles[index - 1];
    if (!previous) {
      return;
    }
    const change = candle.close - previous.close;
    const up = Math.max(change, 0);
    const down = Math.max(-change, 0);
    if (index <= period) {
      // The first average is a plain mean of the first `period` changes.
      gain += up / period;
      loss += down / period;
    } else {
      gain = (gain * (period - 1) + up) / period;
      loss = (loss * (period - 1) + down) / period;
    }
    if (index >= period) {
      points.push({
        time: candle.time,
        value: loss === 0 ? 100 : 100 - 100 / (1 + gain / loss),
      });
    }
  });
  return points;
}

type Bars = { time: number; high: number; low: number; close: number }[];

/**
 * Average true range (Wilder) as a percentage of the close: how much the price typically moves in one
 * period. In percent, so a calm and a wild market can be compared at any price level.
 */
export function atrPercent(candles: Bars, period = 14): IndicatorPoint[] {
  const points: IndicatorPoint[] = [];
  let average = 0;
  candles.forEach((candle, index) => {
    const previous = candles[index - 1];
    const range = previous
      ? Math.max(
          candle.high - candle.low,
          Math.abs(candle.high - previous.close),
          Math.abs(candle.low - previous.close),
        )
      : candle.high - candle.low;
    if (index < period) {
      // The first average is a plain mean of the first `period` ranges.
      average += range / period;
    } else {
      average = (average * (period - 1) + range) / period;
    }
    if (index >= period - 1) {
      points.push({ time: candle.time, value: (average / candle.close) * 100 });
    }
  });
  return points;
}

/*
 * The indicators of the "Indicators step by step" course. Defaults follow Binance's chart menu
 * (and TradingView), so a lesson chart shows the same lines as the exchange.
 */

// A value for every candle; `undefined` while there is not enough history yet.
type Series = (number | undefined)[];

type Ohlc = { time: number; high: number; low: number; close: number };
type OhlcVolume = Ohlc & { volume: number };

// A point whose line color depends on the trend: SAR dots and the Supertrend line.
export type TrendPoint = IndicatorPoint & { up: boolean };

function toPoints(candles: { time: number }[], values: Series) {
  const points: IndicatorPoint[] = [];
  candles.forEach((candle, index) => {
    const value = values[index];
    if (value !== undefined) {
      points.push({ time: candle.time, value });
    }
  });
  return points;
}

// The mean of the last `period` defined values; undefined until there are that many in a row.
function smaOf(values: Series, period: number): Series {
  return values.map((_, index) => {
    if (index < period - 1) {
      return undefined;
    }
    let sum = 0;
    for (let offset = 0; offset < period; offset++) {
      const value = values[index - offset];
      if (value === undefined) {
        return undefined;
      }
      sum += value;
    }
    return sum / period;
  });
}

// An exponential average that starts with the simple average of the first `period` defined values.
function emaOf(values: Series, period: number): Series {
  const weight = 2 / (period + 1);
  const result: Series = [];
  let previous: number | undefined;
  let seed: number[] = [];
  for (const value of values) {
    if (value === undefined) {
      result.push(undefined);
      continue;
    }
    if (previous === undefined) {
      seed.push(value);
      if (seed.length === period) {
        previous = seed.reduce((sum, item) => sum + item, 0) / period;
        seed = [];
      }
      result.push(previous);
      continue;
    }
    previous = value * weight + previous * (1 - weight);
    result.push(previous);
  }
  return result;
}

// Wilder's average (RMA) – the smoothing inside RSI, ATR and Supertrend.
function rmaOf(values: number[], period: number): Series {
  let average = 0;
  return values.map((value, index) => {
    if (index < period) {
      average += value / period;
      return index === period - 1 ? average : undefined;
    }
    average = (average * (period - 1) + value) / period;
    return average;
  });
}

function highest(values: number[], end: number, period: number) {
  return Math.max(...values.slice(end - period + 1, end + 1));
}

function lowest(values: number[], end: number, period: number) {
  return Math.min(...values.slice(end - period + 1, end + 1));
}

const typicalPrice = (candle: Ohlc) =>
  (candle.high + candle.low + candle.close) / 3;

/** Weighted moving average: the newest close weighs `period` times, the oldest once. */
export function wma(candles: Closes, period: number): IndicatorPoint[] {
  const divisor = (period * (period + 1)) / 2;
  const values = candles.map((_, index) => {
    if (index < period - 1) {
      return undefined;
    }
    let sum = 0;
    for (let weight = period; weight >= 1; weight--) {
      sum += (candles[index - period + weight]?.close ?? 0) * weight;
    }
    return sum / divisor;
  });
  return toPoints(candles, values);
}

/** Bollinger Bands: a simple average with bands `multiplier` standard deviations above and below. */
export function bollinger(candles: Closes, period = 20, multiplier = 2) {
  const closes = candles.map((candle) => candle.close);
  const middle = smaOf(closes, period);
  const deviation = middle.map((mean, index) => {
    if (mean === undefined) {
      return undefined;
    }
    const window = closes.slice(index - period + 1, index + 1);
    // Population standard deviation, as on Binance and TradingView.
    const variance =
      window.reduce((sum, close) => sum + (close - mean) ** 2, 0) / period;
    return Math.sqrt(variance);
  });
  const band = (sign: 1 | -1) =>
    middle.map((mean, index) => {
      const spread = deviation[index];
      return mean === undefined || spread === undefined
        ? undefined
        : mean + sign * multiplier * spread;
    });
  return {
    upper: toPoints(candles, band(1)),
    middle: toPoints(candles, middle),
    lower: toPoints(candles, band(-1)),
  };
}

/**
 * Volume-weighted average price over the last `period` candles: the average price paid, each trade
 * weighted by its size. Binance computes it over a rolling window (14 by default); some platforms
 * restart it every day instead.
 */
export function vwap(candles: OhlcVolume[], period = 14): IndicatorPoint[] {
  const values = candles.map((_, index) => {
    if (index < period - 1) {
      return undefined;
    }
    const window = candles.slice(index - period + 1, index + 1);
    const volume = window.reduce((sum, candle) => sum + candle.volume, 0);
    const paid = window.reduce(
      (sum, candle) => sum + typicalPrice(candle) * candle.volume,
      0,
    );
    const last = window.at(-1);
    if (volume === 0 && last) {
      // No trades in the window – the last candle's typical price is all there is.
      return typicalPrice(last);
    }
    return paid / volume;
  });
  return toPoints(candles, values);
}

/**
 * Parabolic SAR (Wilder): dots that trail the price and speed up as the trend goes on. When the price
 * crosses the dots, the trend flips and the dots jump to the other side.
 */
export function parabolicSar(
  candles: Ohlc[],
  start = 0.02,
  increment = 0.02,
  maximum = 0.2,
): TrendPoint[] {
  const [first, second] = candles;
  if (!first || !second) {
    return [];
  }
  let up = second.close >= first.close;
  let sar = up ? first.low : first.high;
  let extreme = up ? first.high : first.low;
  let factor = start;
  const points: TrendPoint[] = [];

  for (let index = 1; index < candles.length; index++) {
    const candle = candles[index];
    const previous = candles[index - 1];
    if (!candle || !previous) {
      continue;
    }
    sar += factor * (extreme - sar);
    // The dot may not move inside the last two candles' range.
    const beforePrevious = candles[index - 2] ?? previous;
    if (up) {
      sar = Math.min(sar, previous.low, beforePrevious.low);
    } else {
      sar = Math.max(sar, previous.high, beforePrevious.high);
    }

    if (up && candle.low < sar) {
      up = false;
      sar = extreme;
      extreme = candle.low;
      factor = start;
    } else if (!up && candle.high > sar) {
      up = true;
      sar = extreme;
      extreme = candle.high;
      factor = start;
    } else if (up && candle.high > extreme) {
      extreme = candle.high;
      factor = Math.min(factor + increment, maximum);
    } else if (!up && candle.low < extreme) {
      extreme = candle.low;
      factor = Math.min(factor + increment, maximum);
    }
    points.push({ time: candle.time, value: sar, up });
  }
  return points;
}

/**
 * Supertrend: a line `multiplier` ATRs below the price in an uptrend (or above it in a downtrend).
 * The line only moves in the trend's direction; once the close crosses it, the trend flips.
 */
export function supertrend(
  candles: Ohlc[],
  period = 10,
  multiplier = 3,
): TrendPoint[] {
  const ranges = candles.map((candle, index) => {
    const previous = candles[index - 1];
    return previous
      ? Math.max(
          candle.high - candle.low,
          Math.abs(candle.high - previous.close),
          Math.abs(candle.low - previous.close),
        )
      : candle.high - candle.low;
  });
  const atr = rmaOf(ranges, period);
  const points: TrendPoint[] = [];
  let lowerBand = 0;
  let upperBand = 0;
  let up = false;
  let started = false;

  candles.forEach((candle, index) => {
    const range = atr[index];
    const previous = candles[index - 1];
    if (range === undefined) {
      return;
    }
    const middle = (candle.high + candle.low) / 2;
    const basicLower = middle - multiplier * range;
    const basicUpper = middle + multiplier * range;
    if (!started || !previous) {
      // The first value starts in a downtrend, as on TradingView.
      lowerBand = basicLower;
      upperBand = basicUpper;
      up = false;
      started = true;
    } else {
      // A band moves only towards the price, never back – unless the price closed through it.
      lowerBand =
        basicLower > lowerBand || previous.close < lowerBand
          ? basicLower
          : lowerBand;
      upperBand =
        basicUpper < upperBand || previous.close > upperBand
          ? basicUpper
          : upperBand;
      if (up && candle.close < lowerBand) {
        up = false;
      } else if (!up && candle.close > upperBand) {
        up = true;
      }
    }
    points.push({ time: candle.time, value: up ? lowerBand : upperBand, up });
  });
  return points;
}

/** MACD: the gap between a fast and a slow EMA, its signal line and their difference (histogram). */
export function macd(candles: Closes, fast = 12, slow = 26, signal = 9) {
  const closes = candles.map((candle) => candle.close);
  const fastLine = emaOf(closes, fast);
  const slowLine = emaOf(closes, slow);
  const line = fastLine.map((value, index) => {
    const slowValue = slowLine[index];
    return value === undefined || slowValue === undefined
      ? undefined
      : value - slowValue;
  });
  const signalLine = emaOf(line, signal);
  const histogram = line.map((value, index) => {
    const signalValue = signalLine[index];
    return value === undefined || signalValue === undefined
      ? undefined
      : value - signalValue;
  });
  return {
    macd: toPoints(candles, line),
    signal: toPoints(candles, signalLine),
    histogram: toPoints(candles, histogram),
  };
}

// Where the value sits in its range over the last `period` values: 0 = at the low, 100 = at the high.
// A flat range has no position, so it counts as the middle.
function stochasticOf(
  close: number[],
  high: number[],
  low: number[],
  period: number,
): Series {
  return close.map((value, index) => {
    if (index < period - 1) {
      return undefined;
    }
    const top = highest(high, index, period);
    const bottom = lowest(low, index, period);
    return top === bottom ? 50 : ((value - bottom) / (top - bottom)) * 100;
  });
}

/** Stochastic RSI: the stochastic applied to RSI instead of the price, smoothed into %K and %D. */
export function stochRsi(
  candles: Closes,
  rsiPeriod = 14,
  stochasticPeriod = 14,
  kSmoothing = 3,
  dSmoothing = 3,
) {
  const rsiValues = rsi(candles, rsiPeriod).map((point) => point.value);
  const raw = stochasticOf(rsiValues, rsiValues, rsiValues, stochasticPeriod);
  const k = smaOf(raw, kSmoothing);
  const d = smaOf(k, dSmoothing);
  // RSI starts `rsiPeriod` candles late – pad the front so values line up with the candles.
  const pad = Array<undefined>(candles.length - rsiValues.length).fill(
    undefined,
  );
  return {
    k: toPoints(candles, [...pad, ...k]),
    d: toPoints(candles, [...pad, ...d]),
  };
}

/** Stochastic oscillator: where the close sits in the high–low range of the last `period` candles. */
export function stochastic(
  candles: Ohlc[],
  period = 14,
  kSmoothing = 1,
  dSmoothing = 3,
) {
  const raw = stochasticOf(
    candles.map((candle) => candle.close),
    candles.map((candle) => candle.high),
    candles.map((candle) => candle.low),
    period,
  );
  const k = kSmoothing > 1 ? smaOf(raw, kSmoothing) : raw;
  const d = smaOf(k, dSmoothing);
  return { k: toPoints(candles, k), d: toPoints(candles, d) };
}

/**
 * KDJ: the stochastic as Binance shows it. K and D are smoothed by thirds (start at 50), and
 * J = 3K − 2D runs ahead of them – it can leave the 0–100 range.
 */
export function kdj(
  candles: Ohlc[],
  period = 9,
  kSmoothing = 3,
  dSmoothing = 3,
) {
  const raw = stochasticOf(
    candles.map((candle) => candle.close),
    candles.map((candle) => candle.high),
    candles.map((candle) => candle.low),
    period,
  );
  let kValue = 50;
  let dValue = 50;
  const k: Series = [];
  const d: Series = [];
  const j: Series = [];
  raw.forEach((value) => {
    if (value === undefined) {
      k.push(undefined);
      d.push(undefined);
      j.push(undefined);
      return;
    }
    kValue = ((kSmoothing - 1) * kValue + value) / kSmoothing;
    dValue = ((dSmoothing - 1) * dValue + kValue) / dSmoothing;
    k.push(kValue);
    d.push(dValue);
    j.push(3 * kValue - 2 * dValue);
  });
  return {
    k: toPoints(candles, k),
    d: toPoints(candles, d),
    j: toPoints(candles, j),
  };
}

/** Williams %R: like the stochastic, but upside down – 0 at the high of the range, −100 at the low. */
export function williamsR(candles: Ohlc[], period = 14): IndicatorPoint[] {
  const raw = stochasticOf(
    candles.map((candle) => candle.close),
    candles.map((candle) => candle.high),
    candles.map((candle) => candle.low),
    period,
  );
  return toPoints(
    candles,
    raw.map((value) => (value === undefined ? undefined : value - 100)),
  );
}

/** Commodity Channel Index: how far the typical price is from its average, in mean deviations. */
export function cci(candles: Ohlc[], period = 20): IndicatorPoint[] {
  const typical = candles.map(typicalPrice);
  const average = smaOf(typical, period);
  const values = average.map((mean, index) => {
    if (mean === undefined) {
      return undefined;
    }
    const window = typical.slice(index - period + 1, index + 1);
    const deviation =
      window.reduce((sum, value) => sum + Math.abs(value - mean), 0) / period;
    const price = typical[index] ?? mean;
    return deviation === 0 ? 0 : (price - mean) / (0.015 * deviation);
  });
  return toPoints(candles, values);
}

/** On-balance volume: a running total that adds the volume on up closes and subtracts it on down closes. */
export function obv(candles: OhlcVolume[]): IndicatorPoint[] {
  let total = 0;
  return candles.map((candle, index) => {
    const previous = candles[index - 1];
    if (previous && candle.close > previous.close) {
      total += candle.volume;
    } else if (previous && candle.close < previous.close) {
      total -= candle.volume;
    }
    return { time: candle.time, value: total };
  });
}

/** Money Flow Index: an RSI that counts money (typical price × volume) instead of price changes. */
export function mfi(candles: OhlcVolume[], period = 14): IndicatorPoint[] {
  const typical = candles.map(typicalPrice);
  const positive: number[] = [];
  const negative: number[] = [];
  candles.forEach((candle, index) => {
    const price = typical[index] ?? 0;
    const previous = typical[index - 1];
    const flow = price * candle.volume;
    positive.push(previous !== undefined && price > previous ? flow : 0);
    negative.push(previous !== undefined && price < previous ? flow : 0);
  });
  const values = candles.map((_, index) => {
    // The first candle has no previous price, so the first full window ends at `period`.
    if (index < period) {
      return undefined;
    }
    const sum = (flows: number[]) =>
      flows
        .slice(index - period + 1, index + 1)
        .reduce((total, flow) => total + flow, 0);
    const up = sum(positive);
    const down = sum(negative);
    return down === 0 ? 100 : 100 - 100 / (1 + up / down);
  });
  return toPoints(candles, values);
}
