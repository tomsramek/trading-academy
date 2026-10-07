import type { ReactNode } from "react";

import { Link } from "@/i18n/navigation";

type KeyTermProps = {
  // Id of the term in the glossary (content/glossary/terms.json), e.g. "stop-loss".
  term: string;
  children: ReactNode;
};

// Important term linking to its explanation in the glossary:
// <KeyTerm term="stop-loss">stop-loss</KeyTerm>
// The build fails when the term is missing in the glossary (src/server/content.ts).
export function KeyTerm({ term, children }: KeyTermProps) {
  return (
    <Link
      href={{ pathname: "/glossary", hash: term }}
      className="rounded-sm font-medium text-foreground underline decoration-muted-foreground decoration-dotted underline-offset-4 hover:decoration-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {children}
    </Link>
  );
}
