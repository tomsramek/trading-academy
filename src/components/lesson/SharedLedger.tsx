import { useTranslations } from "next-intl";
import { BookOpenIcon, CheckIcon, XIcon } from "lucide-react";
import { cva } from "class-variance-authority";

// Five villagers keep the same notebook of payments; one of them "improved" an entry.
const OWNERS = ["peter", "jane", "tom", "eve", "george"] as const;
const CHEATER = "george";
const ENTRIES = ["first", "second", "third"] as const;

const cardVariants = cva("flex flex-col gap-3 rounded-lg border p-4 text-sm", {
  variants: {
    honest: {
      true: "border-border bg-card",
      false: "border-destructive/50 bg-destructive/10",
    },
  },
});

const statusVariants = cva("flex items-center gap-1.5 text-xs font-medium", {
  variants: {
    honest: {
      true: "text-bull",
      false: "text-destructive",
    },
  },
});

// A blockchain explained as a village notebook: <SharedLedger />
export function SharedLedger() {
  const t = useTranslations("Lesson.diagram.sharedLedger");

  return (
    <figure className="not-prose my-8">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {OWNERS.map((owner) => {
          const honest = owner !== CHEATER;
          const StatusIcon = honest ? CheckIcon : XIcon;
          return (
            <li key={owner} className={cardVariants({ honest })}>
              <span className="flex items-center gap-2 font-semibold">
                <BookOpenIcon
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                {t(`owners.${owner}`)}
              </span>
              <ol className="flex flex-col gap-1 text-xs">
                {ENTRIES.map((entry) =>
                  !honest && entry === "first" ? (
                    <li key={entry} className="flex flex-col">
                      <del className="text-muted-foreground">
                        {t(`entries.${entry}`)}
                      </del>
                      <ins className="font-semibold text-destructive no-underline">
                        {t("forged")}
                      </ins>
                    </li>
                  ) : (
                    <li key={entry}>{t(`entries.${entry}`)}</li>
                  ),
                )}
              </ol>
              <span className={statusVariants({ honest })}>
                <StatusIcon className="size-3.5" aria-hidden="true" />
                {honest ? t("matches") : t("differs")}
              </span>
            </li>
          );
        })}
      </ul>
      <figcaption className="mt-3 text-sm text-muted-foreground">
        {t("caption")}
      </figcaption>
    </figure>
  );
}
