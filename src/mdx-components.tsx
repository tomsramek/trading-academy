import type { MDXComponents } from "mdx/types";

import { Callout } from "@/components/lesson/Callout";
import { CandleChart } from "@/components/lesson/CandleChart";
import { Figure } from "@/components/lesson/Figure";
import { KeyTerm } from "@/components/lesson/KeyTerm";
import { LessonHeading } from "@/components/lesson/LessonHeading";
import { LessonLink } from "@/components/lesson/LessonLink";

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
  Callout,
  CandleChart,
  Figure,
  KeyTerm,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
