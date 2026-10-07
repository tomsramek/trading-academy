"use client";

import { useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { normalizeForSearch, type GlossaryGroup } from "@/lib/content/glossary";
import { cn } from "@/lib/utils";

const TERM_LINK =
  "rounded-sm text-link underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

// Terms grouped by letter with a search box. The server renders the whole list (every term has its
// anchor in the HTML); typing filters it in the browser.
export function GlossaryList({ groups }: { groups: GlossaryGroup[] }) {
  const t = useTranslations("Glossary");
  const [query, setQuery] = useState("");

  const search = normalizeForSearch(query.trim());

  // A related term may be hidden by the search, so its anchor does not exist yet. Clear the search,
  // let React render the whole list right away, then jump to the term.
  function showTerm(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (!search) {
      return;
    }
    event.preventDefault();
    flushSync(() => setQuery(""));
    document.getElementById(id)?.scrollIntoView();
    window.history.pushState(null, "", `#${id}`);
  }
  const visible = search
    ? groups
        .map((group) => ({
          ...group,
          entries: group.entries.filter((entry) =>
            normalizeForSearch(`${entry.term} ${entry.definition}`).includes(
              search,
            ),
          ),
        }))
        .filter((group) => group.entries.length > 0)
    : groups;

  return (
    <div className="flex flex-col gap-8">
      {/* Stays under the sticky header while scrolling, so the search and the letters are always at hand. */}
      <div className="sticky top-16 z-20 -mx-4 flex flex-col gap-3 border-b border-border glass px-4 py-3 sm:-mx-6 sm:px-6">
        <div className="flex max-w-xl flex-col gap-2">
          <label htmlFor="glossary-search" className="text-sm font-medium">
            {t("searchLabel")}
          </label>
          <div className="relative">
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              id="glossary-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              autoComplete="off"
              className="h-11 w-full rounded-md border border-input bg-transparent pr-3 pl-9 text-base placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            />
          </div>
        </div>

        {!search && (
          <nav aria-label={t("letters")}>
            {/* One row; on narrow screens it scrolls sideways instead of taking up half the screen. */}
            <ul className="flex gap-1 overflow-x-auto pb-1">
              {groups.map((group) => (
                <li key={group.letter}>
                  <a
                    href={`#letter-${group.letter}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "min-w-9",
                    )}
                  >
                    {group.letter}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border p-8">
          <p className="text-lg font-medium">{t("empty", { query })}</p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            {t("clear")}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {visible.map((group) => (
            <section
              key={group.letter}
              id={`letter-${group.letter}`}
              aria-labelledby={`letter-${group.letter}-heading`}
              className="flex scroll-mt-52 flex-col gap-4"
            >
              <h2
                id={`letter-${group.letter}-heading`}
                className="border-b border-border pb-2 text-2xl font-semibold"
              >
                {group.letter}
              </h2>
              <dl className="grid gap-2 lg:grid-cols-2">
                {group.entries.map((entry) => (
                  <div
                    key={entry.id}
                    id={entry.id}
                    className="flex scroll-mt-52 flex-col gap-2 rounded-lg p-4"
                  >
                    <dt className="text-lg font-semibold">{entry.term}</dt>
                    <dd className="text-muted-foreground">
                      {entry.definition}
                    </dd>
                    {entry.lessons.length > 0 && (
                      <dd className="text-sm">
                        <span className="text-muted-foreground">
                          {t("lessons")}:{" "}
                        </span>
                        {entry.lessons.map((lesson, index) => (
                          <span key={`${lesson.course}/${lesson.lesson}`}>
                            {index > 0 && ", "}
                            <Link
                              href={{
                                pathname: "/courses/[course]/[lesson]",
                                params: {
                                  course: lesson.course,
                                  lesson: lesson.lesson,
                                },
                              }}
                              className={TERM_LINK}
                            >
                              {lesson.title}
                            </Link>
                          </span>
                        ))}
                      </dd>
                    )}
                    {entry.related.length > 0 && (
                      <dd className="text-sm">
                        <span className="text-muted-foreground">
                          {t("related")}:{" "}
                        </span>
                        {entry.related.map((related, index) => (
                          <span key={related.id}>
                            {index > 0 && ", "}
                            <a
                              href={`#${related.id}`}
                              onClick={(event) => showTerm(event, related.id)}
                              className={TERM_LINK}
                            >
                              {related.term}
                            </a>
                          </span>
                        ))}
                      </dd>
                    )}
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
