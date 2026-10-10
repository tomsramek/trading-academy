"use client";

import { useTranslations } from "next-intl";

import { useProgress } from "@/lib/progress-store";

// The best quiz result of a module, shown in the course outline once the quiz was taken.
export function ModuleQuizResult({
  course,
  module,
}: {
  course: string;
  module: string;
}) {
  const t = useTranslations("Progress.outline");
  const progress = useProgress();
  const result =
    progress.status === "ready"
      ? progress.progress.quizzes[course]?.[module]
      : undefined;
  if (!result) {
    return null;
  }
  return (
    <span className="text-xs font-medium text-muted-foreground normal-case">
      {t("quiz", { best: result.best, total: result.total })}
    </span>
  );
}
