"use client";

import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useProgress } from "@/lib/progress-store";
import { cn } from "@/lib/utils";

type LessonLink = {
  id: string;
  href: {
    pathname: "/courses/[course]/[lesson]";
    params: { course: string; lesson: string };
  };
};

type CourseProgressProps = {
  course: string;
  // Every lesson of the course in order, with its link in the page's language.
  lessons: LessonLink[];
};

// The course page's call to action: "Start the course", or – with progress – a progress bar and
// "Continue" to the first lesson not done yet.
export function CourseProgress({ course, lessons }: CourseProgressProps) {
  const t = useTranslations("Progress.course");
  const progress = useProgress();
  const doneIds =
    progress.status === "ready"
      ? new Set(progress.progress.lessons[course] ?? [])
      : new Set();
  const done = lessons.filter((lesson) => doneIds.has(lesson.id)).length;
  const next = lessons.find((lesson) => !doneIds.has(lesson.id)) ?? lessons[0];
  const percent =
    lessons.length > 0 ? Math.round((done / lessons.length) * 100) : 0;

  if (!next) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <Link
        href={next.href}
        className={cn(buttonVariants({ size: "lg" }), "w-fit")}
      >
        {done === 0
          ? t("start")
          : done === lessons.length
            ? t("again")
            : t("continue")}
      </Link>
      {/* A fixed-height line, so the page does not jump when the progress arrives. */}
      <div className="flex h-5 items-center gap-3 text-sm text-muted-foreground">
        {done > 0 && (
          <>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={lessons.length}
              aria-valuenow={done}
              aria-label={t("label")}
              className="h-2 w-40 overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-bull"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span>
              {done === lessons.length
                ? t("finished")
                : t("done", { done, total: lessons.length })}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
