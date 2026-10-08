import { CheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import { LevelBadge } from "@/components/courses/LevelBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionHeading } from "./SectionHeading";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;

export function LevelsSection() {
  const t = useTranslations("Home.levels");

  return (
    <section id="levels" className="scroll-mt-20 py-16 sm:py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading title={t("title")} description={t("description")} />
        <div className="grid gap-4 md:grid-cols-3">
          {LEVELS.map((level) => {
            // next-intl returns arrays only through t.raw(); the shape comes from messages/en.json.
            const topics: string[] = t.raw(`${level}.topics`);
            return (
              <Card key={level}>
                <CardHeader className="gap-3">
                  <LevelBadge level={level} label={t(`${level}.name`)} />
                  <CardTitle className="sr-only">
                    {t(`${level}.name`)}
                  </CardTitle>
                  <CardDescription className="text-xl text-foreground">
                    {t(`${level}.description`)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="flex flex-col gap-3 text-lg text-muted-foreground">
                    {topics.map((topic) => (
                      <li key={topic} className="flex gap-2">
                        <CheckIcon
                          aria-hidden="true"
                          className="mt-1 size-5 shrink-0 text-link"
                        />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
