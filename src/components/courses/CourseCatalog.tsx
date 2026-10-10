import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { CourseSummary } from "@/lib/content/course-summary";
import { LEVELS, type Level } from "@/lib/content/levels";
import { cn } from "@/lib/utils";

import { CourseCard } from "./CourseCard";

type CourseCatalogProps = {
  courses: CourseSummary[];
  // Selected level from ?level=…, undefined = the recommended path (default view).
  level: Level | undefined;
};

const GRID = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

// Filter + course cards. Rendered on the server with all courses (static HTML) and again
// in the browser with the level from the URL (see CourseCatalogFromUrl).
// Default view: the numbered main path (course.json "path") and the electives under it.
export function CourseCatalog({ courses, level }: CourseCatalogProps) {
  const t = useTranslations("Courses");
  const filters = [undefined, ...LEVELS];

  return (
    <div className="flex flex-col gap-8">
      <nav aria-label={t("filterLabel")}>
        <ul className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <li key={filter ?? "recommended"}>
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
                {filter ? t(`level.${filter}`) : t("recommended")}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {level ? (
        <LevelView courses={courses} level={level} />
      ) : (
        <RecommendedView courses={courses} />
      )}
    </div>
  );
}

function RecommendedView({ courses }: { courses: CourseSummary[] }) {
  const t = useTranslations("Courses");
  const mainPath = courses
    .filter((course) => course.path !== undefined)
    .toSorted((a, b) => (a.path ?? 0) - (b.path ?? 0));
  const electives = courses.filter((course) => course.path === undefined);
  const firstStep = mainPath[0];

  if (courses.length === 0) {
    return <EmptyState message={t("empty.none")} showAll={false} />;
  }

  return (
    <div className="flex flex-col gap-12">
      {mainPath.length > 0 && (
        <section aria-labelledby="main-path" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2
              id="main-path"
              className="text-2xl font-semibold tracking-tight"
            >
              {t("path.main.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("path.main.description")}
            </p>
          </div>
          <ol className={GRID}>
            {mainPath.map((course) => (
              <li key={course.slug}>
                <CourseCard course={course} />
              </li>
            ))}
          </ol>
        </section>
      )}

      <section aria-labelledby="electives" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="electives" className="text-2xl font-semibold tracking-tight">
            {t("path.electives.title")}
          </h2>
          {firstStep && (
            <p className="text-muted-foreground">
              {t("path.electives.description", { course: firstStep.title })}
            </p>
          )}
        </div>
        <ul className={GRID}>
          {electives.map((course) => (
            <li key={course.slug}>
              <CourseCard course={course} />
            </li>
          ))}
          <UpcomingCard />
        </ul>
      </section>
    </div>
  );
}

function LevelView({
  courses,
  level,
}: {
  courses: CourseSummary[];
  level: Level;
}) {
  const t = useTranslations("Courses");
  const visible = courses.filter((course) => course.level === level);

  if (visible.length === 0) {
    return (
      <EmptyState
        message={
          courses.length === 0
            ? t("empty.none")
            : t("empty.level", { level: t(`level.${level}`) })
        }
        showAll={courses.length > 0}
      />
    );
  }

  return (
    <ul className={GRID}>
      {visible.map((course) => (
        <li key={course.slug}>
          <CourseCard course={course} />
        </li>
      ))}
      <UpcomingCard />
    </ul>
  );
}

// More courses are being written – shown after the existing ones.
function UpcomingCard() {
  const t = useTranslations("Courses");

  return (
    <li className="flex flex-col gap-2 rounded-xl border border-dashed border-border p-6">
      <p className="text-xl font-semibold">{t("upcoming.title")}</p>
      <p className="text-muted-foreground">{t("upcoming.description")}</p>
    </li>
  );
}

function EmptyState({
  message,
  showAll,
}: {
  message: string;
  showAll: boolean;
}) {
  const t = useTranslations("Courses");

  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border p-8">
      <p className="text-lg font-medium">{message}</p>
      <p className="text-muted-foreground">{t("empty.hint")}</p>
      {showAll && (
        <Link
          href="/courses"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          {t("showAll")}
        </Link>
      )}
    </div>
  );
}
