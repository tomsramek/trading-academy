"use client";

import { useEffect, useId, useRef, useState } from "react";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { getPathname, usePathname } from "@/i18n/navigation";
import { LANGUAGES } from "@/i18n/languages";
import { routing } from "@/i18n/routing";

type Props = {
  // "bottom" opens the list below the button (header), "top" above it (bottom of the mobile menu).
  placement?: "bottom" | "top";
};

export function LocaleSwitcher({ placement = "bottom" }: Props) {
  const t = useTranslations("LocaleSwitcher");
  const currentLocale = useLocale();
  // Current path without the locale prefix, e.g. "/courses" for both /courses and /cs/courses.
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  // While open: close on Escape or on a click outside the switcher.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node))
        setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={listId}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-background"
      >
        <GlobeIcon />
        <span aria-hidden="true">{LANGUAGES[currentLocale].short}</span>
        <span className="sr-only">
          {t("label")}: {LANGUAGES[currentLocale].name}
        </span>
        <ChevronIcon
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <ul
          id={listId}
          aria-label={t("label")}
          className={`absolute right-0 z-50 min-w-40 rounded-xl border border-border glass p-1 shadow-lg ${
            placement === "top" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {routing.locales.map((locale) => {
            const isActive = locale === currentLocale;
            return (
              <li key={locale}>
                {/* getPathname gives "/" for English and "/cs/…" for Czech. next-intl's <Link locale> would
                    always add a prefix (/en), which then only redirects back to "/". */}
                <NextLink
                  href={getPathname({ href: pathname, locale })}
                  lang={locale}
                  hrefLang={locale}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm ${
                    isActive
                      ? "font-medium text-foreground"
                      : "text-muted hover:bg-surface hover:text-foreground"
                  }`}
                >
                  {LANGUAGES[locale].name}
                  {isActive && <CheckIcon />}
                </NextLink>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="size-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0c2.5-2.4 3.75-5.4 3.75-9S14.5 5.4 12 3m0 18c-2.5-2.4-3.75-5.4-3.75-9S9.5 5.4 12 3M3.5 9h17M3.5 15h17"
      />
    </svg>
  );
}

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={`size-3 ${className}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="size-4 text-link"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m5 12.5 4.5 4.5L19 7.5"
      />
    </svg>
  );
}
