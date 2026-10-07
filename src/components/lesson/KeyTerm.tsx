import type { ReactNode } from "react";

type KeyTermProps = {
  // Id of the term in the glossary, e.g. "market-order".
  term: string;
  children: ReactNode;
};

// Important term that will link to its explanation in the glossary:
// <KeyTerm term="market-order">market order</KeyTerm>
// Until the glossary exists (#30) it is plain text, so no lesson links to a missing page.
// #30 turns it into a link and makes the build fail when a term is missing in the glossary.
export function KeyTerm({ children }: KeyTermProps) {
  return <>{children}</>;
}
