import { z } from "zod";

import {
  buildIndicatorSteps,
  indicatorStepsSchema,
  type IndicatorStepsInput,
} from "@/lib/content/indicator-steps";

import type { CandleDataset } from "./CandleChart";
import { ChartSource } from "./ChartSource";
import { IndicatorStepsPlayer } from "./IndicatorStepsPlayer";

type IndicatorStepsProps = IndicatorStepsInput & {
  data: CandleDataset;
};

// How an indicator is computed, candle by candle, with the numbers of every step:
//   import btc from "@content/market-data/btcusdt-1d-2023-10-2024-12.json";
//   <IndicatorSteps data={btc} indicator="sma" period={7} from="2024-03-01" label="…" />
// The steps are computed at build time; a typo in the props stops the build.
export function IndicatorSteps({ data, ...input }: IndicatorStepsProps) {
  const result = indicatorStepsSchema.safeParse(input);
  if (!result.success) {
    throw new Error(
      `Invalid <IndicatorSteps label="${input.label}">:\n${z.prettifyError(result.error)}`,
    );
  }
  const steps = buildIndicatorSteps(input, data.candles);

  return (
    <figure className="not-prose my-8 flex flex-col gap-3">
      <IndicatorStepsPlayer data={steps} label={result.data.label} />
      <figcaption className="text-sm text-muted-foreground">
        <ChartSource source={data.source} license={data.license} />
      </figcaption>
    </figure>
  );
}
