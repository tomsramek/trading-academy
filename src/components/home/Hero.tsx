import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import { Illustration } from "@/components/lesson/Illustration";
import { IllustrationCarousel } from "./IllustrationCarousel";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function Hero() {
  const t = useTranslations("Home.hero");

  return (
    <section className="relative isolate overflow-hidden">
      {/* Very soft brand-colored glow behind the illustration – depth without a photo. */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 right-0 -z-10 h-112 w-2xl rounded-full bg-primary/15 blur-3xl"
      />
      {/* Text and illustration side by side on large screens, stacked on phones. */}
      <Container className="grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:py-32">
        <div className="flex flex-col items-start gap-6">
          <Badge
            variant="outline"
            className="h-auto px-3 py-1 text-sm text-muted-foreground"
          >
            {t("badge")}
          </Badge>
          <h1 className="text-5xl font-semibold tracking-tighter text-balance sm:text-6xl">
            {t("title")}
          </h1>
          <p className="text-xl text-pretty text-muted-foreground">
            {t("description")}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/courses"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 px-7 text-base",
              )}
            >
              {t("primaryCta")}
            </Link>
            <a
              href="#why"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 px-7 text-base",
              )}
            >
              {t("secondaryCta")}
            </a>
          </div>
        </div>
        <IllustrationCarousel>
          {[
            <Illustration key="chartCoaster" name="chartCoaster" frameless />,
            <Illustration key="guruMegaphone" name="guruMegaphone" frameless />,
          ]}
        </IllustrationCarousel>
      </Container>
    </section>
  );
}
