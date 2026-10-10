import "server-only";

import type { Locale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";

import { absoluteUrl } from "@/i18n/absolute-url";
import { routing } from "@/i18n/routing";
import { sortCourses } from "@/lib/content/course-summary";
import { courseHref, lessonHref } from "@/lib/content/course-navigation";
import { mdxToMarkdown } from "@/lib/content/mdx-to-markdown";
import { SITE_NAME, SITE_URL } from "@/lib/site";

import { getCourses, getLessonSource } from "./content";
import { getPage } from "./pages";

/*
 * The academy for AI assistants (https://llmstxt.org): /llms.txt is a short index of every course and
 * lesson in every language, /<locale>/llms-full.txt the full text of the courses in one language.
 * Both are generated from the content, so new lessons and languages show up on their own.
 */

// "Czech", "čeština" – the language names come from Intl, not from a hand-kept list.
const languageName = (locale: Locale, inLocale: Locale) =>
  new Intl.DisplayNames([inLocale], { type: "language" }).of(locale) ?? locale;

const languageLabel = (locale: Locale) => {
  const english = languageName(locale, routing.defaultLocale);
  const native = languageName(locale, locale);
  return english === native ? english : `${english} (${native})`;
};

export const llmsFullUrl = (locale: Locale) =>
  `${SITE_URL}/${locale}/llms-full.txt`;

const oneLine = (text: string) => text.replace(/\s+/g, " ").trim();

export async function llmsIndex(): Promise<string> {
  const courses = sortCourses(await getCourses());
  const main = routing.defaultLocale;
  const tMetadata = await getTranslations({
    locale: main,
    namespace: "Metadata",
  });
  const languages = routing.locales.map((locale) =>
    languageName(locale, routing.defaultLocale),
  );

  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${tMetadata("description")} Courses are available in ${languages.join(" and ")}.`,
    "",
    "- All courses are free, with no ads, paywalls or tracking cookies. Made by Tom Sramek (https://tomsramek.com).",
    "- Educational content only – not financial advice. Trading crypto carries a high risk of losing money.",
    `- Full text of the courses: ${routing.locales
      .map((locale) => `[${languageLabel(locale)}](${llmsFullUrl(locale)})`)
      .join(", ")}`,
  ];

  for (const locale of routing.locales) {
    const tCourses = await getTranslations({ locale, namespace: "Courses" });
    lines.push("", `## Courses in ${languageLabel(locale)}`);
    for (const course of courses) {
      const lessons = course.modules.flatMap(
        (courseModule) => courseModule.lessons,
      );
      lines.push(
        "",
        `### [${course.meta.title[locale]}](${absoluteUrl(locale, courseHref(course, locale))})`,
        "",
        `${tCourses(`level.${course.meta.level}`)} · ${tCourses("lessons", { count: lessons.length })} · ${oneLine(course.meta.description[locale])}`,
        "",
        ...lessons.map(
          (lesson) =>
            `- [${lesson.meta[locale].title}](${absoluteUrl(locale, lessonHref(course, lesson, locale))}): ${oneLine(lesson.meta[locale].description)}`,
        ),
      );
    }
  }

  const glossary = await getTranslations({
    locale: main,
    namespace: "Glossary",
  });
  const pages = await Promise.all(
    (
      [
        ["risk-warning", "/risk-warning"],
        ["terms", "/terms"],
        ["privacy", "/privacy"],
        ["support", "/support"],
      ] as const
    ).map(async ([name, href]) => {
      const { meta } = await getPage(name, main);
      return `- [${meta.title}](${absoluteUrl(main, href)}): ${oneLine(meta.description)}`;
    }),
  );
  lines.push(
    "",
    "## Optional",
    "",
    `- [${glossary("title")}](${absoluteUrl(main, "/glossary")}): ${oneLine(glossary("description"))}`,
    ...pages,
  );

  return `${lines.join("\n")}\n`;
}

// The caption (or description) of a lesson illustration, from the translations of the locale.
async function illustrationTexts(locale: Locale) {
  const messages: unknown = await getMessages({ locale });
  const lookup = (...keys: string[]) =>
    keys.reduce<unknown>(
      (node, key) =>
        typeof node === "object" && node !== null
          ? Reflect.get(node, key)
          : undefined,
      messages,
    );
  return (name: string) => {
    const text =
      lookup("Lesson", "illustration", name, "caption") ??
      lookup("Lesson", "illustration", name, "label");
    return typeof text === "string" ? text : undefined;
  };
}

export async function llmsFull(locale: Locale): Promise<string> {
  const courses = sortCourses(await getCourses());
  const [tCourses, tFooter, illustration] = await Promise.all([
    getTranslations({ locale, namespace: "Courses" }),
    getTranslations({ locale, namespace: "Footer" }),
    illustrationTexts(locale),
  ]);

  // "https://trading-academy.app/cs", or without the prefix for the default language.
  const siteRoot = absoluteUrl(locale, "/").replace(/\/$/, "");

  const parts = [
    `# ${SITE_NAME} – ${tCourses("title")} (${languageLabel(locale)})`,
    "",
    `> ${tFooter("tagline")} ${tFooter("disclaimer")}`,
  ];

  for (const course of courses) {
    parts.push(
      "",
      `# ${course.meta.title[locale]}`,
      "",
      `${tCourses(`level.${course.meta.level}`)} · ${absoluteUrl(locale, courseHref(course, locale))}`,
      "",
      oneLine(course.meta.description[locale]),
    );
    for (const courseModule of course.modules) {
      for (const lesson of courseModule.lessons) {
        const source = await getLessonSource(course, lesson.slug, locale);
        // One level down: the lesson is "##", its own "##" headings become "###".
        const body = mdxToMarkdown(source ?? "", { illustration })
          .replace(/^(#{2,5}) /gm, "#$1 ")
          // Links between lessons are written without the language prefix ("/kurzy/…").
          .replace(/\]\(\//g, `](${siteRoot}/`);
        parts.push(
          "",
          `## ${lesson.meta[locale].title}`,
          "",
          `${courseModule.meta.title[locale]} · ${absoluteUrl(locale, lessonHref(course, lesson, locale))}`,
          "",
          body,
        );
      }
    }
  }

  return `${parts.join("\n")}\n`;
}
