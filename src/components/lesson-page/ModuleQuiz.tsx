"use client";

import { useRef, useState } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { cva } from "class-variance-authority";

import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/lib/content/quiz";

type ModuleQuizProps = {
  moduleTitle: string;
  questions: QuizQuestion[];
};

// How an option looks: before checking, and after it (correct answer / wrong choice / the rest).
const optionVariants = cva(
  "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring",
  {
    variants: {
      state: {
        open: "border-border hover:bg-accent has-checked:border-primary has-checked:bg-primary/10",
        correct: "cursor-default border-bull bg-bull/10",
        wrong: "cursor-default border-bear bg-bear/10",
        neutral: "cursor-default border-border opacity-70",
      },
    },
  },
);

const explanationVariants = cva("rounded-lg p-3 text-sm", {
  variants: {
    result: { right: "bg-bull/10", wrong: "bg-bear/10" },
  },
});

function optionState(
  checked: boolean,
  index: number,
  selected: number | undefined,
  answer: number,
) {
  if (!checked) {
    return "open";
  }
  if (index === answer) {
    return "correct";
  }
  return index === selected ? "wrong" : "neutral";
}

// Quiz at the end of a module: answer everything, check, read the explanations, try again.
// Nothing is saved – the result lives only on this page (saving comes with user accounts).
export function ModuleQuiz({ moduleTitle, questions }: ModuleQuizProps) {
  const t = useTranslations("Quiz");
  const [answers, setAnswers] = useState<(number | undefined)[]>(() =>
    questions.map(() => undefined),
  );
  const [checked, setChecked] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const answered = answers.filter((answer) => answer !== undefined).length;
  const correct = questions.filter(
    (question, index) => answers[index] === question.answer,
  ).length;
  const allAnswered = answered === questions.length;

  function retry() {
    setAnswers(questions.map(() => undefined));
    setChecked(false);
    // Back to the start of the quiz, so a keyboard user does not end up at the bottom.
    headingRef.current?.focus();
  }

  return (
    <section
      aria-labelledby="module-quiz"
      className="flex flex-col gap-6 rounded-xl border border-border p-5 sm:p-6"
    >
      <header className="flex flex-col gap-1">
        <h2
          id="module-quiz"
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl font-semibold tracking-tight outline-none"
        >
          {t("title", { module: moduleTitle })}
        </h2>
        <p className="text-muted-foreground">
          {t("intro", { count: questions.length })}
        </p>
      </header>

      <ol className="flex flex-col gap-6">
        {questions.map((question, questionIndex) => {
          const selected = answers[questionIndex];
          const isRight = selected === question.answer;
          return (
            <li key={question.question}>
              <fieldset className="flex flex-col gap-3">
                <legend className="mb-3 font-medium">
                  {questionIndex + 1}. {question.question}
                </legend>
                {question.options.map((option, optionIndex) => {
                  const state = optionState(
                    checked,
                    optionIndex,
                    selected,
                    question.answer,
                  );
                  return (
                    <label key={option} className={optionVariants({ state })}>
                      <input
                        type="radio"
                        name={`quiz-question-${questionIndex}`}
                        value={optionIndex}
                        checked={selected === optionIndex}
                        disabled={checked}
                        onChange={() =>
                          setAnswers((current) =>
                            current.map((answer, index) =>
                              index === questionIndex ? optionIndex : answer,
                            ),
                          )
                        }
                        className="mt-1 size-4 shrink-0 accent-primary"
                      />
                      <span className="flex-1">{option}</span>
                      {state === "correct" && (
                        <CheckIcon
                          aria-label={t("correctAnswer")}
                          className="mt-0.5 size-5 shrink-0 text-bull"
                        />
                      )}
                      {state === "wrong" && (
                        <XIcon
                          aria-label={t("yourAnswer")}
                          className="mt-0.5 size-5 shrink-0 text-bear"
                        />
                      )}
                    </label>
                  );
                })}
                {checked && (
                  <p
                    className={explanationVariants({
                      result: isRight ? "right" : "wrong",
                    })}
                  >
                    <span className="font-semibold">
                      {isRight ? t("right") : t("wrong")}
                    </span>{" "}
                    {question.explanation}
                  </p>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-col gap-3 border-t border-border pt-5">
        {/* Announced by screen readers when the result appears. */}
        <p aria-live="polite" className="font-medium">
          {checked &&
            t(correct === questions.length ? "allCorrect" : "score", {
              correct,
              total: questions.length,
            })}
        </p>
        {checked ? (
          <Button variant="outline" onClick={retry} className="w-fit">
            {t("retry")}
          </Button>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setChecked(true)}
              disabled={!allAnswered}
              className="w-fit"
            >
              {t("check")}
            </Button>
            {!allAnswered && (
              <span className="text-sm text-muted-foreground">
                {t("progress", { answered, total: questions.length })}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
