/*
 * A lesson's MDX source as plain Markdown for AI assistants (llms-full.txt). Components become their
 * text: a video its caption, a picture its alt text, an illustration its caption, an interactive chart
 * its label. Glossary links keep just the word.
 */

export type MdxToMarkdownOptions = {
  // The caption (or description) of <Illustration name="…">, from the translations.
  illustration?: (name: string) => string | undefined;
};

const prop = (tag: string, name: string) =>
  new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)')`)
    .exec(tag)
    ?.slice(1)
    .find((value) => value !== undefined);

// Where a self-closing <Component …/> that starts at `start` ends – quotes and {…} may contain ">".
function tagEnd(source: string, start: number): number {
  let depth = 0;
  let quote: string | undefined;
  for (let index = start + 1; index < source.length; index++) {
    const char = source[index];
    if (quote) {
      if (char === quote) {
        quote = undefined;
      }
    } else if (char === '"' || char === "'" || char === "`") {
      quote = char;
    } else if (char === "{") {
      depth++;
    } else if (char === "}") {
      depth--;
    } else if (char === ">" && depth === 0) {
      return index;
    }
  }
  return source.length - 1;
}

function describe(
  component: string,
  tag: string,
  options: MdxToMarkdownOptions,
): string {
  switch (component) {
    case "Video": {
      const text = prop(tag, "caption") ?? prop(tag, "label");
      return text ? `[Video: ${text}]` : "";
    }
    case "Figure": {
      const text = prop(tag, "caption") ?? prop(tag, "alt");
      return text ? `[Picture: ${text}]` : "";
    }
    case "Illustration": {
      const name = prop(tag, "name");
      const text = name ? options.illustration?.(name) : undefined;
      return text ? `[Illustration: ${text}]` : "";
    }
    default: {
      const text = prop(tag, "label") ?? prop(tag, "caption");
      return text ? `[Interactive: ${text}]` : "";
    }
  }
}

export function mdxToMarkdown(
  source: string,
  options: MdxToMarkdownOptions = {},
): string {
  // Imports and the metadata export at the top are code, not text.
  let text = source
    .replace(/^import\s.*$/gm, "")
    .replace(/^export const metadata = \{[\s\S]*?^\};$/m, "");

  text = text
    .replace(/<KeyTerm\b[^>]*>([\s\S]*?)<\/KeyTerm>/g, "$1")
    .replace(/<Callout\b([^>]*)>/g, (_, attributes: string) => {
      const title = prop(attributes, "title");
      return title ? `**${title}**` : "";
    })
    .replace(/<\/Callout>/g, "");

  // Self-closing components, possibly spread over several lines.
  let result = "";
  let index = 0;
  for (const match of text.matchAll(/<([A-Z][A-Za-z]*)\b/g)) {
    if (match.index < index) {
      continue;
    }
    const end = tagEnd(text, match.index);
    const tag = text.slice(match.index, end + 1);
    result += text.slice(index, match.index);
    result += tag.endsWith("/>")
      ? describe(match[1] ?? "", tag, options)
      : // An opening tag with children: keep the children, drop the tag.
        "";
    index = end + 1;
  }
  result += text.slice(index);

  return result
    .replace(/<\/[A-Z][A-Za-z]*>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
