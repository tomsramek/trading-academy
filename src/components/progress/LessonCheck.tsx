"use client";

import { CheckCircle2Icon } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { useProgress } from "@/lib/progress-store";

// A tick next to a done lesson. The space is always there, so the outline never shifts.
export function LessonCheck({
  course,
  lesson,
  className,
}: {
  course: string;
  lesson: string;
  className?: string;
}) {
  const t = useTranslations("Progress.outline");
  const progress = useProgress();
  const done =
    progress.status === "ready" &&
    (progress.progress.lessons[course]?.includes(lesson) ?? false);

  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center",
        className,
      )}
    >
      {done && (
        <CheckCircle2Icon
          role="img"
          aria-label={t("done")}
          className="size-4 text-bull"
        />
      )}
    </span>
  );
}
