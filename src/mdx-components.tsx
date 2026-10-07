import type { MDXComponents } from "mdx/types";

import { BlockchainDiagram } from "@/components/lesson/BlockchainDiagram";
import { Callout } from "@/components/lesson/Callout";
import { CandleAnatomy } from "@/components/lesson/CandleAnatomy";
import { CandleChart } from "@/components/lesson/CandleChart";
import { CandlePattern } from "@/components/lesson/CandlePattern";
import { Figure } from "@/components/lesson/Figure";
import { Illustration } from "@/components/lesson/Illustration";
import { KeyTerm } from "@/components/lesson/KeyTerm";
import { LessonHeading } from "@/components/lesson/LessonHeading";
import { LessonLink } from "@/components/lesson/LessonLink";
import { OrderBook } from "@/components/lesson/OrderBook";
import { SharedLedger } from "@/components/lesson/SharedLedger";
import { TransactionFlow } from "@/components/lesson/TransactionFlow";
import { WalletKeys } from "@/components/lesson/WalletKeys";

// Required by @next/mdx: components used for MDX content (lessons).
// Elements of the Markdown text are replaced by our components; their look comes from `prose prose-academy`.
const components: MDXComponents = {
  h2: (props) => <LessonHeading as="h2" {...props} />,
  h3: (props) => <LessonHeading as="h3" {...props} />,
  a: LessonLink,
  // Wide tables scroll sideways instead of stretching the page on phones.
  table: (props) => (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  ),
  // Components available in every lesson without an import.
  BlockchainDiagram,
  Callout,
  CandleAnatomy,
  CandleChart,
  CandlePattern,
  Figure,
  Illustration,
  KeyTerm,
  OrderBook,
  SharedLedger,
  TransactionFlow,
  WalletKeys,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
