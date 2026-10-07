import { ArrowDownIcon, ArrowRightIcon } from "lucide-react";

type DiagramArrowProps = {
  // Short text on the arrow, e.g. "one way only".
  label?: string;
};

// Arrow between two boxes of a diagram: down on phones (boxes are stacked), right from md up (side by side).
export function DiagramArrow({ label }: DiagramArrowProps) {
  return (
    <div
      aria-hidden={label ? undefined : true}
      className="flex shrink-0 flex-col items-center justify-center gap-1 text-muted-foreground"
    >
      <ArrowDownIcon className="size-5 md:hidden" aria-hidden="true" />
      <ArrowRightIcon className="hidden size-5 md:block" aria-hidden="true" />
      {label && <span className="max-w-24 text-center text-xs">{label}</span>}
    </div>
  );
}
