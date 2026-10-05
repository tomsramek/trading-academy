"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { NavLinks } from "./NavLinks";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function MobileMenu() {
  const t = useTranslations("Header");
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // While open: close on Escape, stop the page behind from scrolling, move focus into the panel.
  // After closing: return focus to the menu button.
  useEffect(() => {
    if (!isOpen) {
      if (wasOpen.current) openButtonRef.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);
  const isClient = useIsClient();

  return (
    <div className="md:hidden">
      <button
        ref={openButtonRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="rounded-md p-2 text-muted hover:bg-surface hover:text-foreground"
      >
        <span className="sr-only">{t("openMenu")}</span>
        <MenuIcon />
      </button>

      {/* Rendered at the end of <body>: the glass header (backdrop-filter) would otherwise trap
          these fixed elements inside its own box. Only in the browser – document does not exist on the server. */}
      {isClient &&
        createPortal(
          <>
            {/* Frosted-glass backdrop – fades in, closes the menu on click. */}
            <div
              aria-hidden="true"
              onClick={close}
              className={`fixed inset-0 z-40 glass-backdrop transition-opacity duration-300 motion-reduce:transition-none md:hidden ${
                isOpen ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            />

            {/* Glass drawer – slides in from the right. `inert` keeps the closed panel out of the tab order. */}
            <div
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-label={t("navLabel")}
              inert={!isOpen}
              className={`fixed inset-y-0 right-0 z-50 flex w-72 max-w-full flex-col border-l border-border glass shadow-xl transition-transform duration-300 ease-out motion-reduce:transition-none md:hidden ${
                isOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="flex h-16 items-center justify-end border-b border-border px-4">
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={close}
                  className="rounded-md p-2 text-muted hover:bg-surface hover:text-foreground"
                >
                  <span className="sr-only">{t("closeMenu")}</span>
                  <CloseIcon />
                </button>
              </div>

              <nav
                aria-label={t("navLabel")}
                className="flex-1 overflow-y-auto px-2 py-4"
              >
                <NavLinks vertical onNavigate={close} />
              </nav>

              <div className="border-t border-border p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <LocaleSwitcher placement="top" />
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}

// True only in the browser (false during server rendering).
function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="size-6"
    >
      <path
        strokeLinecap="round"
        d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="size-6"
    >
      <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}
