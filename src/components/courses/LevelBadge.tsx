import { cva, type VariantProps } from "class-variance-authority";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import type { Level } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

// Every level has its own color (tokens --level-* in globals.css), so courses of different
// difficulty can be told apart at a glance: beginner green, intermediate blue, advanced violet.
const levelBadgeVariants = cva("", {
  variants: {
    level: {
      beginner:
        "border-level-beginner/30 bg-level-beginner/10 text-level-beginner",
      intermediate:
        "border-level-intermediate/30 bg-level-intermediate/10 text-level-intermediate",
      advanced:
        "border-level-advanced/30 bg-level-advanced/10 text-level-advanced",
    },
    size: {
      sm: "",
      md: "h-auto px-3 py-1 text-sm",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

type LevelBadgeProps = {
  level: Level;
  // Text instead of the level name, e.g. the longer name on the home page.
  label?: string;
} & Pick<VariantProps<typeof levelBadgeVariants>, "size">;

export function LevelBadge({ level, label, size }: LevelBadgeProps) {
  const t = useTranslations("Courses");

  return (
    <Badge
      variant="outline"
      className={cn(levelBadgeVariants({ level, size }))}
    >
      {label ?? t(`level.${level}`)}
    </Badge>
  );
}
