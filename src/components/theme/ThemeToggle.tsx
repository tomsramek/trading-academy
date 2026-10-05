"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

const THEMES = ["light", "dark", "system"] as const;
type Theme = (typeof THEMES)[number];

const ICONS: Record<Theme, string> = {
  light:
    "M12 3v1.5M12 19.5V21M4.22 4.22l1.06 1.06M18.72 18.72l1.06 1.06M3 12h1.5M19.5 12H21M4.22 19.78l1.06-1.06M18.72 5.28l1.06-1.06M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z",
  dark: "M21.75 15.5A9.72 9.72 0 0 1 8.5 2.25 9.75 9.75 0 1 0 21.75 15.5Z",
  system: "M9 17.25v1.5h6v-1.5M3.75 4.5h16.5v12H3.75z",
};

// True only in the browser – the saved theme is unknown during server rendering.
function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const t = useTranslations("ThemeToggle");
  const { theme, setTheme } = useTheme();
  const isClient = useIsClient();

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="inline-flex gap-1 rounded-full border border-border bg-surface p-1"
    >
      {THEMES.map((value) => {
        const isActive = isClient && theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-pressed={isActive}
            title={t(value)}
            className={`rounded-full p-1.5 transition-colors ${
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path d={ICONS[value]} />
            </svg>
            <span className="sr-only">{t(value)}</span>
          </button>
        );
      })}
    </div>
  );
}
