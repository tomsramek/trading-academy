"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import { ListIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type LessonOutlineSheetProps = {
  courseTitle: string;
  // The outline, rendered on the server.
  children: ReactNode;
};

// On phones and tablets the course outline opens in a side panel (on large screens it is a sidebar).
export function LessonOutlineSheet({
  courseTitle,
  children,
}: LessonOutlineSheetProps) {
  const t = useTranslations("LessonPage");
  const [isOpen, setIsOpen] = useState(false);

  // Close the panel when a lesson link inside it is clicked.
  const closeOnLink = (event: MouseEvent<HTMLElement>) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger render={<Button variant="outline" size="sm" />}>
        <ListIcon aria-hidden="true" />
        {t("outline")}
      </SheetTrigger>
      <SheetContent
        side="left"
        closeLabel={t("closeOutline")}
        className="w-80 gap-0 glass"
      >
        <SheetTitle className="flex min-h-16 items-center border-b px-4 pr-12">
          {courseTitle}
        </SheetTitle>
        <nav
          aria-label={t("outline")}
          onClick={closeOnLink}
          className="flex-1 overflow-y-auto p-3"
        >
          {children}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
