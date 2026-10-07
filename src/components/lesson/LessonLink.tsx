import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRightIcon } from "lucide-react";

import { Link } from "@/i18n/navigation";

// Links in a lesson: pages of the academy keep the current language, other websites open in a new tab.
export function LessonLink({
  href = "",
  children,
  ...props
}: ComponentProps<"a">) {
  const t = useTranslations("Lesson");

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <ArrowUpRightIcon
        aria-hidden="true"
        className="ml-0.5 inline size-[0.9em] align-baseline"
      />
      <span className="sr-only"> ({t("opensInNewTab")})</span>
    </a>
  );
}
