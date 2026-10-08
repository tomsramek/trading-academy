import {
  GiftIcon,
  RouteIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/Container";

import { SectionHeading } from "./SectionHeading";

const ITEMS = [
  { key: "free", Icon: GiftIcon },
  { key: "structured", Icon: RouteIcon },
  { key: "levels", Icon: TrendingUpIcon },
  { key: "risk", Icon: ShieldCheckIcon },
] as const;

// Why this academy: a highlighted panel in the middle of the page, four short points in one row.
export function WhySection() {
  const t = useTranslations("Home.why");

  return (
    <section id="why" className="scroll-mt-20 py-16 sm:py-24">
      <Container>
        <div className="flex flex-col gap-12 rounded-3xl border border-primary/20 bg-linear-to-b from-primary/10 to-transparent px-6 py-14 sm:px-10 sm:py-20">
          <SectionHeading
            title={t("title")}
            description={t("description")}
            centered
          />
          <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {ITEMS.map(({ key, Icon }) => (
              <li
                key={key}
                className="flex flex-col items-center gap-3 text-center"
              >
                <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Icon aria-hidden="true" className="size-7" />
                </span>
                <h3 className="text-xl font-semibold tracking-tight">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="text-pretty text-muted-foreground">
                  {t(`items.${key}.description`)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
