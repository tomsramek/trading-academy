import { useTranslations } from "next-intl";
import { ChevronRightIcon } from "lucide-react";

import { Link } from "@/i18n/navigation";

type LessonBreadcrumbsProps = {
  courseSlug: string;
  courseTitle: string;
  moduleTitle: string;
  lessonTitle: string;
};

// Courses › course › module › lesson. The module has no page of its own, so it is plain text.
export function LessonBreadcrumbs({
  courseSlug,
  courseTitle,
  moduleTitle,
  lessonTitle,
}: LessonBreadcrumbsProps) {
  const t = useTranslations("LessonPage");
  const separator = (
    <ChevronRightIcon className="size-3.5 shrink-0" aria-hidden="true" />
  );

  return (
    <nav aria-label={t("breadcrumb")}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <Link href="/courses" className="hover:text-foreground">
            {t("courses")}
          </Link>
          {separator}
        </li>
        <li className="flex items-center gap-1.5">
          <Link
            href={`/courses/${courseSlug}`}
            className="hover:text-foreground"
          >
            {courseTitle}
          </Link>
          {separator}
        </li>
        <li className="flex items-center gap-1.5">
          {moduleTitle}
          {separator}
        </li>
        <li aria-current="page" className="text-foreground">
          {lessonTitle}
        </li>
      </ol>
    </nav>
  );
}
