// Downloads historical candles from the Binance Vision archive (data.binance.vision) and saves them as JSON
// for lesson charts, so a chart never changes and never depends on an exchange API at runtime.
//
//   yarn content:fetch-candles --symbol BTCUSDT --interval 1d --from 2024-01 --to 2024-06 \
//     --out content/market-data/btcusdt-1d-2024-h1.json
//
// --until 2022-05-13  keeps candles up to that day only (e.g. before a ticker was reused for a new coin)
// Weekly candles (1w) are built from daily ones: the monthly 1w files of the archive sometimes leave
// out weeks that start at the end of a month.
//
// The data is licensed CC BY-NC-SA 4.0 (Binance Vision Dataset Terms v1.0) – allowed for
// non-monetized educational projects, with attribution. See content/market-data/LICENSE.md.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";

const BASE_URL = "https://data.binance.vision/data/spot/monthly/klines";
const INTERVALS = ["1h", "4h", "1d", "1w"];
const MONTH = /^\d{4}-\d{2}$/;
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const WEEK = 7 * 24 * 60 * 60;

const { values } = parseArgs({
  options: {
    symbol: { type: "string" },
    interval: { type: "string" },
    from: { type: "string" },
    to: { type: "string" },
    out: { type: "string" },
    until: { type: "string" },
  },
});

const { symbol, interval, from, to, out, until } = values;
if (
  !symbol ||
  !interval ||
  !from ||
  !to ||
  !out ||
  !INTERVALS.includes(interval) ||
  !MONTH.test(from) ||
  !MONTH.test(to) ||
  (until !== undefined && !DAY.test(until))
) {
  console.error(
    "Usage: yarn content:fetch-candles --symbol BTCUSDT --interval 1d --from 2024-01 --to 2024-06 --out <file.json> [--until YYYY-MM-DD]\n" +
      `Intervals: ${INTERVALS.join(", ")}. Months as YYYY-MM.`,
  );
  process.exit(1);
}

// "2024-01".."2024-03" → ["2024-01", "2024-02", "2024-03"]
function monthsBetween(first: string, last: string): string[] {
  const months: string[] = [];
  const date = new Date(`${first}-01T00:00:00Z`);
  while (date.toISOString().slice(0, 7) <= last) {
    months.push(date.toISOString().slice(0, 7));
    date.setUTCMonth(date.getUTCMonth() + 1);
  }
  return months;
}

async function download(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url} → HTTP ${response.status}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

// Since 2025 Binance writes spot timestamps in microseconds, before that in milliseconds.
function toSeconds(timestamp: number): number {
  return Math.floor(timestamp > 1e14 ? timestamp / 1e6 : timestamp / 1e3);
}

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

// Daily candles → weekly ones, Monday 00:00 UTC to Sunday (the way exchanges count weeks).
function toWeekly(daily: Candle[]): Candle[] {
  const weeks = new Map<number, Candle>();
  for (const day of daily) {
    // 1970-01-01 was a Thursday, so Mondays are 4 days into the week counted from the epoch.
    const monday = Math.floor((day.time - 4 * 86400) / WEEK) * WEEK + 4 * 86400;
    const week = weeks.get(monday);
    if (week) {
      week.high = Math.max(week.high, day.high);
      week.low = Math.min(week.low, day.low);
      week.close = day.close;
    } else {
      weeks.set(monday, { ...day, time: monday });
    }
  }
  return [...weeks.values()];
}

// The archive is read in daily candles for weekly charts (see above).
const sourceInterval = interval === "1w" ? "1d" : interval;
const workDir = mkdtempSync(path.join(tmpdir(), "candles-"));
let candles: Candle[] = [];

try {
  // One file after another – the archive asks for polite, rate-limited downloads.
  for (const month of monthsBetween(from, to)) {
    const name = `${symbol}-${sourceInterval}-${month}.zip`;
    const url = `${BASE_URL}/${symbol}/${sourceInterval}/${name}`;
    const zip = await download(url);

    // The archive publishes a SHA-256 checksum next to each file: "<hash>  <file name>".
    const expected = (await download(`${url}.CHECKSUM`))
      .toString()
      .split(/\s+/)[0];
    const actual = createHash("sha256").update(zip).digest("hex");
    if (actual !== expected) {
      throw new Error(`${name}: checksum mismatch`);
    }

    const zipPath = path.join(workDir, name);
    writeFileSync(zipPath, zip);
    // Each zip contains one CSV: open time, open, high, low, close, volume, close time, …
    const csv = execFileSync("unzip", ["-p", zipPath], { encoding: "utf8" });
    for (const line of csv.trim().split("\n")) {
      const [openTime, open, high, low, close] = line.split(",").map(Number);
      if (
        openTime === undefined ||
        open === undefined ||
        high === undefined ||
        low === undefined ||
        close === undefined ||
        Number.isNaN(openTime)
      ) {
        continue; // header line or empty line
      }
      candles.push({ time: toSeconds(openTime), open, high, low, close });
    }
    console.log(`✓ ${name}`);
  }
} finally {
  rmSync(workDir, { recursive: true, force: true });
}

if (until) {
  const end = Date.parse(`${until}T23:59:59Z`) / 1000;
  candles = candles.filter((candle) => candle.time <= end);
}
if (interval === "1w") {
  candles = toWeekly(candles);
}

const dataset = {
  source: "Binance Vision",
  license: "CC BY-NC-SA 4.0",
  symbol,
  interval,
  candles,
};
writeFileSync(out, `${JSON.stringify(dataset, null, 2)}\n`);
console.log(`Saved ${candles.length} candles to ${out}`);
