import { ArrowUpRightIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { CourseBadge } from "@/components/badges/CourseBadge";
import { TrackOnView } from "@/components/analytics/TrackOnView";
import { ProfessorWick } from "@/components/brand/ProfessorWick";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { courseHref } from "@/lib/content/course-navigation";
import { LOGIN_ENABLED } from "@/lib/features";
import { trackClick } from "@/lib/analytics";
import { DONATE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { Course } from "@/server/content";

type CourseFinishedProps = {
  course: Course;
  // The next course on the recommended main path; undefined → point to the catalog instead.
  nextCourse: Course | undefined;
};

// Shown under the last lesson of a course: Professor Wick tosses his cap and suggests what next.
// Below the next step, one quiet line asks for a donation – the moment people are most grateful.
export function CourseFinished({ course, nextCourse }: CourseFinishedProps) {
  const t = useTranslations("CourseFinished");
  const locale = useLocale();

  return (
    <section
      aria-labelledby="course-finished"
      className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center sm:p-8"
    >
      <TrackOnView event="course-finished" course={course.slug} />
      <ProfessorWick pose="celebrating" className="max-w-48" />
      <h2
        id="course-finished"
        className="text-2xl font-semibold tracking-tight text-balance"
      >
        {t("title", { course: course.meta.title[locale] })}
      </h2>
      <p className="max-w-lg text-pretty text-muted-foreground">
        {t("description")}
      </p>
      {LOGIN_ENABLED && (
        <CourseBadge
          course={course.slug}
          title={course.meta.title[locale]}
          level={course.meta.level}
          lessons={course.modules.flatMap((module) =>
            module.lessons.map((lesson) => lesson.slug),
          )}
          quizModules={course.modules
            .filter((module) => module.quiz)
            .map((module) => module.slug)}
        />
      )}
      {nextCourse ? (
        <Link
          href={courseHref(nextCourse, locale)}
          className={cn(buttonVariants({ size: "lg" }))}
        >
          {t("nextStep", { course: nextCourse.meta.title[locale] })}
        </Link>
      ) : (
        <Link
          href="/courses"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          {t("catalog")}
        </Link>
      )}
      <p className="max-w-lg text-sm text-pretty text-muted-foreground">
        {t.rich("support", {
          link: (chunks) => (
            <a
              href={DONATE_URL}
              {...trackClick("donate", { place: "course-finished" })}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm font-medium text-foreground underline underline-offset-4 hover:decoration-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {chunks}
              <ArrowUpRightIcon
                aria-hidden="true"
                className="ml-0.5 inline size-[0.9em] align-baseline"
              />
              <span className="sr-only"> ({t("opensInNewTab")})</span>
            </a>
          ),
        })}
      </p>
    </section>
  );
}
