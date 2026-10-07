import { useLocale, useTranslations } from "next-intl";
import { cva } from "class-variance-authority";

// Illustrative BTC/USDT order book. Sellers' offers (asks) are above the price, buyers' bids below.
const ASKS = [
  { price: 65_040, amount: 0.42 },
  { price: 65_030, amount: 1.15 },
  { price: 65_020, amount: 0.73 },
  { price: 65_010, amount: 2.05 },
] as const;
const BIDS = [
  { price: 64_990, amount: 1.62 },
  { price: 64_980, amount: 0.38 },
  { price: 64_970, amount: 2.4 },
  { price: 64_960, amount: 0.91 },
] as const;
const LAST_PRICE = 65_000;
const MAX_AMOUNT = Math.max(...[...ASKS, ...BIDS].map((order) => order.amount));

// Token of the depth bar of each side.
const DEPTH_TOKENS = { ask: "var(--bear)", bid: "var(--bull)" } as const;

const priceVariants = cva("font-mono", {
  variants: {
    side: {
      ask: "text-bear",
      bid: "text-bull",
    },
  },
});

type Side = "ask" | "bid";

// Order book of an exchange: offers to sell above the current price, offers to buy below it,
// bars show how much is waiting at each price: <OrderBook />
export function OrderBook() {
  const t = useTranslations("Lesson.diagram.orderBook");
  const locale = useLocale();
  const price = new Intl.NumberFormat(locale);
  const amount = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const row = (order: { price: number; amount: number }, side: Side) => {
    // The bar grows from the right across the whole row; its length is the amount waiting at the price.
    const depth = (order.amount / MAX_AMOUNT) * 100;
    const color = `color-mix(in oklab, ${DEPTH_TOKENS[side]} 15%, transparent)`;
    return (
      <tr
        key={order.price}
        style={{
          background: `linear-gradient(to left, ${color} ${depth}%, transparent ${depth}%)`,
        }}
      >
        <td className="px-3 py-1.5">
          <span className={priceVariants({ side })}>
            {price.format(order.price)}
          </span>
        </td>
        <td className="px-3 py-1.5 text-right font-mono">
          {amount.format(order.amount)}
        </td>
      </tr>
    );
  };

  return (
    <figure className="not-prose my-8 flex flex-col items-center">
      <table className="w-full max-w-sm overflow-hidden rounded-lg border border-border bg-card text-sm">
        <caption className="sr-only">{t("label")}</caption>
        <thead className="text-xs text-muted-foreground">
          <tr className="border-b border-border">
            <th scope="col" className="px-3 py-2 text-left font-medium">
              {t("price")}
            </th>
            <th scope="col" className="px-3 py-2 text-right font-medium">
              {t("amount")}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th
              scope="rowgroup"
              colSpan={2}
              className="px-3 pt-2 text-left text-xs font-medium text-bear"
            >
              {t("asks")}
            </th>
          </tr>
          {ASKS.map((order) => row(order, "ask"))}
          <tr className="border-y border-border bg-muted">
            <td colSpan={2} className="px-3 py-2 text-center font-semibold">
              {t("lastPrice", { price: price.format(LAST_PRICE) })}
            </td>
          </tr>
          {BIDS.map((order) => row(order, "bid"))}
          <tr>
            <th
              scope="rowgroup"
              colSpan={2}
              className="px-3 pb-2 text-left text-xs font-medium text-bull"
            >
              {t("bids")}
            </th>
          </tr>
        </tbody>
      </table>
      <figcaption className="mt-3 max-w-md text-center text-sm text-muted-foreground">
        {t("caption")}
      </figcaption>
    </figure>
  );
}
