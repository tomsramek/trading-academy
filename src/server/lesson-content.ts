import "server-only";

import type { MDXContent, MDXModule } from "mdx/types";
import type { Locale } from "next-intl";

import { lessonLocation, type Course } from "./content";

/*
 * The body of a lesson, imported from its MDX file. In its own module, imported only by the lesson
 * page: the dynamic import below makes the bundler include every lesson – and the client code of their
 * components – in whatever page imports this module.
 */

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
