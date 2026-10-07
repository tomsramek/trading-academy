import type { ReactNode } from "react";

import { Link } from "@/i18n/navigation";

type KeyTermProps = {
  // Id of the term in the glossary (#30), e.g. "market-order".
  term: string;
  children: ReactNode;
};

// Important term linked to its explanation in the glossary:
// <KeyTerm term="market-order">market order</KeyTerm>
export function KeyTerm({ term, children }: KeyTermProps) {
  return (
    <Link
      href={`/glossary#${term}`}
      className="font-medium text-foreground underline decoration-muted-foreground decoration-dotted underline-offset-4 hover:decoration-foreground"
    >
      {children}
    </Link>
  );
}
