import { z } from "zod";

import { routing } from "@/i18n/routing";

/*
 * Shape of the course content in content/courses/. Every file is checked against these schemas
 * when the content is loaded, so a mistake stops `yarn build` instead of breaking production.
 *
 * content/courses/<course>/course.json                         → courseSchema
 * content/courses/<course>/<NN-module>/module.json             → moduleSchema
 * content/courses/<course>/<NN-module>/<NN-lesson>.<locale>.mdx → lessonSchema (export const metadata)
 */

export const LEVELS = ["beginner", "intermediate", "advanced"] as const;

export const levelSchema = z.enum(LEVELS);

export type Level = z.infer<typeof levelSchema>;

// Non-empty text in every language of the site – a missing translation is an error.
const localizedText = z.record(
  z.enum(routing.locales),
  z.string().trim().min(1),
);

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
  // Cover image path inside public/, e.g. "/courses/crypto-basics.png". Added with the course list (#26).
  image: z.string().startsWith("/").optional(),
  // Work in progress: shown by `yarn dev`, hidden in production until removed.
  draft: z.boolean().optional(),
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
  // Estimated reading time in minutes.
  minutes: z.int().positive(),
});

export type LessonMeta = z.infer<typeof lessonSchema>;
