import { useLocale, useTranslations } from "next-intl";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { Link } from "@/i18n/navigation";
import type { LessonEntry } from "@/lib/content/course-navigation";
import { cn } from "@/lib/utils";

type LessonPagerProps = {
  courseSlug: string;
  previous: LessonEntry | undefined;
  next: LessonEntry | undefined;
};

const CARD =
  "flex flex-1 flex-col gap-1 rounded-lg border border-border p-4 transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

// Previous / next lesson at the end of a lesson. After the last lesson it leads back to the course.
export function LessonPager({ courseSlug, previous, next }: LessonPagerProps) {
  const t = useTranslations("LessonPage");
  const locale = useLocale();

  return (
    <nav
      aria-label={t("pager")}
      className="flex flex-col gap-3 border-t border-border pt-8 sm:flex-row"
    >
      {previous ? (
        <Link
          href={`/courses/${courseSlug}/${previous.lesson.slug}`}
          rel="prev"
          className={CARD}
        >
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <ArrowLeftIcon className="size-4" aria-hidden="true" />
            {t("previous")}
          </span>
          <span className="font-medium">
            {previous.lesson.meta[locale].title}
          </span>
        </Link>
      ) : (
        <span className="hidden flex-1 sm:block" />
      )}
      {next ? (
        <Link
          href={`/courses/${courseSlug}/${next.lesson.slug}`}
          rel="next"
          className={cn(CARD, "sm:items-end sm:text-right")}
        >
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            {t("next")}
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </span>
          <span className="font-medium">{next.lesson.meta[locale].title}</span>
        </Link>
      ) : (
        <Link
          href={`/courses/${courseSlug}`}
          className={cn(CARD, "sm:items-end sm:text-right")}
        >
          <span className="text-sm text-muted-foreground">{t("finished")}</span>
          <span className="font-medium">{t("backToCourse")}</span>
        </Link>
      )}
    </nav>
  );
}
