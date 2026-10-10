"use client";

import { useState } from "react";
import { CheckCircle2Icon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { loadProgress, toggleLesson, useProgress } from "@/lib/progress-store";
import { track } from "@/lib/analytics";

type LessonDoneProps = {
  course: string;
  lesson: string;
  // The module whose quiz ends this lesson – then the lesson is done by taking the quiz.
  quizModule?: string;
};

// The end of a lesson: mark it as done – or, signed out, an invitation to sign in.
export function LessonDone({ course, lesson, quizModule }: LessonDoneProps) {
  const t = useTranslations("Progress.lesson");
  const progress = useProgress();
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  if (progress.status === "loading") {
    // The same height as the finished box, so the page does not jump.
    return (
      <div
        role="status"
        aria-label={t("loading")}
        className="h-[4.5rem] animate-pulse rounded-xl bg-muted"
      />
    );
  }

  if (progress.status === "signedOut") {
    return (
      <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
        {t.rich("signIn", {
          link: (chunks) => (
            <Link
              href="/sign-in"
              className="font-medium text-foreground underline underline-offset-2"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>
    );
  }

  if (progress.status === "error") {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border p-4 text-sm">
        <span>{t("loadError")}</span>
        <Button variant="outline" size="sm" onClick={() => void loadProgress()}>
          {t("retry")}
        </Button>
      </div>
    );
  }

  const done = progress.progress.lessons[course]?.includes(lesson) ?? false;
  const quizTaken =
    quizModule === undefined ||
    progress.progress.quizzes[course]?.[quizModule] !== undefined;

  if (!done && !quizTaken) {
    return (
      <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
        {t("quizFirst")}
      </p>
    );
  }

  async function toggle() {
    setPending(true);
    setFailed(false);
    const ok = await toggleLesson(course, lesson, !done);
    setPending(false);
    setFailed(!ok);
    if (ok && !done) {
      track("lesson-done", { course, lesson });
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4">
      <p aria-live="polite" className="flex items-center gap-2 font-medium">
        {done ? (
          <>
            <CheckCircle2Icon aria-hidden="true" className="size-5 text-bull" />
            {t("done")}
          </>
        ) : (
          t("question")
        )}
      </p>
      <div className="flex items-center gap-3">
        {failed && <span className="text-sm text-bear">{t("saveError")}</span>}
        <Button
          variant={done ? "ghost" : "default"}
          onClick={toggle}
          disabled={pending}
        >
          {done ? t("undo") : t("markDone")}
        </Button>
      </div>
    </div>
  );
}
