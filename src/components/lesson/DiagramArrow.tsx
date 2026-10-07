import { ArrowDownIcon, ArrowRightIcon } from "lucide-react";
import { cva } from "class-variance-authority";

/*
 * Flow diagrams react to the width of their own box (CSS container queries), not of the screen:
 * a lesson column is much narrower than the screen next to the outline and table of contents.
 * The diagram's <figure> has `@container`; `row` says from which container width the boxes may sit
 * side by side – the more boxes, the wider it has to be (each box needs ~13rem to stay readable).
 */
export type FlowRow = "2xl" | "3xl" | "5xl";

// Classes of the list holding the boxes and arrows.
export const flowListVariants = cva("flex flex-col items-stretch gap-2", {
  variants: {
    row: {
      "2xl": "@2xl:flex-row", // 3 short boxes: from 42rem
      "3xl": "@3xl:flex-row", // 3 boxes with arrow labels: from 48rem
      "5xl": "@5xl:flex-row", // 4 boxes: from 64rem
    },
  },
});

const downVariants = cva("size-5", {
  variants: {
    row: { "2xl": "@2xl:hidden", "3xl": "@3xl:hidden", "5xl": "@5xl:hidden" },
  },
});

const rightVariants = cva("hidden size-5", {
  variants: {
    row: {
      "2xl": "@2xl:block",
      "3xl": "@3xl:block",
      "5xl": "@5xl:block",
    },
  },
});

type DiagramArrowProps = {
  row: FlowRow;
  // Short text on the arrow, e.g. "one way only".
  label?: string;
};

// Arrow between two boxes: down while the boxes are stacked, right once they sit side by side.
export function DiagramArrow({ row, label }: DiagramArrowProps) {
  return (
    <div
      aria-hidden={label ? undefined : true}
      className="flex shrink-0 flex-col items-center justify-center gap-1 text-muted-foreground"
    >
      <ArrowDownIcon className={downVariants({ row })} aria-hidden="true" />
      <ArrowRightIcon className={rightVariants({ row })} aria-hidden="true" />
      {label && <span className="max-w-24 text-center text-xs">{label}</span>}
    </div>
  );
}
