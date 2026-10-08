"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { RotateCcwIcon } from "lucide-react";

type AnimateOnViewProps = {
  // The illustration, rendered on the server; its animated parts use `group-data-playing/anim:`.
  children: ReactNode;
  replayLabel: string;
  // Hides the replay button – for drawings blended into a page (the home page hero).
  replayable?: boolean;
};

// Plays the animation of an illustration once, when it scrolls into view, and lets the reader
// replay it. People who ask their system to reduce motion get no animation (`motion-safe:` in the
// drawings) and no replay button.
export function AnimateOnView({
  children,
  replayLabel,
  replayable = true,
}: AnimateOnViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  // A new key remounts the drawing, which restarts its CSS animations.
  const [round, setRound] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setPlaying(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-playing={playing ? "" : undefined}
      className="group/anim relative"
    >
      <div key={round}>{children}</div>
      {replayable && (
        <button
          type="button"
          onClick={() => {
            setPlaying(true);
            setRound((value) => value + 1);
          }}
          className="absolute right-2 bottom-2 flex size-8 items-center justify-center rounded-full bg-card/80 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:hidden"
        >
          <RotateCcwIcon className="size-4" aria-hidden="true" />
          <span className="sr-only">{replayLabel}</span>
        </button>
      )}
    </div>
  );
}
