"use client";

import { useEffect, useRef } from "react";

import { track, type AnalyticsEvent } from "@/lib/analytics";

type TrackOnViewProps = {
  event: AnalyticsEvent;
  course: string;
};

// Records an event once, when this spot scrolls into view – e.g. reaching the end of a course.
export function TrackOnView({ event, course }: TrackOnViewProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        track(event, { course });
        observer.disconnect();
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [event, course]);

  return <span ref={ref} aria-hidden="true" />;
}
