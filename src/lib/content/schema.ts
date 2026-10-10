import { z } from "zod";

import { routing } from "@/i18n/routing";

import { LEVELS, type Level } from "./levels";

/*
 * Shape of the course content in content/courses/. Every file is checked against these schemas
 * when the content is loaded, so a mistake stops `yarn build` instead of breaking production.
 *
 * content/courses/<course>/course.json                         → courseSchema
 * content/courses/<course>/<NN-module>/module.json             → moduleSchema
 * content/courses/<course>/<NN-module>/quiz.json               → quizSchema (optional)
 * content/courses/<course>/<NN-module>/<NN-lesson>.<locale>.mdx → lessonSchema (export const metadata)
 * content/pages/<page>.<locale>.mdx                              → pageSchema (export const metadata)
 * content/glossary/terms.json                                    → glossarySchema
 */

export const levelSchema = z.enum(LEVELS);

export { LEVELS, type Level };

// Non-empty text in every language of the site – a missing translation is an error.
const localizedText = z.record(
  z.enum(routing.locales),
  z.string().trim().min(1),
);

// "crypto-basics" – lowercase words separated by dashes, no diacritics; used in URLs.
export const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const slug = z
  .string()
  .regex(SLUG, "lowercase words separated by dashes, without diacritics");

// A non-empty list of texts in every language of the site.
const localizedList = z.record(
  z.enum(routing.locales),
  z.array(z.string().trim().min(1)).min(1),
);

export const courseSchema = z.strictObject({
  title: localizedText,
  description: localizedText,
  // Who the course is for – one or two sentences.
  audience: localizedText,
  // What the reader will be able to do after the course.
  outcomes: localizedList,
  level: levelSchema,
  // Position in the course list within the same level (1 = first).
  order: z.int().positive(),
  // Step on the recommended main path (1 = start here). A course without it is an elective, listed
  // under the main path in the catalog.
  path: z.int().positive().optional(),
  // Cover image path inside public/, e.g. "/courses/crypto-basics.png". Added with the course list (#26).
  image: z.string().startsWith("/").optional(),
  // Work in progress: shown by `yarn dev`, hidden in production until removed.
  draft: z.boolean().optional(),
  // URL slug per language, e.g. { "cs": "zaklady-kryptomen" }. A missing language uses the folder name.
  slug: z.partialRecord(z.enum(routing.locales), slug).optional(),
});

export type CourseMeta = z.infer<typeof courseSchema>;

export const moduleSchema = z.strictObject({
  title: localizedText,
});

export type ModuleMeta = z.infer<typeof moduleSchema>;

// One language version of a lesson, so the texts are plain strings.
export const lessonSchema = z.strictObject({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  // URL slug in this language, e.g. "co-je-blockchain". Without it the file name is used.
  slug: slug.optional(),
  // No reading time here – it is computed from the text (src/lib/content/reading-time.ts).
});

export type LessonMeta = z.infer<typeof lessonSchema>;

// A standalone text page, e.g. the terms of use. One language version, so the texts are plain strings.
export const pageSchema = z.strictObject({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  // Date of the last change of the content, shown on the page: "2026-10-07".
  updated: z.iso.date(),
});

export type PageMeta = z.infer<typeof pageSchema>;

// The glossary: term id (used in <KeyTerm term="…"> and as the anchor /glossary#id) → its texts.
export const glossarySchema = z.record(
  slug,
  z.strictObject({
    text: z.record(
      z.enum(routing.locales),
      z.strictObject({
        term: z.string().trim().min(1),
        definition: z.string().trim().min(1),
      }),
    ),
    // Ids of related terms, shown as links under the definition.
    related: z.array(slug).optional(),
  }),
);

export type GlossaryData = z.infer<typeof glossarySchema>;

// A quiz at the end of a module. `answer` is the index of the correct option, the same in every language.
export const quizSchema = z
  .strictObject({
    questions: z
      .array(
        z.strictObject({
          text: z.record(
            z.enum(routing.locales),
            z.strictObject({
              question: z.string().trim().min(1),
              options: z.array(z.string().trim().min(1)).min(2).max(4),
              // Why the correct answer is right – shown after the quiz is checked.
              explanation: z.string().trim().min(1),
            }),
          ),
          answer: z.int().min(0),
        }),
      )
      .min(1),
  })
  .superRefine((quiz, context) => {
    quiz.questions.forEach((question, index) => {
      const counts = new Set(
        Object.values(question.text).map((text) => text.options.length),
      );
      const [count = 0] = counts;
      if (counts.size > 1) {
        context.addIssue({
          code: "custom",
          path: ["questions", index],
          message: "every language must have the same number of options",
        });
      } else if (question.answer >= count) {
        context.addIssue({
          code: "custom",
          path: ["questions", index, "answer"],
          message: `answer ${question.answer} does not exist – options are numbered from 0 to ${count - 1}`,
        });
      }
    });
  });

export type QuizData = z.infer<typeof quizSchema>;
