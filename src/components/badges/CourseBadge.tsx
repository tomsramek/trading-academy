"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import type { Level } from "@/lib/content/schema";
import { useProgress } from "@/lib/progress-store";

import { BadgeMedal } from "./BadgeMedal";

type CourseBadgeProps = {
  course: string;
  title: string;
  level: Level;
  lessons: string[];
  // Modules whose quiz belongs to the course badge.
  quizModules: string[];
};

// The course badge in the celebration under the last lesson – it lights up the moment the last
// lesson or quiz is done.
export function CourseBadge({
  course,
  title,
  level,
  lessons,
  quizModules,
}: CourseBadgeProps) {
  const t = useTranslations("Badges.courseFinished");
  const progress = useProgress();

  if (progress.status === "loading" || progress.status === "error") {
    return <div className="h-20 w-full max-w-sm" />;
  }

  if (progress.status === "signedOut") {
    return (
      <div className="flex items-center gap-4 text-left text-sm text-muted-foreground">
        <BadgeMedal icon="course" tone={level} earned={false} />
        <p>
          {t.rich("signIn", {
            link: (chunks) => (
              <Link
                href="/sign-in"
                className="font-medium text-foreground underline underline-offset-2"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    );
  }

  const doneLessons = new Set(progress.progress.lessons[course] ?? []);
  const quizzes = progress.progress.quizzes[course] ?? {};
  const missing =
    lessons.filter((lesson) => !doneLessons.has(lesson)).length +
    quizModules.filter((module) => !quizzes[module]).length;

  return (
    <div
      aria-live="polite"
      className="flex items-center gap-4 text-left text-sm"
    >
      <BadgeMedal icon="course" tone={level} earned={missing === 0} />
      <p className="text-muted-foreground">
        {missing === 0
          ? t.rich("earned", {
              course: title,
              strong: (chunks) => (
                <strong className="text-foreground">{chunks}</strong>
              ),
              link: (chunks) => (
                <Link
                  href="/account"
                  className="font-medium text-foreground underline underline-offset-2"
                >
                  {chunks}
                </Link>
              ),
            })
          : t("missing", { count: missing })}
      </p>
    </div>
  );
}
