"use client";

import { useLocale, useTranslations } from "next-intl";
import { cva } from "class-variance-authority";

import type { Book, Level } from "@/lib/content/order-simulator";

type OrderSimulatorBookProps = {
  book: Book;
  // Clicking a price puts it into the order form, as on an exchange.
  onPick: (price: number) => void;
};

// Rows shown on each side – enough to see a big order walk through the book.
const ROWS = 6;

const priceVariants = cva("font-mono", {
  variants: { side: { ask: "text-bear", bid: "text-bull" } },
});

// The simulated order book: sellers above the last price, buyers below.
export function OrderSimulatorBook({ book, onPick }: OrderSimulatorBookProps) {
  const t = useTranslations("Lesson.orderSimulator");
  const locale = useLocale();
  const price = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  const amount = new Intl.NumberFormat(locale, { maximumFractionDigits: 4 });

  const row = (level: Level, side: "ask" | "bid") => (
    <li key={`${side}-${level.price}`}>
      <button
        type="button"
        onClick={() => onPick(level.price)}
        aria-label={t("pickPrice", { price: price.format(level.price) })}
        className="flex w-full justify-between rounded px-2 py-1 text-left hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <span className={priceVariants({ side })}>
          {price.format(level.price)}
        </span>
        <span className="font-mono">{amount.format(level.amount)}</span>
      </button>
    </li>
  );

  return (
    <section
      aria-label={t("book")}
      className="flex flex-col gap-1 rounded-lg border border-border bg-card p-2 text-xs"
    >
      <div className="flex justify-between px-2 pb-1 text-muted-foreground">
        <span>{t("priceEur")}</span>
        <span>{t("amountBtc")}</span>
      </div>
      <ol aria-label={t("asks")} className="flex flex-col-reverse">
        {book.asks.slice(0, ROWS).map((level) => row(level, "ask"))}
      </ol>
      <p className="border-y border-border px-2 py-1.5 font-mono text-sm font-semibold">
        {price.format(book.last)}{" "}
        <span className="font-sans text-xs font-normal text-muted-foreground">
          {t("lastPrice")}
        </span>
      </p>
      <ol aria-label={t("bids")} className="flex flex-col">
        {book.bids.slice(0, ROWS).map((level) => row(level, "bid"))}
      </ol>
    </section>
  );
}
