import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import type { MDXContent, MDXModule } from "mdx/types";
import type { Locale } from "next-intl";
import { cache } from "react";
import { z } from "zod";

import { routing } from "@/i18n/routing";
import { readingMinutes } from "@/lib/content/reading-time";
import { slugify } from "@/lib/slugify";
import type { CourseSlugs } from "@/lib/content/localized-slugs";
import {
  courseSchema,
  lessonSchema,
  moduleSchema,
  SLUG,
  type CourseMeta,
  type LessonMeta,
  type ModuleMeta,
} from "@/lib/content/schema";

/*
 * Loads the courses from content/courses/ (structure described in @/lib/content/schema).
 * Everything is validated while loading – any mistake throws an error that names the file,
 * so `yarn build` stops before broken content reaches production.
 */

const COURSES_DIR = path.join(process.cwd(), "content", "courses");

// "01-blockchain" – two-digit position + slug (modules and lessons).
const ORDERED_SLUG = /^(\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)$/;

export type Lesson = {
  // From the file name; identifies the lesson in the code. URLs use `slugs`.
  slug: string;
  // URL slug per language – the "slug" from the lesson metadata, otherwise `slug`.
  slugs: Record<Locale, string>;
  order: number;
  // Metadata from the lesson file + reading time computed from its text, per language.
  meta: Record<Locale, LessonMeta & { minutes: number }>;
};

export type Module = {
  slug: string;
  order: number;
  meta: ModuleMeta;
  lessons: Lesson[];
};

export type Course = {
  // The folder name; identifies the course in the code. URLs use `slugs`.
  slug: string;
  // URL slug per language – "slug" from course.json, otherwise `slug`.
  slugs: Record<Locale, string>;
  meta: CourseMeta;
  modules: Module[];
};

class ContentError extends Error {
  constructor(file: string, problem: string) {
    super(
      `Invalid content in ${path.relative(process.cwd(), file)}:\n${problem}`,
    );
    this.name = "ContentError";
  }
}

function parseWith<T>(schema: z.ZodType<T>, data: unknown, file: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ContentError(file, z.prettifyError(result.error));
  }
  return result.data;
}

async function readJson(file: string): Promise<unknown> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch (error) {
    throw new ContentError(file, String(error));
  }
}

async function listDirectories(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function parseOrderedName(name: string, file: string) {
  const match = ORDERED_SLUG.exec(name);
  if (!match) {
    throw new ContentError(file, `"${name}" must look like "01-some-name"`);
  }
  // The regex has two groups, so both exist when it matches.
  const [, order = "", slug = ""] = match;
  return { order: Number(order), slug };
}

// The bundler includes every file matching the static parts of the path – the folder at the start and
// ".mdx" at the end – so other files in content/courses (README.md) are left out.
function importLesson(
  course: string,
  moduleDir: string,
  lesson: string,
  locale: Locale,
): Promise<MDXModule> {
  return import(
    `../../content/courses/${course}/${moduleDir}/${lesson}.${locale}.mdx`
  );
}

async function loadLesson(
  course: string,
  moduleDir: string,
  baseName: string,
): Promise<Lesson> {
  const dir = path.join(COURSES_DIR, course, moduleDir);
  const { order, slug } = parseOrderedName(baseName, path.join(dir, baseName));

  const entries = await Promise.all(
    routing.locales.map(async (locale) => {
      const file = `${baseName}.${locale}.mdx`;
      const mdx = await importLesson(course, moduleDir, baseName, locale).catch(
        () => {
          throw new ContentError(path.join(dir, file), "missing translation");
        },
      );
      const metadata: unknown = "metadata" in mdx ? mdx.metadata : undefined;
      const meta = parseWith(lessonSchema, metadata, path.join(dir, file));
      const source = await fs.readFile(path.join(dir, file), "utf8");
      // MDX turns a line starting with <KeyTerm> into its own block and splits the sentence.
      const brokenLine = source
        .split("\n")
        .findIndex((line) => /^\s*<KeyTerm\b/.test(line));
      if (brokenLine !== -1) {
        throw new ContentError(
          path.join(dir, file),
          `line ${brokenLine + 1}: <KeyTerm> must not start a line – keep the text before it on the same line`,
        );
      }
      return [
        locale,
        { ...meta, minutes: readingMinutes(source, locale) },
      ] as const;
    }),
  );

  const meta = Object.fromEntries(entries) as Lesson["meta"];
  return {
    slug,
    slugs: localizedSlugs(slug, (locale) => meta[locale].slug),
    order,
    meta,
  };
}

function localizedSlugs(
  fallback: string,
  slugFor: (locale: Locale) => string | undefined,
): Record<Locale, string> {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, slugFor(locale) ?? fallback]),
  ) as Record<Locale, string>;
}

function assertUnique(values: string[], what: string, file: string) {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      throw new ContentError(
        file,
        `${what} "${value}" exists more than once – it must be unique`,
      );
    }
    seen.add(value);
  }
}

// Two pages of one language must not share a URL – e.g. two lessons with the same Czech slug.
function assertUniqueSlugs(
  items: { slugs: Record<Locale, string> }[],
  what: string,
  file: string,
) {
  for (const locale of routing.locales) {
    assertUnique(
      items.map((item) => item.slugs[locale]),
      `${what} (${locale})`,
      file,
    );
  }
}

async function loadModule(course: string, moduleDir: string): Promise<Module> {
  const dir = path.join(COURSES_DIR, course, moduleDir);
  const { order, slug } = parseOrderedName(moduleDir, dir);
  const meta = parseWith(
    moduleSchema,
    await readJson(path.join(dir, "module.json")),
    path.join(dir, "module.json"),
  );

  // "01-what-is-bitcoin.en.mdx" + "01-what-is-bitcoin.cs.mdx" → one lesson "01-what-is-bitcoin".
  const files = await fs.readdir(dir);
  const baseNames = [
    ...new Set(
      files
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => file.split(".")[0] ?? ""),
    ),
  ].sort();

  const lessons = await Promise.all(
    baseNames.map((baseName) => loadLesson(course, moduleDir, baseName)),
  );
  return { slug, order, meta, lessons };
}

async function loadCourse(slug: string): Promise<Course> {
  const dir = path.join(COURSES_DIR, slug);
  if (!SLUG.test(slug)) {
    throw new ContentError(
      dir,
      `"${slug}" must be lowercase words separated by dashes`,
    );
  }
  const meta = parseWith(
    courseSchema,
    await readJson(path.join(dir, "course.json")),
    path.join(dir, "course.json"),
  );
  const modules = await Promise.all(
    (await listDirectories(dir)).map((moduleDir) =>
      loadModule(slug, moduleDir),
    ),
  );

  // Lesson URLs are /courses/<course>/<lesson> without the module, so lesson slugs must be unique per course
  // – both the file names and the URL slugs in every language.
  const lessons = modules.flatMap((courseModule) => courseModule.lessons);
  assertUnique(
    lessons.map((lesson) => lesson.slug),
    "lesson file name",
    dir,
  );
  assertUniqueSlugs(lessons, "lesson slug", dir);

  return {
    slug,
    slugs: localizedSlugs(slug, (locale) => meta.slug?.[locale]),
    meta,
    modules,
  };
}

/**
 * All courses, validated. Cached for one render, so several components can call it freely.
 * Draft courses (`"draft": true` in course.json) are left out of production builds.
 */
export const getCourses = cache(async (): Promise<Course[]> => {
  const slugs = await listDirectories(COURSES_DIR).catch((error: unknown) => {
    // No content/courses folder yet = no courses (the pages show their empty state).
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  });
  const courses = await Promise.all(slugs.map(loadCourse));
  assertUniqueSlugs(courses, "course slug", COURSES_DIR);
  return process.env.NODE_ENV === "production"
    ? courses.filter((course) => !course.meta.draft)
    : courses;
});

/** The course with this URL slug in the given language. */
export async function getCourse(
  slug: string,
  locale: Locale,
): Promise<Course | undefined> {
  return (await getCourses()).find((course) => course.slugs[locale] === slug);
}

/** URL slugs of every course and its lessons, for switching the language of a page. */
export async function getCourseSlugs(): Promise<CourseSlugs> {
  return (await getCourses()).map((course) => ({
    slugs: course.slugs,
    lessons: course.modules.flatMap((courseModule) =>
      courseModule.lessons.map((lesson) => lesson.slugs),
    ),
  }));
}

// Folder and file name of a lesson: "01-blockchain", "02-what-is-bitcoin" (without ".<locale>.mdx").
function lessonLocation(course: Course, lessonSlug: string) {
  for (const courseModule of course.modules) {
    const lesson = courseModule.lessons.find(
      (item) => item.slug === lessonSlug,
    );
    if (lesson) {
      return {
        moduleDir: `${String(courseModule.order).padStart(2, "0")}-${courseModule.slug}`,
        file: `${String(lesson.order).padStart(2, "0")}-${lesson.slug}`,
      };
    }
  }
  return undefined;
}

/** The lesson body as a React component, e.g. `<Content />`. */
export async function getLessonContent(
  course: Course,
  lessonSlug: string,
  locale: Locale,
): Promise<MDXContent | undefined> {
  const location = lessonLocation(course, lessonSlug);
  if (!location) {
    return undefined;
  }
  const mdx = await importLesson(
    course.slug,
    location.moduleDir,
    location.file,
    locale,
  );
  return mdx.default;
}

export type LessonHeading = {
  level: 2 | 3;
  text: string;
  // Same id as the rendered heading gets (LessonHeading uses the same slugify).
  id: string;
};

/**
 * "## Heading" and "### Heading" lines of a lesson for its table of contents, read from the MDX source.
 * Lines inside ``` code blocks are skipped.
 */
export async function getLessonHeadings(
  course: Course,
  lessonSlug: string,
  locale: Locale,
): Promise<LessonHeading[]> {
  const location = lessonLocation(course, lessonSlug);
  if (!location) {
    return [];
  }
  const source = await fs.readFile(
    path.join(
      COURSES_DIR,
      course.slug,
      location.moduleDir,
      `${location.file}.${locale}.mdx`,
    ),
    "utf8",
  );

  const headings: LessonHeading[] = [];
  let inCode = false;
  for (const line of source.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    const match = inCode ? null : /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (match?.[1] && match[2]) {
      // Plain text without Markdown formatting: **bold**, _italic_, `code`, [link](url).
      const text = match[2]
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/[*_`]/g, "");
      headings.push({
        level: match[1].length === 2 ? 2 : 3,
        text,
        id: slugify(text),
      });
    }
  }
  return headings;
}
