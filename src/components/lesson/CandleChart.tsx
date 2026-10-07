import { useTranslations } from "next-intl";

import { CandleChartCanvas } from "./CandleChartCanvas";

export type Candle = {
  // Start of the period as a Unix timestamp in seconds (UTC).
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

// Shape of the JSON files from `yarn content:fetch-candles`. Illustrative data has only `candles`.
export type CandleDataset = {
  candles: Candle[];
  source?: string;
  license?: string;
  symbol?: string;
  interval?: string;
};

const LICENSE_URLS: Record<string, string> = {
  "CC BY-NC-SA 4.0": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

type CandleChartProps = {
  data: CandleDataset;
  // What the chart shows – read by screen readers instead of the drawing.
  label: string;
  caption?: string;
};

// Candlestick chart in a lesson:
//   import btc from "@content/market-data/btcusdt-1d-2024-h1.json";
//   <CandleChart data={btc} label="Bitcoin in the first half of 2024" />
// Real market data always shows its source and licence; generated data is marked as illustrative.
export function CandleChart({ data, label, caption }: CandleChartProps) {
  const t = useTranslations("Lesson.chart");
  const licenseUrl = data.license ? LICENSE_URLS[data.license] : undefined;

  return (
    <figure className="not-prose my-8">
      <CandleChartCanvas candles={data.candles} label={label} />
      <figcaption className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
        {caption && <span>{caption}</span>}
        <span className="text-xs">
          {data.symbol && data.interval && (
            <>
              {formatSymbol(data.symbol)} · {data.interval.toUpperCase()} ·{" "}
            </>
          )}
          {data.source ? (
            <>
              {t("source", { source: data.source })}
              {data.license && (
                <>
                  {" · "}
                  {licenseUrl ? (
                    <a
                      href={licenseUrl}
                      target="_blank"
                      rel="noopener noreferrer license"
                      className="underline underline-offset-2 hover:text-foreground"
                    >
                      {data.license}
                    </a>
                  ) : (
                    data.license
                  )}
                </>
              )}
            </>
          ) : (
            t("illustrative")
          )}
        </span>
      </figcaption>
    </figure>
  );
}

// "BTCUSDT" → "BTC/USDT"
function formatSymbol(symbol: string): string {
  const quote = ["USDT", "USDC", "EUR", "BTC"].find((asset) =>
    symbol.endsWith(asset),
  );
  return quote ? `${symbol.slice(0, -quote.length)}/${quote}` : symbol;
}
