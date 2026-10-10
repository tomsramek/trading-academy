"use client";

import { useSyncExternalStore } from "react";

import type { Progress } from "@/lib/progress";
import { markLesson, saveQuizResult } from "@/server/actions/progress";

/*
 * The signed-in user's progress in the browser. Course pages are static, so the progress is fetched
 * once from /api/progress and shared by every component on the page; changes show at once
 * (optimistically) and go back if the server refuses them.
 */

export type ProgressState =
  | { status: "loading" }
  | { status: "signedOut" }
  | { status: "error" }
  | { status: "ready"; progress: Progress };

// One object for "loading": useSyncExternalStore needs a stable snapshot for server rendering.
const LOADING: ProgressState = { status: "loading" };

let state: ProgressState = LOADING;
let started = false;
const listeners = new Set<() => void>();

function set(next: ProgressState) {
  state = next;
  listeners.forEach((listener) => listener());
}

export async function loadProgress() {
  started = true;
  set(LOADING);
  try {
    const response = await fetch("/api/progress", { cache: "no-store" });
    if (response.status === 401) {
      set({ status: "signedOut" });
      return;
    }
    if (!response.ok) {
      throw new Error(`GET /api/progress: ${response.status}`);
    }
    set({ status: "ready", progress: (await response.json()) as Progress });
  } catch (error) {
    // The detail goes to the console for debugging; the page shows a friendly message.
    console.error(error);
    set({ status: "error" });
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!started) {
    void loadProgress();
  }
  return () => listeners.delete(listener);
}

/** The progress, loaded on first use. During server rendering it is always "loading". */
export function useProgress(): ProgressState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => LOADING,
  );
}

function update(change: (progress: Progress) => Progress) {
  if (state.status === "ready") {
    set({ status: "ready", progress: change(state.progress) });
  }
}

/** Marks a lesson as done (or not). Returns false when the server refused it. */
export async function toggleLesson(
  course: string,
  lesson: string,
  done: boolean,
) {
  const before = state;
  update((progress) => {
    const current = new Set(progress.lessons[course] ?? []);
    if (done) {
      current.add(lesson);
    } else {
      current.delete(lesson);
    }
    return {
      ...progress,
      lessons: { ...progress.lessons, [course]: [...current] },
    };
  });
  const result = await markLesson({ course, lesson, done }).catch(
    () => undefined,
  );
  if (!result?.ok) {
    set(before);
    return false;
  }
  return true;
}

/** Saves a quiz attempt. Returns false when the server refused it. */
export async function recordQuiz(
  course: string,
  module: string,
  correct: number,
  total: number,
) {
  const before = state;
  update((progress) => {
    const previous = progress.quizzes[course]?.[module];
    return {
      ...progress,
      quizzes: {
        ...progress.quizzes,
        [course]: {
          ...progress.quizzes[course],
          [module]: {
            best: Math.max(previous?.best ?? 0, correct),
            last: correct,
            total,
            attempts: (previous?.attempts ?? 0) + 1,
          },
        },
      },
    };
  });
  const result = await saveQuizResult({ course, module, correct, total }).catch(
    () => undefined,
  );
  if (!result?.ok) {
    set(before);
    return false;
  }
  return true;
}
