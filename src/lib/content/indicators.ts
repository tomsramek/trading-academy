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
