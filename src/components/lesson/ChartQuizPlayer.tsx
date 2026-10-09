"use client";

import { useId, useState } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cva } from "class-variance-authority";

import { Button } from "@/components/ui/button";
import { isCorrect, type ChartQuizData } from "@/lib/content/chart-quiz";

import { MiniChart } from "./MiniChart";

type ChartQuizPlayerProps = {
  quiz: ChartQuizData;
  question: string;
  explanation: string;
  label: string;
};

const resultVariants = cva("flex gap-2 rounded-lg p-3 text-sm", {
  variants: {
    result: { right: "bg-bull/10", wrong: "bg-bear/10" },
  },
});

// Keys that pick the candle under the slider – not Tab, which only moves the focus onto it.
const PICK_KEYS = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
  "PageUp",
  "PageDown",
  "Enter",
  " ",
]);

// Pick a candle by clicking the chart or with the slider (keyboard), then check it.
export function ChartQuizPlayer({
  quiz,
  question,
  explanation,
  label,
}: ChartQuizPlayerProps) {
  const t = useTranslations("Lesson.chartQuiz");
  const locale = useLocale();
  const sliderId = useId();
  const [selected, setSelected] = useState<number | undefined>(undefined);
  const [checked, setChecked] = useState(false);

  const last = quiz.candles.length - 1;
  const price = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  const day = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  });
  const dateOf = (index: number) =>
    day.format((quiz.candles[index]?.time ?? 0) * 1000);
  const describe = (index: number) => {
    const candle = quiz.candles[index];
    return candle
      ? t("candle", {
          date: dateOf(index),
          open: price.format(candle.open),
          high: price.format(candle.high),
          low: price.format(candle.low),
          close: price.format(candle.close),
        })
      : "";
  };
  const right = selected !== undefined && isCorrect(selected, quiz.answer);
  const [answerFrom, answerTo] = quiz.answer;

  function choose(index: number) {
    if (!checked) {
      setSelected(Math.max(0, Math.min(index, last)));
    }
  }

  return (
    <section
      aria-label={label}
      className="flex flex-col gap-4 rounded-xl border border-border p-4 sm:p-5"
    >
      <p className="font-medium">{question}</p>
      <MiniChart
        candles={quiz.candles}
        overlay={quiz.overlay}
        panel={quiz.panel}
        selected={selected}
        answer={checked ? quiz.answer : undefined}
        onCandleClick={checked ? undefined : choose}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor={sliderId} className="text-xs text-muted-foreground">
          {t("pick")}
        </label>
        <input
          id={sliderId}
          type="range"
          min={0}
          max={last}
          value={selected ?? Math.floor(last / 2)}
          disabled={checked}
          aria-valuetext={
            selected === undefined ? t("nothing") : describe(selected)
          }
          onChange={(event) => choose(Number(event.target.value))}
          // Choosing the candle the slider already stands on fires no change event.
          onPointerUp={(event) => choose(Number(event.currentTarget.value))}
          onKeyUp={(event) => {
            if (PICK_KEYS.has(event.key)) {
              choose(Number(event.currentTarget.value));
            }
          }}
          className="w-full accent-primary disabled:opacity-50"
        />
        <p className="min-h-10 text-sm">
          {selected === undefined ? t("nothing") : describe(selected)}
        </p>
      </div>

      {/* Announced by screen readers when the result appears. */}
      <div aria-live="polite">
        {checked && (
          <p className={resultVariants({ result: right ? "right" : "wrong" })}>
            {right ? (
              <CheckIcon
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-bull"
              />
            ) : (
              <XIcon
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-bear"
              />
            )}
            <span>
              <span className="font-semibold">
                {right ? t("right") : t("wrong")}
              </span>{" "}
              {answerFrom === answerTo
                ? t("answerOne", { date: dateOf(answerFrom) })
                : t("answerRange", {
                    from: dateOf(answerFrom),
                    to: dateOf(answerTo),
                  })}{" "}
              {explanation}
            </span>
          </p>
        )}
      </div>

      {checked ? (
        <Button
          variant="outline"
          className="w-fit"
          onClick={() => {
            setChecked(false);
            setSelected(undefined);
          }}
        >
          {t("retry")}
        </Button>
      ) : (
        <Button
          className="w-fit"
          disabled={selected === undefined}
          onClick={() => setChecked(true)}
        >
          {t("check")}
        </Button>
      )}
    </section>
  );
}
