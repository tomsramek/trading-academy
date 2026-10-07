"use client";

import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import type { CourseSlugs } from "@/lib/content/localized-slugs";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLinks } from "./NavLinks";

// Side drawer (shadcn Sheet on Base UI Dialog): focus trap, Escape, click outside and scroll lock built in.
export function MobileMenu({ courseSlugs }: { courseSlugs: CourseSlugs }) {
  const t = useTranslations("Header");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon" />}>
          <MenuIcon className="size-5" />
          <span className="sr-only">{t("openMenu")}</span>
        </SheetTrigger>
        <SheetContent
          side="right"
          closeLabel={t("closeMenu")}
          className="w-72 gap-0 glass"
        >
          <SheetTitle className="flex h-16 items-center border-b px-4">
            {t("navLabel")}
          </SheetTitle>
          <nav
            aria-label={t("navLabel")}
            className="flex-1 overflow-y-auto px-2 py-4"
          >
            <NavLinks vertical onNavigate={() => setIsOpen(false)} />
          </nav>
          <div className="flex flex-wrap items-center gap-3 border-t p-4">
            <LocaleSwitcher courseSlugs={courseSlugs} side="top" />
            <ThemeToggle />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
