import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import type { CourseSummary } from "@/lib/content/course-summary";

// One course in the course list. The whole card is a link (the title link covers the card).
export function CourseCard({ course }: { course: CourseSummary }) {
  const t = useTranslations("Courses");

  return (
    <Card className="relative h-full transition-colors focus-within:ring-2 focus-within:ring-ring hover:bg-accent/50">
      <CardHeader className="gap-3">
        <Badge variant="secondary">{t(`level.${course.level}`)}</Badge>
        <CardTitle className="text-xl">
          <Link
            href={`/courses/${course.slug}`}
            className="outline-none after:absolute after:inset-0"
          >
            {course.title}
          </Link>
        </CardTitle>
        <CardDescription className="text-base">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto text-sm text-muted-foreground">
        {t("lessons", { count: course.lessons })} ·{" "}
        {t("minutes", { count: course.minutes })}
      </CardFooter>
    </Card>
  );
}
