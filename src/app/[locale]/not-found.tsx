import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import { ProfessorWick } from "@/components/brand/ProfessorWick";
import { Container } from "@/components/layout/Container";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NotFound");
  return { title: t("metaTitle") };
}

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <Container className="flex flex-1 flex-col items-center justify-center gap-8 py-16 text-center sm:py-24">
      <ProfessorWick pose="fallen" className="max-w-80" />
      <div className="flex max-w-xl flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {t("title")}
        </h1>
        <p className="text-lg text-pretty text-muted-foreground">
          {t("description")}
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/courses" className={cn(buttonVariants({ size: "lg" }))}>
          {t("courses")}
        </Link>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          {t("home")}
        </Link>
      </div>
    </Container>
  );
}
