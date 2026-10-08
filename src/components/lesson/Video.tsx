import { z } from "zod";

import { videoSchema, type VideoProps } from "@/lib/content/video";

// Short silent screen recording in a lesson, e.g. clicking through an exchange's chart menu.
// It never plays on its own – the reader starts it – so it neither distracts nor uses mobile data.
//   <Video src="/videos/binance-timeframes.mp4" poster="/videos/binance-timeframes.webp" label="…" caption="…" />
export function Video(props: VideoProps) {
  const result = videoSchema.safeParse(props);
  if (!result.success) {
    throw new Error(
      `Invalid <Video label="${props.label}">:\n${z.prettifyError(result.error)}`,
    );
  }
  const { src, poster, label, caption } = result.data;

  return (
    <figure>
      <video
        controls
        muted
        playsInline
        preload="none"
        poster={poster}
        aria-label={label}
        className="w-full rounded-lg border border-border"
      >
        <source src={src} type="video/mp4" />
      </video>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
