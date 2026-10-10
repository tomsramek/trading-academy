import {
  BookOpenCheckIcon,
  CalendarCheckIcon,
  GraduationCapIcon,
  ListChecksIcon,
  LockIcon,
  RouteIcon,
  TargetIcon,
  TrophyIcon,
} from "lucide-react";
import { cva } from "class-variance-authority";

import type { BadgeIcon, BadgeTone } from "@/lib/badges";
import { cn } from "@/lib/utils";

const ICONS = {
  course: GraduationCapIcon,
  path: RouteIcon,
  lessons: BookOpenCheckIcon,
  quiz: ListChecksIcon,
  perfect: TargetIcon,
  trophy: TrophyIcon,
  days: CalendarCheckIcon,
} as const satisfies Record<BadgeIcon, unknown>;

// The medal in the badge's colour; a badge not earned yet is grey with a lock.
const medalVariants = cva(
  "relative flex size-16 items-center justify-center rounded-full border-4",
  {
    variants: {
      tone: {
        beginner:
          "border-level-beginner bg-level-beginner/15 text-level-beginner",
        intermediate:
          "border-level-intermediate bg-level-intermediate/15 text-level-intermediate",
        advanced:
          "border-level-advanced bg-level-advanced/15 text-level-advanced",
        gold: "border-chart-3 bg-chart-3/15 text-chart-3",
        blue: "border-chart-1 bg-chart-1/15 text-chart-1",
        green: "border-chart-2 bg-chart-2/15 text-chart-2",
        violet: "border-chart-5 bg-chart-5/15 text-chart-5",
      },
      earned: {
        true: "",
        false: "border-dashed border-border bg-muted text-muted-foreground",
      },
    },
  },
);

const ribbonVariants = cva("absolute -bottom-2 h-6 w-3 rounded-b-sm", {
  variants: {
    tone: {
      beginner: "bg-level-beginner/60",
      intermediate: "bg-level-intermediate/60",
      advanced: "bg-level-advanced/60",
      gold: "bg-chart-3/60",
      blue: "bg-chart-1/60",
      green: "bg-chart-2/60",
      violet: "bg-chart-5/60",
    },
    earned: { true: "", false: "bg-border" },
  },
});

// A badge as a medal with a ribbon. Decorative – the text next to it says what it is.
export function BadgeMedal({
  icon,
  tone,
  earned,
  className,
}: {
  icon: BadgeIcon;
  tone: BadgeTone;
  earned: boolean;
  className?: string;
}) {
  const Icon = ICONS[icon];
  return (
    <span
      aria-hidden="true"
      className={cn("relative inline-flex pb-2", className)}
    >
      <span
        className={cn(ribbonVariants({ tone, earned }), "left-3 -rotate-12")}
      />
      <span
        className={cn(ribbonVariants({ tone, earned }), "right-3 rotate-12")}
      />
      <span className={medalVariants({ tone, earned })}>
        <Icon className="size-7" />
        {!earned && (
          <span className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full border border-border bg-background">
            <LockIcon className="size-3.5" />
          </span>
        )}
      </span>
    </span>
  );
}
