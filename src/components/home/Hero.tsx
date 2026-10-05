import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  const t = useTranslations("Home.hero");

  return (
    <section className="relative isolate overflow-hidden">
      {/* Very soft brand-colored glow behind the headline – depth without an image. */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -z-10 h-112 w-4xl -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />
      <Container className="flex flex-col items-center gap-8 py-24 text-center sm:py-32 lg:py-40">
        <Badge
          variant="outline"
          className="h-auto px-3 py-1 text-sm text-muted-foreground"
        >
          {t("badge")}
        </Badge>
        <h1 className="max-w-5xl text-5xl font-semibold tracking-tighter text-balance sm:text-6xl lg:text-7xl">
          {t("title")}
        </h1>
        <p className="max-w-3xl text-xl text-pretty text-muted-foreground sm:text-2xl">
          {t("description")}
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <a
            href="#curriculum"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 px-7 text-base",
            )}
          >
            {t("primaryCta")}
          </a>
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
      </Container>
    </section>
  );
}
