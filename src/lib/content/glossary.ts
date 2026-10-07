import type { Locale } from "next-intl";

// One glossary term in one language, ready for the page. Plain data, so it can go to the browser.
export type GlossaryEntry = {
  id: string;
  term: string;
  definition: string;
  related: { id: string; term: string }[];
  // Lessons that explain the term (they mark it with <KeyTerm>), with URL slugs in this language.
  lessons: { title: string; course: string; lesson: string }[];
};

export type GlossaryGroup = { letter: string; entries: GlossaryEntry[] };

// Lower case without diacritics, so "paka" finds "Páka".
export function normalizeForSearch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

// "Ch" is one letter in Czech and comes after "H".
function firstLetter(term: string, locale: Locale): string {
  const upper = term.toLocaleUpperCase(locale);
  if (locale === "cs" && upper.startsWith("CH")) {
    return "Ch";
  }
  return upper.charAt(0);
}

/** Terms in alphabetical order of the language, grouped by their first letter. */
export function groupByLetter(
  entries: GlossaryEntry[],
  locale: Locale,
): GlossaryGroup[] {
  const collator = new Intl.Collator(locale);
  const groups: GlossaryGroup[] = [];
  for (const entry of entries.toSorted((a, b) =>
    collator.compare(a.term, b.term),
  )) {
    const letter = firstLetter(entry.term, locale);
    const last = groups.at(-1);
    if (last?.letter === letter) {
      last.entries.push(entry);
    } else {
      groups.push({ letter, entries: [entry] });
    }
  }
  return groups;
}
