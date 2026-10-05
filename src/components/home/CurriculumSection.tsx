import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "./SectionHeading";

export function CurriculumSection() {
  const t = useTranslations("Home.curriculum");
  // next-intl returns arrays only through t.raw(); the shape comes from messages/en.json.
  const modules: string[] = t.raw("modules");

  return (
    <section id="curriculum" className="scroll-mt-20 py-16 sm:py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading title={t("title")} description={t("description")} />
        <Card className="gap-6 glass p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="h-auto px-3 py-1 text-sm">
              {t("level")}
            </Badge>
            <Badge variant="secondary" className="h-auto px-3 py-1 text-sm">
              {t("badge")}
            </Badge>
          </div>
          <ol className="flex flex-col divide-y">
            {modules.map((module, index) => (
              <li key={module} className="flex items-center gap-4 py-4 text-xl">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-base font-medium text-muted-foreground tabular-nums">
                  {index + 1}
                </span>
                <span>{module}</span>
              </li>
            ))}
          </ol>
        </Card>
      </Container>
    </section>
  );
}
