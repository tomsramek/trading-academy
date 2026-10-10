import { useTranslations } from "next-intl";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardProgress } from "@/components/progress/CardProgress";
import { Link } from "@/i18n/navigation";
import type { CourseSummary } from "@/lib/content/course-summary";
import { LOGIN_ENABLED } from "@/lib/features";

import { LevelBadge } from "./LevelBadge";

// One course in the course list. The whole card is a link (the title link covers the card).
export function CourseCard({ course }: { course: CourseSummary }) {
  const t = useTranslations("Courses");

  return (
    <Card className="relative h-full transition-colors focus-within:ring-2 focus-within:ring-ring hover:bg-accent/50">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <LevelBadge level={course.level} />
          {course.path !== undefined && (
            <span className="text-xs font-medium text-muted-foreground">
              {t("step", { step: course.path })}
            </span>
          )}
        </div>
        <CardTitle className="text-xl">
          <Link
            href={{
              pathname: "/courses/[course]",
              params: { course: course.slug },
            }}
            className="outline-none after:absolute after:inset-0"
          >
            {course.title}
          </Link>
        </CardTitle>
        <CardDescription className="text-base">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto flex flex-col items-start gap-3 text-sm text-muted-foreground">
        <span>
          {t("lessons", { count: course.lessons })} ·{" "}
          {t("minutes", { count: course.minutes })}
        </span>
        {LOGIN_ENABLED && (
          <CardProgress course={course.id} lessons={course.lessonIds} />
        )}
      </CardFooter>
    </Card>
  );
}
