import {
  GiftIcon,
  RouteIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionHeading } from "./SectionHeading";

const ITEMS = [
  { key: "free", Icon: GiftIcon },
  { key: "structured", Icon: RouteIcon },
  { key: "levels", Icon: TrendingUpIcon },
  { key: "risk", Icon: ShieldCheckIcon },
] as const;

export function WhySection() {
  const t = useTranslations("Home.why");

  return (
    <section id="why" className="scroll-mt-20 py-16 sm:py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading title={t("title")} description={t("description")} />
        <div className="grid gap-4 sm:grid-cols-2">
          {ITEMS.map(({ key, Icon }) => (
            <Card key={key}>
              <CardHeader className="gap-3">
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-link">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <CardTitle className="text-2xl">
                  {t(`items.${key}.title`)}
                </CardTitle>
                <CardDescription className="text-lg">
                  {t(`items.${key}.description`)}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
