import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqData } from "@/lib/structured-data";

import { SectionHeading } from "./SectionHeading";

const QUESTIONS = [
  "free",
  "rich",
  "advice",
  "money",
  "courses",
  "languages",
] as const;

export function FaqSection() {
  const t = useTranslations("Home.faq");

  return (
    <section id="faq" className="scroll-mt-20 py-16 sm:py-24">
      <Container className="flex flex-col gap-12">
        {/* The same questions for search engines and AI assistants, which like to quote them. */}
        <JsonLd
          data={faqData(
            QUESTIONS.map((key) => ({
              question: t(`items.${key}.question`),
              answer: t(`items.${key}.answer`),
            })),
          )}
        />
        <SectionHeading title={t("title")} centered />
        <Accordion className="mx-auto w-full max-w-3xl">
          {QUESTIONS.map((key) => (
            <AccordionItem key={key} value={key}>
              <AccordionTrigger className="py-5 text-xl">
                {t(`items.${key}.question`)}
              </AccordionTrigger>
              <AccordionContent className="text-lg text-muted-foreground">
                {t(`items.${key}.answer`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
