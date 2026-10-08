import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import type { Level } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

import { SectionHeading } from "./SectionHeading";

// A published course on the home page, in the current language.
export type HomeCourse = {
  slug: string;
  title: string;
  level: Level;
  lessons: number;
  modules: string[];
};

// The available courses with their modules – taken from the content, so a newly published course
// appears here on its own. A card at the end says more courses are on the way.
export function CurriculumSection({ courses }: { courses: HomeCourse[] }) {
  const t = useTranslations("Home.curriculum");
  const tCourses = useTranslations("Courses");

  return (
    <section id="curriculum" className="scroll-mt-20 py-16 sm:py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading title={t("title")} description={t("description")} />
        <div className="grid gap-6 lg:grid-cols-2">
          {courses.map((course) => (
            <Card key={course.slug} className="gap-6 glass p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="h-auto px-3 py-1 text-sm">
                  {tCourses(`level.${course.level}`)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {tCourses("lessons", { count: course.lessons })}
                </span>
              </div>
              <h3 className="text-2xl font-semibold tracking-tight">
                {course.title}
              </h3>
              <ol className="flex flex-col divide-y">
                {course.modules.map((module, index) => (
                  <li
                    key={module}
                    className="flex items-center gap-4 py-3 text-lg"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground tabular-nums">
                      {index + 1}
                    </span>
                    <span>{module}</span>
                  </li>
                ))}
              </ol>
              <Link
                href={{
                  pathname: "/courses/[course]",
                  params: { course: course.slug },
                }}
                className={cn(buttonVariants({ size: "lg" }), "mt-auto w-fit")}
              >
                {t("start")}
              </Link>
            </Card>
          ))}
          <Card className="gap-3 border-dashed bg-transparent p-6 shadow-none sm:p-8">
            <h3 className="text-2xl font-semibold tracking-tight">
              {tCourses("upcoming.title")}
            </h3>
            <p className="text-lg text-muted-foreground">
              {tCourses("upcoming.description")}
            </p>
          </Card>
        </div>
      </Container>
    </section>
  );
}
