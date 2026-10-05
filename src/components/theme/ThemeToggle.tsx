"use client";

import { useSyncExternalStore } from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const THEMES = [
  { value: "light", Icon: SunIcon },
  { value: "dark", Icon: MoonIcon },
  { value: "system", Icon: MonitorIcon },
] as const;

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
    <ToggleGroup
      aria-label={t("label")}
      variant="outline"
      size="sm"
      value={isClient && theme ? [theme] : []}
      // Base UI reports the pressed items as an array; ignore "unpressing" the active one.
      onValueChange={(value) => value[0] && setTheme(value[0])}
    >
      {THEMES.map(({ value, Icon }) => (
        <ToggleGroupItem
          key={value}
          value={value}
          aria-label={t(value)}
          title={t(value)}
        >
          <Icon />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
