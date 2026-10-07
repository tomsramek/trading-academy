import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { cva } from "class-variance-authority";
import {
  LightbulbIcon,
  ShieldAlertIcon,
  TriangleAlertIcon,
} from "lucide-react";

const calloutVariants = cva(
  "my-8 flex gap-3 rounded-lg border-l-4 p-4 text-base leading-relaxed [&_p]:my-0 [&_p+p]:mt-3",
  {
    variants: {
      type: {
        tip: "border-primary bg-primary/10",
        warning: "border-warning bg-warning/10",
        risk: "border-destructive bg-destructive/10",
      },
    },
  },
);

const iconVariants = cva("mt-0.5 size-5 shrink-0", {
  variants: {
    type: {
      tip: "text-primary",
      warning: "text-warning",
      risk: "text-destructive",
    },
  },
});

const ICONS = {
  tip: LightbulbIcon,
  warning: TriangleAlertIcon,
  risk: ShieldAlertIcon,
} as const;

type CalloutProps = {
  type?: keyof typeof ICONS;
  // Replaces the default title ("Tip", "Warning", "Risk").
  title?: string;
  children: ReactNode;
};

// Highlighted box in a lesson: <Callout type="warning">Never invest money you cannot afford to lose.</Callout>
export function Callout({ type = "tip", title, children }: CalloutProps) {
  const t = useTranslations("Lesson.callout");
  const Icon = ICONS[type];

  return (
    <aside className={calloutVariants({ type })}>
      <Icon aria-hidden="true" className={iconVariants({ type })} />
      <div className="min-w-0 text-foreground">
        <p className="font-semibold">{title ?? t(type)}</p>
        <div className="mt-1">{children}</div>
      </div>
    </aside>
  );
}
