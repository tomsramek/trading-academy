import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { CourseSummary } from "@/lib/content/course-summary";
import { LEVELS, type Level } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

import { CourseCard } from "./CourseCard";

type CourseCatalogProps = {
  courses: CourseSummary[];
  // Selected level from ?level=…, undefined = all courses.
  level: Level | undefined;
};

// Level filter + course cards. Rendered on the server with all courses (static HTML) and again
// in the browser with the level from the URL (see CourseCatalogFromUrl).
export function CourseCatalog({ courses, level }: CourseCatalogProps) {
  const t = useTranslations("Courses");
  const visible = level
    ? courses.filter((course) => course.level === level)
    : courses;
  const filters = [undefined, ...LEVELS];

  return (
    <div className="flex flex-col gap-8">
      <nav aria-label={t("filterLabel")}>
        <ul className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <li key={filter ?? "all"}>
              <Link
                href={
                  filter
                    ? { pathname: "/courses", query: { level: filter } }
                    : "/courses"
                }
                aria-current={filter === level ? "page" : undefined}
                // cn() resolves the conflicting border classes of the variant (tailwind-merge).
                className={cn(
                  buttonVariants({
                    variant: filter === level ? "default" : "outline",
                    size: "sm",
                  }),
                )}
              >
                {filter ? t(`level.${filter}`) : t("all")}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {visible.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((course) => (
            <li key={course.slug}>
              <CourseCard course={course} />
            </li>
          ))}
          {/* More courses are being written – shown after the existing ones. */}
          <li className="flex flex-col gap-2 rounded-xl border border-dashed border-border p-6">
            <p className="text-xl font-semibold">{t("upcoming.title")}</p>
            <p className="text-muted-foreground">{t("upcoming.description")}</p>
          </li>
        </ul>
      ) : (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border p-8">
          <p className="text-lg font-medium">
            {courses.length === 0
              ? t("empty.none")
              : t("empty.level", { level: level ? t(`level.${level}`) : "" })}
          </p>
          <p className="text-muted-foreground">{t("empty.hint")}</p>
          {courses.length > 0 && (
            <Link
              href="/courses"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              {t("showAll")}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
