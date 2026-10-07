/*
 * Illustrative candles for <CandlePattern>: a short trend that leads into the pattern, then the pattern
 * itself. Prices are on a made-up 0–100 scale – only the shapes matter, so the data is drawn by hand
 * to show each pattern clearly (real charts are in <CandleChart>).
 */

export type PatternCandle = {
  open: number;
  high: number;
  low: number;
  close: number;
};

type CandlePattern = {
  candles: PatternCandle[];
  // Index of the first candle of the pattern; the candles before it are the context (the trend).
  patternStart: number;
};

const DOWNTREND: PatternCandle[] = [
  { open: 92, high: 94, low: 82, close: 84 },
  { open: 84, high: 86, low: 74, close: 76 },
  { open: 76, high: 78, low: 66, close: 68 },
];

const UPTREND: PatternCandle[] = [
  { open: 8, high: 18, low: 6, close: 16 },
  { open: 16, high: 26, low: 14, close: 24 },
  { open: 24, high: 34, low: 22, close: 32 },
];

export const CANDLE_PATTERNS = {
  doji: {
    candles: [...UPTREND, { open: 33, high: 41, low: 25, close: 33.3 }],
    patternStart: 3,
  },
  hammer: {
    candles: [...DOWNTREND, { open: 62, high: 67, low: 46, close: 66 }],
    patternStart: 3,
  },
  shootingStar: {
    candles: [...UPTREND, { open: 34, high: 54, low: 33, close: 37 }],
    patternStart: 3,
  },
  bullishEngulfing: {
    candles: [
      ...DOWNTREND,
      { open: 67, high: 68, low: 61, close: 63 },
      { open: 61, high: 76, low: 59, close: 74 },
    ],
    patternStart: 3,
  },
  bearishEngulfing: {
    candles: [
      ...UPTREND,
      { open: 33, high: 39, low: 32, close: 37 },
      { open: 39, high: 41, low: 22, close: 24 },
    ],
    patternStart: 3,
  },
  morningStar: {
    candles: [
      ...DOWNTREND,
      { open: 67, high: 68, low: 51, close: 53 },
      { open: 50, high: 52, low: 44, close: 46 },
      { open: 51, high: 68, low: 50, close: 66 },
    ],
    patternStart: 3,
  },
  eveningStar: {
    candles: [
      ...UPTREND,
      { open: 33, high: 50, low: 32, close: 48 },
      { open: 52, high: 58, low: 50, close: 56 },
      { open: 50, high: 51, low: 33, close: 35 },
    ],
    patternStart: 3,
  },
} satisfies Record<string, CandlePattern>;

export type CandlePatternName = keyof typeof CANDLE_PATTERNS;

export function isCandlePatternName(name: string): name is CandlePatternName {
  return Object.hasOwn(CANDLE_PATTERNS, name);
}
