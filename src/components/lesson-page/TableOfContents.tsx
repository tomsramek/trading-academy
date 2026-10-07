import { cn } from "@/lib/utils";
import type { LessonHeading } from "@/server/content";

// Links to the sections of a lesson (its ## and ### headings).
export function TableOfContents({ headings }: { headings: LessonHeading[] }) {
  return (
    <ul className="flex flex-col gap-1 text-sm">
      {headings.map((heading) => (
        <li key={heading.id}>
          <a
            href={`#${heading.id}`}
            className={cn(
              "block py-1 text-muted-foreground transition-colors hover:text-foreground",
              heading.level === 3 && "pl-3",
            )}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
