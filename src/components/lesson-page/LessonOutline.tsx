import { useLocale } from "next-intl";

import { Link } from "@/i18n/navigation";
import { listLessons } from "@/lib/content/course-navigation";
import { cn } from "@/lib/utils";
import type { Course } from "@/server/content";

type LessonOutlineProps = {
  course: Course;
  currentSlug: string;
};

// Compact course outline next to a lesson; the open lesson is highlighted.
export function LessonOutline({ course, currentSlug }: LessonOutlineProps) {
  const locale = useLocale();
  const lessons = listLessons(course);

  return (
    <ol className="flex flex-col gap-5 text-sm">
      {course.modules.map((module) => (
        <li key={module.slug} className="flex flex-col gap-1">
          <span className="px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {module.meta.title[locale]}
          </span>
          <ol className="flex flex-col">
            {lessons
              .filter((entry) => entry.module === module)
              .map(({ lesson, number }) => {
                const current = lesson.slug === currentSlug;
                return (
                  <li key={lesson.slug}>
                    <Link
                      href={`/courses/${course.slug}/${lesson.slug}`}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "flex gap-2 rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                        current && "bg-accent font-medium text-foreground",
                      )}
                    >
                      <span className="w-4 shrink-0 tabular-nums">
                        {number}.
                      </span>
                      {lesson.meta[locale].title}
                    </Link>
                  </li>
                );
              })}
          </ol>
        </li>
      ))}
    </ol>
  );
}
