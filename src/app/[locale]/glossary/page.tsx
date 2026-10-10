import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { GlossaryList } from "@/components/glossary/GlossaryList";
import { Container } from "@/components/layout/Container";
import { pageMetadata } from "@/i18n/page-metadata";
import { groupByLetter, type GlossaryEntry } from "@/lib/content/glossary";
import { getCourses } from "@/server/content";
import { getGlossary } from "@/server/glossary";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("Glossary"),
  ]);
  return pageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    hrefFor: () => "/glossary",
  });
}

export default async function GlossaryPage() {
  const [locale, t, glossary, courses] = await Promise.all([
    getLocale(),
    getTranslations("Glossary"),
    getGlossary(),
    getCourses(),
  ]);

  const entries: GlossaryEntry[] = Object.entries(glossary).map(
    ([id, entry]) => ({
      id,
      term: entry.text[locale].term,
      definition: entry.text[locale].definition,
      related: (entry.related ?? []).map((other) => ({
        id: other,
        term: glossary[other]?.text[locale].term ?? other,
      })),
      lessons: courses.flatMap((course) =>
        course.modules.flatMap((courseModule) =>
          courseModule.lessons
            .filter((lesson) => lesson.terms.includes(id))
            .map((lesson) => ({
              title: lesson.meta[locale].title,
              course: course.slugs[locale],
              lesson: lesson.slugs[locale],
            })),
        ),
      ),
    }),
  );

  return (
    <Container className="flex flex-col gap-10 py-16 sm:py-20">
      <header className="flex max-w-3xl flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {t("title")}
        </h1>
        <p className="text-xl text-pretty text-muted-foreground">
          {t("description")}
        </p>
      </header>
      <GlossaryList groups={groupByLetter(entries, locale)} />
    </Container>
  );
}
