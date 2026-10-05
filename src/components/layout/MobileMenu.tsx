"use client";

import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function MobileMenu() {
  const t = useTranslations("Header");
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  // Close the menu with the Escape key.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="rounded-md p-2 text-muted hover:bg-surface hover:text-foreground"
      >
        <span className="sr-only">
          {isOpen ? t("closeMenu") : t("openMenu")}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="size-6"
        >
          {isOpen ? (
            <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
          ) : (
            <path
              strokeLinecap="round"
              d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
            />
          )}
        </svg>
      </button>

      {isOpen && (
        <div
          id={panelId}
          className="absolute inset-x-0 top-full border-b border-border bg-background px-4 pt-2 pb-4 shadow-sm"
        >
          <nav aria-label={t("navLabel")}>
            <NavLinks vertical onNavigate={() => setIsOpen(false)} />
          </nav>
          <div className="mt-3 border-t border-border pt-3">
            <ThemeToggle />
          </div>
        </div>
      )}
    </div>
  );
}
