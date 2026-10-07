import type { Locale } from "next-intl";

/*
 * Reading time of a lesson, computed from its MDX source at build time – never written by hand.
 *   text:    words / reading speed (Czech words are longer, so fewer per minute)
 *   visuals: extra seconds for looking at charts, diagrams and images
 * Rounded up to whole minutes, at least 1.
 */

const WORDS_PER_MINUTE: Record<Locale, number> = { en: 200, cs: 180 };

// Seconds to look at each kind of visual component in a lesson.
const VISUAL_SECONDS: Record<string, number> = {
  CandleChart: 60,
  BlockchainDiagram: 30,
  TransactionFlow: 30,
  WalletKeys: 30,
  OrderBook: 30,
  SharedLedger: 30,
  CandlePattern: 15,
  CandleAnatomy: 15,
  Figure: 15,
  Illustration: 15,
};

export function readingMinutes(source: string, locale: Locale): number {
  const visualSeconds = [...source.matchAll(/<([A-Z]\w*)\b/g)].reduce(
    (sum, [, name = ""]) => sum + (VISUAL_SECONDS[name] ?? 0),
    0,
  );

  const text = source
    // `import …` and `export const metadata = { … };` are code, not text.
    .replace(/^import .*$/gm, "")
    .replace(/^export [\s\S]*?\};?\s*$/gm, "")
    // Self-closing components with their props: <CandleChart data={btc} … />
    // ([^>] keeps the match inside one tag – it must not run on into the text of <Callout>…)
    .replace(/<[A-Z]\w*\b[^>]*\/>/g, "")
    // Remaining tags (their content stays – e.g. the text inside <Callout>).
    .replace(/<\/?[A-Za-z][^>]*>/g, " ")
    // Link targets: [text](url) → text
    .replace(/\]\([^)]*\)/g, "]");

  const words = text
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word)).length;

  const minutes = words / WORDS_PER_MINUTE[locale] + visualSeconds / 60;
  return Math.max(1, Math.ceil(minutes));
}
