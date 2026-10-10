"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { PauseIcon, PlayIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

// How long one illustration stays before the next one.
const INTERVAL_MS = 8000;

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// Shows one illustration at a time and slowly fades to the next one every few seconds. The illustrations
// are rendered on the server and only shown or hidden here. Switching can be paused (WCAG 2.2.2), and
// people who ask their system to reduce motion get no automatic switching at all.
export function IllustrationCarousel({ children }: { children: ReactNode[] }) {
  const t = useTranslations("Home.hero.carousel");
  const [index, setIndex] = useState(0);
  // Counts every switch, so the shown illustration is remounted and plays its animation again.
  const [round, setRound] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false,
  );
  const running = !paused && !hovered && !reducedMotion;

  const show = (next: number) => {
    setIndex(next);
    setRound((value) => value + 1);
  };

  // A timer lives outside React, so this is a legitimate effect: it starts and stops with `running`.
  useEffect(() => {
    if (!running) {
      return;
    }
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % children.length);
      setRound((value) => value + 1);
    }, INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [running, index, children.length]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col gap-3"
    >
      {/* All illustrations lie on top of each other in one grid cell and fade in and out. */}
      <div className="grid">
        {children.map((child, childIndex) => (
          <div
            // The illustrations never reorder, so their position is a stable key.
            key={childIndex}
            inert={childIndex !== index}
            aria-roledescription={t("slide")}
            aria-label={t("position", {
              number: childIndex + 1,
              total: children.length,
            })}
            className={cn(
              "col-start-1 row-start-1 opacity-0 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none",
              childIndex === index && "opacity-100",
            )}
          >
            {/* A new key on every switch remounts the drawing, so its animation plays again. */}
            <div key={childIndex === index ? round : "hidden"}>{child}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center">
        {children.map((_, childIndex) => (
          <button
            // The dots never reorder, so their position is a stable key.
            key={childIndex}
            type="button"
            onClick={() => show(childIndex)}
            aria-label={t("show", {
              number: childIndex + 1,
              total: children.length,
            })}
            aria-current={childIndex === index ? "true" : undefined}
            // A 24 px target around the small dot (WCAG 2.2 target size), the dot itself stays small.
            className="group flex size-6 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <span
              aria-hidden="true"
              className={cn(
                "size-2.5 rounded-full bg-muted-foreground/40 transition-colors group-hover:bg-muted-foreground",
                childIndex === index && "bg-primary group-hover:bg-primary",
              )}
            />
          </button>
        ))}
        {!reducedMotion && (
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? t("play") : t("pause")}
            className="ml-2 flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {paused ? (
              <PlayIcon className="size-3.5" aria-hidden="true" />
            ) : (
              <PauseIcon className="size-3.5" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
