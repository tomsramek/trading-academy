import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "./SectionHeading";

const QUESTIONS = ["free", "advice", "when", "money", "languages"] as const;

export function FaqSection() {
  const t = useTranslations("Home.faq");

  return (
    <section id="faq" className="scroll-mt-20 py-16 sm:py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading title={t("title")} />
        <Accordion className="max-w-3xl">
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
