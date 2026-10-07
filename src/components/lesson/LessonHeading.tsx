import { isValidElement, type ComponentProps, type ReactNode } from "react";
import { useTranslations } from "next-intl";

import { slugify } from "@/lib/slugify";

type LessonHeadingProps = ComponentProps<"h2"> & {
  as: "h2" | "h3";
};

// Heading in a lesson with an id made from its text, so a section can be linked: /lesson#what-is-a-candlestick.
export function LessonHeading({
  as: Tag,
  children,
  ...props
}: LessonHeadingProps) {
  const t = useTranslations("Lesson");
  const text = textOf(children);
  const id = slugify(text);

  return (
    <Tag id={id} className="group scroll-mt-20" {...props}>
      {children}
      <a
        href={`#${id}`}
        aria-label={t("linkToSection", { title: text })}
        className="ml-2 font-normal text-muted-foreground no-underline opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
      >
        #
      </a>
    </Tag>
  );
}

// Plain text of the heading content, also when it contains formatting like **bold**.
function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(textOf).join("");
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return textOf(node.props.children);
  }
  return "";
}
