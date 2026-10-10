"use client";

import { useSyncExternalStore } from "react";
import { ChevronDownIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const THEMES = [
  { value: "light", Icon: SunIcon },
  { value: "dark", Icon: MoonIcon },
  { value: "system", Icon: MonitorIcon },
] as const;

type Theme = (typeof THEMES)[number]["value"];

// True only in the browser – the saved theme is unknown during server rendering.
function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

type ThemeToggleProps = {
  // "bottom" opens the menu below the button (header), "top" above it (bottom of the mobile menu).
  side?: "bottom" | "top";
};

// Light, dark or the system's choice – a menu like the language switcher.
export function ThemeToggle({ side = "bottom" }: ThemeToggleProps) {
  const t = useTranslations("ThemeToggle");
  const { theme, setTheme } = useTheme();
  const isClient = useIsClient();
  // Before hydration the saved choice is unknown: show the system icon, which is the default.
  const current: Theme =
    isClient && (theme === "light" || theme === "dark") ? theme : "system";
  const CurrentIcon =
    THEMES.find(({ value }) => value === current)?.Icon ?? MonitorIcon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
        <CurrentIcon />
        <span className="sr-only">
          {t("label")}: {t(current)}
        </span>
        <ChevronDownIcon className="size-3 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} align="end" className="w-44 glass">
        <DropdownMenuRadioGroup
          value={current}
          onValueChange={(value: Theme) => setTheme(value)}
        >
          {THEMES.map(({ value, Icon }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              <Icon />
              {t(value)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
