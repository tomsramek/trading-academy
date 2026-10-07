import { z } from "zod";

/*
 * Annotations of a lesson chart, written in MDX:
 *   levels={[{ price: 73000, kind: "resistance" }]}
 *   markers={[{ time: "2024-05-01", kind: "buy" }]}
 *   zones={[{ from: "2024-02-26", to: "2024-03-14", label: "Rally" }]}
 * MDX is not type-checked, so <CandleChart> validates them with these schemas – a typo stops the build.
 */

export const LEVEL_KINDS = [
  "support",
  "resistance",
  "entry",
  "stopLoss",
  "takeProfit",
] as const;
export type LevelKind = (typeof LEVEL_KINDS)[number];

// buy/sell show a trade; event marks a neutral moment (a halving, news) without suggesting a trade.
export const MARKER_KINDS = ["buy", "sell", "event"] as const;
export type MarkerKind = (typeof MARKER_KINDS)[number];

// "2024-03-05" – a day in UTC, the format used in lessons.
const isoDate = z.iso.date();

export const annotationsSchema = z.strictObject({
  levels: z
    .array(
      z.strictObject({
        price: z.number().positive(),
        kind: z.enum(LEVEL_KINDS),
        label: z.string().trim().min(1).optional(),
      }),
    )
    .default([]),
  markers: z
    .array(
      z.strictObject({
        time: isoDate,
        kind: z.enum(MARKER_KINDS),
        label: z.string().trim().min(1).optional(),
      }),
    )
    .default([]),
  zones: z
    .array(
      z
        .strictObject({
          from: isoDate,
          to: isoDate,
          label: z.string().trim().min(1).optional(),
        })
        .refine((zone) => zone.from <= zone.to, "from must not be after to"),
    )
    .default([]),
});

export type AnnotationsInput = z.input<typeof annotationsSchema>;

// Annotations ready for drawing: dates as Unix seconds, every label filled in.
export type ChartAnnotations = {
  levels: { price: number; kind: LevelKind; label: string }[];
  markers: { time: number; kind: MarkerKind; label: string }[];
  zones: { from: number; to: number; label?: string }[];
};

// "2024-03-05" → Unix timestamp in seconds at 00:00 UTC (the start of a daily candle).
export function toTimestamp(date: string): number {
  return Date.parse(`${date}T00:00:00Z`) / 1000;
}
