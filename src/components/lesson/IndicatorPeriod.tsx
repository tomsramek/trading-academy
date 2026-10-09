import { z } from "zod";

import {
  indicatorPeriodSchema,
  type IndicatorPeriodInput,
} from "@/lib/content/indicator-period";

import type { CandleDataset } from "./CandleChart";
import { ChartSource } from "./ChartSource";
import { IndicatorPeriodChart } from "./IndicatorPeriodChart";

type IndicatorPeriodProps = IndicatorPeriodInput & {
  data: CandleDataset;
};

// A chart with a slider for the indicator's period – try 6 and 30 and compare:
//   <IndicatorPeriod data={btc} indicator="rsi" min={2} max={30} label="…" />
export function IndicatorPeriod({ data, ...input }: IndicatorPeriodProps) {
  const result = indicatorPeriodSchema.safeParse(input);
  if (!result.success) {
    throw new Error(
      `Invalid <IndicatorPeriod label="${input.label}">:\n${z.prettifyError(result.error)}`,
    );
  }
  if (
    result.data.indicator === "mfi" &&
    data.candles.some((candle) => candle.volume === undefined)
  ) {
    throw new Error(
      `Invalid <IndicatorPeriod label="${input.label}">: MFI needs data with volume`,
    );
  }

  return (
    <figure className="not-prose my-8 flex flex-col gap-3">
      <IndicatorPeriodChart candles={data.candles} {...result.data} />
      <figcaption className="text-sm text-muted-foreground">
        <ChartSource source={data.source} license={data.license} />
      </figcaption>
    </figure>
  );
}
