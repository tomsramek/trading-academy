import { z } from "zod";

// <Video> props written in MDX. MDX is not type-checked, so the component validates them – a typo
// stops the build. Videos and their poster images live in public/videos/ (Next.js cannot import
// video files the way it imports images).
export const videoSchema = z.strictObject({
  // "/videos/binance-timeframes.mp4"
  src: z
    .string()
    .regex(/^\/videos\/[a-z0-9-]+\.mp4$/, "an .mp4 file in public/videos/"),
  // First frame shown before playing: "/videos/binance-timeframes.webp"
  poster: z
    .string()
    .regex(
      /^\/videos\/[a-z0-9-]+\.(webp|jpg)$/,
      "a .webp or .jpg file in public/videos/",
    ),
  label: z.string().trim().min(1),
  caption: z.string().trim().min(1).optional(),
});

export type VideoProps = z.input<typeof videoSchema>;
