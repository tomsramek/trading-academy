import { z } from "zod";

/*
 * The signed-in user's progress as the browser sees it (GET /api/progress) and the inputs of the
 * Server Actions that change it. Ids are content folder and file names, the same in every language.
 */

export type QuizResult = {
  best: number;
  last: number;
  total: number;
  attempts: number;
};

export type Progress = {
  // Done lessons per course: { "crypto-basics": ["what-is-bitcoin", …] }.
  lessons: Record<string, string[]>;
  // Quiz results per course and module.
  quizzes: Record<string, Record<string, QuizResult>>;
};

// "crypto-basics", "what-is-bitcoin" – the shape of every id in content/.
const id = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(80);

export const lessonDoneSchema = z.strictObject({
  course: id,
  lesson: id,
  done: z.boolean(),
});
export type LessonDoneInput = z.infer<typeof lessonDoneSchema>;

export const quizResultSchema = z
  .strictObject({
    course: id,
    module: id,
    correct: z.int().min(0),
    total: z.int().min(1).max(50),
  })
  .refine((result) => result.correct <= result.total, {
    message: "correct must not be more than total",
  });
export type QuizResultInput = z.infer<typeof quizResultSchema>;
