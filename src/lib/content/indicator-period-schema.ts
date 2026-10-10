import { z } from "zod";

import { PERIOD_INDICATORS } from "./indicator-period";

// The props of <IndicatorPeriod> written in MDX, checked at build time. Apart from indicator-period.ts,
// which the browser imports for the calculations – zod stays on the server.
export const indicatorPeriodSchema = z
  .strictObject({
    indicator: z.enum(PERIOD_INDICATORS),
    min: z.int().min(2).default(2),
    max: z.int().max(200).default(50),
    // Where the slider starts; Binance's default when left out.
    value: z.int().optional(),
    label: z.string().trim().min(1),
  })
  .refine((props) => props.min < props.max, "min must be below max")
  .refine(
    (props) =>
      props.value === undefined ||
      (props.value >= props.min && props.value <= props.max),
    "value must be between min and max",
  );
export type IndicatorPeriodInput = z.input<typeof indicatorPeriodSchema>;
