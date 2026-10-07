import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import type { Course } from "@/server/content";

// Modules and lessons of a course, each lesson linking to its page.
export function CourseOutline({ course }: { course: Course }) {
  const t = useTranslations("CourseDetail");
  const locale = useLocale();
  // Lessons are numbered through the whole course (1, 2, 3 … across modules):
  // a module starts after all lessons of the modules before it.
  const firstNumbers = course.modules.map((_, index) =>
    course.modules
      .slice(0, index)
      .reduce((count, module) => count + module.lessons.length, 1),
  );

  return (
    <ol className="flex flex-col gap-6">
      {course.modules.map((module, moduleIndex) => (
        <li
          key={module.slug}
          className="overflow-hidden rounded-lg border border-border"
        >
          <h3 className="flex flex-col gap-0.5 border-b border-border bg-muted px-4 py-3">
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {t("module", { number: moduleIndex + 1 })}
            </span>
            <span className="text-lg font-semibold">
              {module.meta.title[locale]}
            </span>
          </h3>
          <ol className="divide-y divide-border">
            {module.lessons.map((lesson, lessonIndex) => (
              <li key={lesson.slug}>
                <Link
                  href={`/courses/${course.slug}/${lesson.slug}`}
                  className="flex items-baseline gap-3 px-4 py-3 transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                >
                  <span className="w-6 shrink-0 text-sm text-muted-foreground tabular-nums">
                    {(firstNumbers[moduleIndex] ?? 1) + lessonIndex}.
                  </span>
                  <span className="flex flex-1 flex-col gap-0.5">
                    <span className="font-medium">
                      {lesson.meta[locale].title}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {lesson.meta[locale].description}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
                    {t("minutes", { count: lesson.meta[locale].minutes })}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}
