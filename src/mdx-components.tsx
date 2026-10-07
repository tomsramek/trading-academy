import type { MDXComponents } from "mdx/types";

// Required by @next/mdx: components used for MDX content (lessons).
// Custom headings, links and lesson components are added in #25.
const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return components;
}
