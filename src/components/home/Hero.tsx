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
      {/* A soft, slowly drifting glow behind the content – depth without a photo. The mask fades it
          out towards the bottom, so the section edge never cuts the blur off. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 mask-b-from-40% mask-b-to-100%"
      >
        <div className="absolute top-[10%] right-[-10%] size-[36rem] rounded-full bg-primary/30 blur-3xl motion-safe:animate-glow-a" />
        <div className="absolute top-[30%] right-[25%] size-[28rem] rounded-full bg-chart-5/25 blur-3xl motion-safe:animate-glow-b" />
        <div className="absolute top-[-10%] left-[5%] size-[30rem] rounded-full bg-chart-2/15 blur-3xl motion-safe:animate-glow-c" />
      </div>
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
