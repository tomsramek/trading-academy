import { cn } from "@/lib/utils";

// The Trading Academy mark: a candlestick wearing a graduation cap (trading + academy).
// Same drawing as src/app/icon.svg, but in theme colors. Decorative – the site name is next to it.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={cn("size-8 shrink-0", className)}
    >
      <rect width="64" height="64" rx="14" className="fill-primary" />
      <g
        className="fill-primary-foreground stroke-primary-foreground"
        strokeLinecap="round"
      >
        <line x1="32" y1="26" x2="32" y2="56" strokeWidth="3" />
        <rect x="25" y="30" width="14" height="20" rx="2" />
        <polygon
          points="12,20 32,11 52,20 32,29"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <line x1="47" y1="22" x2="47" y2="33" strokeWidth="2.5" />
        <circle cx="47" cy="35" r="2.6" className="stroke-none" />
      </g>
    </svg>
  );
}
