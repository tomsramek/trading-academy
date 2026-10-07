import { Fragment } from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { DiagramArrow, flowListVariants } from "./DiagramArrow";

// Made-up, shortened hashes – only the link between the blocks matters.
const BLOCKS = [
  { number: 1, hash: "00a7f3…9c21", previous: "000000…0000", transactions: 3 },
  { number: 2, hash: "00c41e…5b08", previous: "00a7f3…9c21", transactions: 5 },
  { number: 3, hash: "009d2b…e7f4", previous: "00c41e…5b08", transactions: 2 },
] as const;

// Three blocks of a blockchain, each storing the fingerprint (hash) of the previous one:
// <BlockchainDiagram />
export function BlockchainDiagram() {
  const t = useTranslations("Lesson.diagram.blockchain");

  return (
    <figure className="not-prose @container my-8">
      <ol className={flowListVariants({ row: "2xl" })}>
        {BLOCKS.map((block, index) => (
          <Fragment key={block.number}>
            {index > 0 && (
              <li
                aria-hidden="true"
                className="flex items-center justify-center"
              >
                <DiagramArrow row="2xl" />
              </li>
            )}
            <li className="flex flex-1 flex-col gap-2 rounded-lg border border-border bg-card p-4 text-sm">
              <span className="font-semibold">
                {t("block", { number: block.number })}
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">
                  {t("previous")}
                </span>
                {/* The previous hash has the color of the block it points to. */}
                <HashChip linked={index > 0}>{block.previous}</HashChip>
              </span>
              <span className="text-muted-foreground">
                {t("transactions", { count: block.transactions })}
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">
                  {t("hash")}
                </span>
                <HashChip linked={index < BLOCKS.length - 1}>
                  {block.hash}
                </HashChip>
              </span>
            </li>
          </Fragment>
        ))}
      </ol>
      <figcaption className="mt-3 text-sm text-muted-foreground">
        {t("caption")}
      </figcaption>
    </figure>
  );
}

// A hash; `linked` hashes (stored in the next block) are highlighted.
function HashChip({ linked, children }: { linked: boolean; children: string }) {
  return (
    <code
      className={cn(
        "w-fit rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs",
        linked && "bg-primary/10 text-primary",
      )}
    >
      {children}
    </code>
  );
}
