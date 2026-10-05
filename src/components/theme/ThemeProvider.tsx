"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// next-themes renders an inline <script> that applies the theme before React loads (no flash).
// That script only matters in the server-rendered HTML. When React renders it again in the browser
// (e.g. after switching locale), React 19 warns because client-rendered scripts never run – so on the
// client we mark it as a non-executable data block. suppressHydrationWarning on the script covers the
// differing `type` attribute during hydration.
const scriptProps =
  typeof window === "undefined" ? undefined : { type: "application/json" };

// Adds the `dark` class to <html> based on the user's choice or the OS setting,
// and remembers the choice in localStorage.
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      scriptProps={scriptProps}
    >
      {children}
    </NextThemesProvider>
  );
}
