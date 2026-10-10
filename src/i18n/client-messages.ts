import type { AbstractIntlMessages } from "next-intl";

/**
 * Translations that components running in the browser read. Only these are sent with every page –
 * the rest (lesson illustrations, e-mails, the home page…) stays on the server. A test walks the
 * client components and fails when one of them uses a namespace that is missing here.
 */
export const CLIENT_NAMESPACES = [
  "Auth.account",
  "Auth.header",
  "Auth.signIn",
  "Badges.courseFinished",
  "Courses",
  "Glossary",
  "Header",
  "Home.hero.carousel",
  "Lesson.chart",
  "Lesson.chartQuiz",
  "Lesson.indicatorPeriod",
  "Lesson.indicatorSteps",
  "Lesson.orderSimulator",
  "LessonPage",
  "LocaleSwitcher",
  "Progress",
  "Quiz",
  "ThemeToggle",
] as const;

const isMessages = (value: unknown): value is AbstractIntlMessages =>
  typeof value === "object" && value !== null;

const isMessageValue = (
  value: unknown,
): value is AbstractIntlMessages[string] =>
  typeof value === "string" || isMessages(value);

/** The given dotted paths of the messages ("Lesson.chart"), with the nesting kept. */
export function pickMessages(
  messages: Record<string, unknown>,
  paths: readonly string[],
): AbstractIntlMessages {
  const picked: AbstractIntlMessages = {};
  for (const path of paths) {
    const keys = path.split(".");
    const leaf = keys.pop();
    // Walk down to the parent of the picked value in both objects.
    let source: Record<string, unknown> | undefined = messages;
    let target = picked;
    for (const key of keys) {
      const nextSource: unknown = source?.[key];
      source = isMessages(nextSource) ? nextSource : undefined;
      const nextTarget = target[key];
      target = target[key] = isMessages(nextTarget) ? nextTarget : {};
    }
    const value = leaf === undefined ? undefined : source?.[leaf];
    if (leaf !== undefined && isMessageValue(value)) {
      target[leaf] = value;
    }
  }
  return picked;
}
