import type { Locale } from "next-intl";

import type { QuizData } from "./schema";

// One quiz question in one language. Plain data, so it can go to the browser.
export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export function toQuizQuestions(
  quiz: QuizData,
  locale: Locale,
): QuizQuestion[] {
  return quiz.questions.map(({ text, answer }) => ({
    ...text[locale],
    answer,
  }));
}
