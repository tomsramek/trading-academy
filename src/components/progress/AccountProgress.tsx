import { CheckCircle2Icon, CircleDashedIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { LevelBadge } from "@/components/courses/LevelBadge";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { lessonHref } from "@/lib/content/course-navigation";
import { sortCourses } from "@/lib/content/course-summary";
import {
  summarizeCourse,
  totalProgress,
  type CourseProgressSummary,
} from "@/lib/progress-summary";
import { cn } from "@/lib/utils";
import { getCourses } from "@/server/content";
import { getProgress } from "@/server/progress";

const BAR_COLORS = {
  lessons: "bg-chart-2",
  quizzes: "bg-chart-1",
  courses: "bg-chart-5",
} as const;

function Bar({
  done,
  total,
  color,
  label,
  className,
}: {
  done: number;
  total: number;
  color: string;
  label: string;
  className?: string;
}) {
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={done}
      aria-label={label}
      className={cn("h-2 overflow-hidden rounded-full bg-muted", className)}
    >
      <div
        className={cn("h-full rounded-full", color)}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

// The account page's overview: totals, started courses with what is still missing, finished
// courses and courses to start next.
export async function AccountProgress({ userId }: { userId: string }) {
  const [t, locale, progress, courses] = await Promise.all([
    getTranslations("Progress.account"),
    getLocale(),
    getProgress(userId),
    getCourses(),
  ]);
  const summaries = sortCourses(courses).map((course) =>
    summarizeCourse(course, progress),
  );
  const totals = totalProgress(summaries);
  const started = summaries.filter((summary) => summary.state === "started");
  const finished = summaries.filter((summary) => summary.state === "finished");
  // The recommended main path first (in its order), then the electives.
  const toStart = summaries
    .filter((summary) => summary.state === "notStarted")
    .toSorted(
      (a, b) =>
        (a.course.meta.path ?? Number.POSITIVE_INFINITY) -
        (b.course.meta.path ?? Number.POSITIVE_INFINITY),
    );
  const courseHref = (summary: CourseProgressSummary) =>
    ({
      pathname: "/courses/[course]",
      params: { course: summary.course.slugs[locale] },
    }) as const;

  const stats = [
    { key: "lessons", ...totals.lessons },
    { key: "quizzes", ...totals.quizzes },
    { key: "courses", ...totals.courses },
  ] as const;

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="account-stats" className="flex flex-col gap-4">
        <h2 id="account-stats" className="sr-only">
          {t("statsTitle")}
        </h2>
        <ul className="grid grid-cols-3 gap-2 sm:gap-3">
          {stats.map((stat) => (
            <li
              key={stat.key}
              className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 sm:gap-3 sm:p-4"
            >
              <span className="text-sm text-muted-foreground">
                {t(`stat.${stat.key}`)}
              </span>
              {/* Pinned to the bottom, so the numbers line up even when a label wraps. */}
              <div className="mt-auto flex flex-col gap-2 sm:gap-3">
                <span className="text-xl font-semibold tabular-nums sm:text-2xl">
                  {stat.done}
                  <span className="text-sm font-normal text-muted-foreground sm:text-base">
                    {" "}
                    / {stat.total}
                  </span>
                </span>
                <Bar
                  done={stat.done}
                  total={stat.total}
                  color={BAR_COLORS[stat.key]}
                  label={t(`stat.${stat.key}`)}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="account-started"
        className="flex flex-col gap-4"
      >
        <h2 id="account-started" className="text-xl font-semibold">
          {t("startedTitle")}
        </h2>
        {started.length === 0 ? (
          <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-border p-5 sm:p-6">
            <p className="text-muted-foreground">
              {finished.length > 0 ? t("noneStarted") : t("empty")}
            </p>
            <Link
              href="/courses"
              className={buttonVariants({ variant: "outline" })}
            >
              {t("browse")}
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {started.map((summary) => {
              const percent = Math.round(
                (summary.lessons.done / Math.max(summary.lessons.total, 1)) *
                  100,
              );
              const missingLessons =
                summary.lessons.total - summary.lessons.done;
              const missingQuizzes =
                summary.quizzes.total - summary.quizzes.done;
              return (
                <li
                  key={summary.course.slug}
                  className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <LevelBadge level={summary.course.meta.level} />
                      <Link
                        href={courseHref(summary)}
                        className="text-lg font-semibold hover:underline"
                      >
                        {summary.course.meta.title[locale]}
                      </Link>
                    </div>
                    <span className="text-3xl font-semibold tabular-nums">
                      {percent} %
                    </span>
                  </div>
                  <Bar
                    done={summary.lessons.done}
                    total={summary.lessons.total}
                    color={BAR_COLORS.lessons}
                    label={t("progressLabel", {
                      course: summary.course.meta.title[locale],
                    })}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-sm text-muted-foreground">
                      {t("missing", {
                        lessons: missingLessons,
                        quizzes: missingQuizzes,
                      })}
                    </span>
                    {summary.next && (
                      <Link
                        href={lessonHref(summary.course, summary.next, locale)}
                        className={buttonVariants({ size: "sm" })}
                      >
                        {t("continue")}
                      </Link>
                    )}
                  </div>
                  <details className="group rounded-lg bg-muted/50 px-4 py-3">
                    <summary className="cursor-pointer text-sm font-medium">
                      {t("whatsMissing")}
                    </summary>
                    <ul className="mt-3 flex flex-col gap-4">
                      {summary.gaps.map((gap) => (
                        <li
                          key={gap.module.slug}
                          className="flex flex-col gap-1.5"
                        >
                          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            {gap.module.meta.title[locale]}
                          </span>
                          <ul className="flex flex-col gap-1 text-sm">
                            {gap.missingLessons.map((lesson) => (
                              <li
                                key={lesson.slug}
                                className="flex items-center gap-2"
                              >
                                <CircleDashedIcon
                                  aria-hidden="true"
                                  className="size-4 shrink-0 text-muted-foreground"
                                />
                                <Link
                                  href={lessonHref(
                                    summary.course,
                                    lesson,
                                    locale,
                                  )}
                                  className="hover:underline"
                                >
                                  {lesson.meta[locale].title}
                                </Link>
                              </li>
                            ))}
                            {gap.quiz && (
                              <li className="flex items-center gap-2 text-muted-foreground">
                                {gap.quiz.result ? (
                                  <CheckCircle2Icon
                                    aria-hidden="true"
                                    className="size-4 shrink-0 text-bull"
                                  />
                                ) : (
                                  <CircleDashedIcon
                                    aria-hidden="true"
                                    className="size-4 shrink-0"
                                  />
                                )}
                                {gap.quiz.result
                                  ? t("quizDone", {
                                      best: gap.quiz.result.best,
                                      total: gap.quiz.result.total,
                                    })
                                  : t("quizMissing")}
                              </li>
                            )}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {finished.length > 0 && (
        <section
          aria-labelledby="account-finished"
          className="flex flex-col gap-4"
        >
          <h2 id="account-finished" className="text-xl font-semibold">
            {t("finishedTitle")}
          </h2>
          <ul className="flex flex-col gap-2">
            {finished.map((summary) => (
              <li
                key={summary.course.slug}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
              >
                <CheckCircle2Icon
                  aria-hidden="true"
                  className="size-5 shrink-0 text-bull"
                />
                <Link
                  href={courseHref(summary)}
                  className="flex-1 font-medium hover:underline"
                >
                  {summary.course.meta.title[locale]}
                </Link>
                <LevelBadge level={summary.course.meta.level} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {toStart.length > 0 && (
        <section aria-labelledby="account-next" className="flex flex-col gap-4">
          <h2 id="account-next" className="text-xl font-semibold">
            {t("nextTitle")}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {toStart.slice(0, 4).map((summary) => (
              <li
                key={summary.course.slug}
                className="flex flex-col gap-2 rounded-xl border border-border p-4"
              >
                <LevelBadge level={summary.course.meta.level} />
                <Link
                  href={courseHref(summary)}
                  className="font-medium hover:underline"
                >
                  {summary.course.meta.title[locale]}
                </Link>
                <span className="text-sm text-muted-foreground">
                  {t("lessonsCount", { count: summary.lessons.total })}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
