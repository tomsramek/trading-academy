import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/Container";
import type { Page } from "@/server/pages";

type TextPageProps = {
  page: Page;
  // Shown under the text, e.g. the donate button on the support page.
  children?: ReactNode;
};

// A standalone text page (terms of use, risk warning): title, date of the last change and the text.
export function TextPage({ page, children }: TextPageProps) {
  const t = useTranslations("TextPage");
  const { meta, Content } = page;

  return (
    <Container className="py-12 sm:py-16">
      <div className="flex max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-4">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {meta.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("updated", { date: new Date(meta.updated) })}
          </p>
        </header>
        <article className="prose prose-lg max-w-none prose-academy">
          <Content />
        </article>
        {children}
      </div>
    </Container>
  );
}
