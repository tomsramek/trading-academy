"use client";

import { useTranslations } from "next-intl";

import { useProgress } from "@/lib/progress-store";

// A thin progress bar on a course card – only when the course was started.
export function CardProgress({
  course,
  lessons,
}: {
  course: string;
  lessons: string[];
}) {
  const t = useTranslations("Progress.course");
  const progress = useProgress();
  if (progress.status !== "ready") {
    return null;
  }
  const doneIds = new Set(progress.progress.lessons[course] ?? []);
  const done = lessons.filter((lesson) => doneIds.has(lesson)).length;
  if (done === 0) {
    return null;
  }
  return (
    <div className="flex w-full items-center gap-2">
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={lessons.length}
        aria-valuenow={done}
        aria-label={t("label")}
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-bull"
          style={{ width: `${Math.round((done / lessons.length) * 100)}%` }}
        />
      </div>
      <span className="text-xs tabular-nums">
        {done}/{lessons.length}
      </span>
    </div>
  );
}
