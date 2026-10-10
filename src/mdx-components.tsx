import type { MDXComponents } from "mdx/types";

import { Callout } from "@/components/lesson/Callout";
import { LessonHeading } from "@/components/lesson/LessonHeading";
import { LessonLink } from "@/components/lesson/LessonLink";

// Required by @next/mdx: components for every MDX file – lessons and the text pages (terms, privacy…).
// Elements of the Markdown text are replaced by our components; their look comes from `prose prose-academy`.
// Lesson-only components (charts, quizzes, illustrations…) are passed by the lesson page instead
// (lessonComponents.tsx): listed here, their client code would be sent with every text page too.
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
  // Components available in every MDX file without an import.
  Callout,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
