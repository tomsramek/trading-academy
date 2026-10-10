/*
 * Visit statistics with Umami (self-hosted, no cookies, no personal data). Pages are counted by the
 * script itself; these are the few events that tell how the courses are used. Event data never
 * contains anything about the visitor – only which course, module or place.
 */

export type AnalyticsEvent =
  | "course-start"
  | "lesson-done"
  | "quiz-finished"
  | "course-finished"
  | "donate";

type EventData = Record<string, string | number>;

declare global {
  interface Window {
    // Set by the Umami script; missing in development, with an ad blocker or before it loads.
    umami?: { track: (event: string, data?: EventData) => void };
  }
}

/** Records an event from code (e.g. after a quiz is checked). Does nothing without the script. */
export function track(event: AnalyticsEvent, data?: EventData) {
  window.umami?.track(event, data);
}

/**
 * Attributes that make the Umami script record a click on a link or button, without any JavaScript
 * of ours: <a {...trackClick("donate", { place: "header" })}>.
 */
export function trackClick(event: AnalyticsEvent, data: EventData = {}) {
  return {
    "data-umami-event": event,
    ...Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        `data-umami-event-${key}`,
        String(value),
      ]),
    ),
  };
}
