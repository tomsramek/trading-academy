"use client";

import { useId, useRef, useState } from "react";
import { AlertTriangleIcon, CheckIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cva } from "class-variance-authority";

import { Button } from "@/components/ui/button";
import {
  FEES,
  START_BALANCES,
  START_BOOK,
  cancelOrder,
  orderSchema,
  parseNumber,
  shareOfBalance,
  simulate,
  stopLimitOutcomes,
  type Book,
  type OpenOrder,
  type Order,
  type OrderType,
  type Side,
  type Simulation,
  type SimulationError,
} from "@/lib/content/order-simulator";
import { cn } from "@/lib/utils";

import { OrderSimulatorBook } from "./OrderSimulatorBook";

type OrderSimulatorPanelProps = {
  initialSide: Side;
  initialType: OrderType;
  label: string;
};

type Fields = { price: string; stop: string; amount: string; total: string };
type FieldName = keyof Fields;
type FieldErrors = Partial<Record<FieldName, "required" | "positive">>;

const EMPTY: Fields = { price: "", stop: "", amount: "", total: "" };
const SHARES = [0.25, 0.5, 0.75, 1] as const;
const TYPES = ["limit", "market", "stopLimit"] as const;

const choiceVariants = cva(
  "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
  {
    variants: {
      active: {
        true: "bg-background shadow-sm",
        false: "text-muted-foreground hover:text-foreground",
      },
    },
  },
);

// Text in the page background color: dark on the brighter dark-theme green and red, white in light.
const submitVariants = cva("w-full text-background", {
  variants: {
    side: { buy: "bg-bull hover:bg-bull/85", sell: "bg-bear hover:bg-bear/85" },
  },
});

const noticeVariants = cva("flex gap-2 rounded-lg p-3 text-sm", {
  variants: {
    tone: {
      warning: "bg-chart-3/15",
      error: "bg-bear/10",
      success: "bg-bull/10",
      neutral: "bg-muted",
    },
  },
});

// The practice order panel: fill in an order, read the preview, confirm and see what the market did.
export function OrderSimulatorPanel({
  initialSide,
  initialType,
  label,
}: OrderSimulatorPanelProps) {
  const t = useTranslations("Lesson.orderSimulator");
  const locale = useLocale();
  const formId = useId();
  const resultRef = useRef<HTMLDivElement>(null);

  const [book, setBook] = useState<Book>(START_BOOK);
  const [balances, setBalances] = useState(START_BALANCES);
  const [openOrders, setOpenOrders] = useState<OpenOrder[]>([]);
  const [side, setSide] = useState<Side>(initialSide);
  const [type, setType] = useState<OrderType>(initialType);
  const [fields, setFields] = useState<Fields>(EMPTY);
  // A market buy can say how much to spend instead of how much to buy.
  const [byTotal, setByTotal] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [refused, setRefused] = useState<SimulationError | undefined>();
  const [preview, setPreview] = useState<
    { order: Order; simulation: Simulation } | undefined
  >();
  const [done, setDone] = useState<
    { order: Order; simulation: Simulation } | undefined
  >();

  const eur = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });
  const btc = new Intl.NumberFormat(locale, { maximumFractionDigits: 6 });
  const percent = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  // Numbers the panel writes into the fields: in the page's format, without spaces between thousands.
  const plain = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 6,
    useGrouping: false,
  });

  const bestPrice = (side === "buy" ? book.asks : book.bids)[0]?.price;
  const priceForTotal =
    type === "market" ? bestPrice : parseNumber(fields.price);

  function edit(name: FieldName, text: string) {
    setPreview(undefined);
    setRefused(undefined);
    setErrors((current) => ({ ...current, [name]: undefined }));
    const next = { ...fields, [name]: text };
    // Price × amount = total: editing one of them fills in the other, as on an exchange.
    const priceValue =
      name === "price" ? parseNumber(text) : (priceForTotal ?? undefined);
    if (name === "total") {
      setByTotal(true);
      const total = parseNumber(text);
      next.amount =
        total !== undefined && priceValue
          ? plain.format(total / priceValue)
          : "";
    } else if (name === "amount" || name === "price") {
      if (name === "amount") {
        setByTotal(false);
      }
      const amount = parseNumber(next.amount);
      next.total =
        amount !== undefined && priceValue
          ? plain.format(Math.round(amount * priceValue * 100) / 100)
          : next.total;
    }
    setFields(next);
  }

  function pickShare(share: number) {
    const price = priceForTotal ?? book.last;
    const amount = shareOfBalance(side, share, balances, price);
    setByTotal(false);
    setPreview(undefined);
    setRefused(undefined);
    setErrors({});
    setFields({
      ...fields,
      amount: plain.format(Math.floor(amount * 1e6) / 1e6),
      total: plain.format(Math.round(amount * price * 100) / 100),
    });
  }

  function review() {
    setDone(undefined);
    const order = {
      side,
      type,
      price: type === "market" ? undefined : parseNumber(fields.price),
      stop: type === "stopLimit" ? parseNumber(fields.stop) : undefined,
      amount:
        type === "market" && side === "buy" && byTotal
          ? undefined
          : parseNumber(fields.amount),
      total:
        type === "market" && side === "buy" && byTotal
          ? parseNumber(fields.total)
          : undefined,
    };
    const parsed = orderSchema.safeParse(order);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && field in EMPTY) {
          next[field as FieldName] =
            issue.message === "positive" ? "positive" : "required";
        }
      }
      setErrors(next);
      return;
    }
    const simulation = simulate(parsed.data, book, balances);
    if ("error" in simulation) {
      setRefused(simulation.error);
      return;
    }
    setPreview({ order: parsed.data, simulation });
  }

  function confirm() {
    if (!preview) {
      return;
    }
    const { order, simulation } = preview;
    const { resting, pending } = simulation;
    setBook(simulation.book);
    setBalances(simulation.balances);
    const id = Date.now();
    if (resting) {
      setOpenOrders((current) => [
        ...current,
        { id, side: order.side, type: "limit", ...resting },
      ]);
    }
    if (pending) {
      setOpenOrders((current) => [
        ...current,
        { id, side: order.side, type: "stopLimit", ...pending },
      ]);
    }
    setDone(preview);
    setPreview(undefined);
    setFields(EMPTY);
    // Keyboard and screen reader users land on the result.
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  function cancel(order: OpenOrder) {
    const next = cancelOrder(order, book, balances);
    setBook(next.book);
    setBalances(next.balances);
    setOpenOrders((current) => current.filter((item) => item.id !== order.id));
  }

  function restart() {
    setBook(START_BOOK);
    setBalances(START_BALANCES);
    setOpenOrders([]);
    setFields(EMPTY);
    setErrors({});
    setRefused(undefined);
    setPreview(undefined);
    setDone(undefined);
  }

  const field = (name: FieldName, unit: string) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={`${formId}-${name}`} className="text-xs font-medium">
        {t(`field.${name}`)}
      </label>
      <div className="flex items-center rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
        <input
          id={`${formId}-${name}`}
          inputMode="decimal"
          autoComplete="off"
          value={fields[name]}
          onChange={(event) => edit(name, event.target.value)}
          aria-invalid={errors[name] ? true : undefined}
          aria-describedby={
            errors[name] ? `${formId}-${name}-error` : undefined
          }
          className="min-w-0 flex-1 bg-transparent px-2 py-1.5 font-mono text-sm outline-none"
        />
        <span className="px-2 text-xs text-muted-foreground">{unit}</span>
      </div>
      {errors[name] && (
        <p id={`${formId}-${name}-error`} className="text-xs text-bear">
          {t(`error.${errors[name]}`)}
        </p>
      )}
    </div>
  );

  return (
    <section
      aria-label={label}
      className="flex flex-col gap-4 rounded-xl border border-border p-4 sm:p-5"
    >
      <p className="text-sm text-muted-foreground">{t("intro")}</p>
      <div className="grid gap-4 sm:grid-cols-[minmax(0,13rem)_1fr]">
        <OrderSimulatorBook
          book={book}
          onPick={(price) => edit("price", plain.format(price))}
        />

        <form
          className="flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            review();
          }}
        >
          <div
            role="group"
            aria-label={t("sideLabel")}
            className="flex gap-1 rounded-lg bg-muted p-1"
          >
            {(["buy", "sell"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={side === option}
                onClick={() => {
                  setSide(option);
                  setPreview(undefined);
                  setRefused(undefined);
                }}
                className={choiceVariants({ active: side === option })}
              >
                {t(`side.${option}`)}
              </button>
            ))}
          </div>
          <div
            role="group"
            aria-label={t("typeLabel")}
            className="flex gap-1 rounded-lg bg-muted p-1"
          >
            {TYPES.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={type === option}
                onClick={() => {
                  setType(option);
                  setPreview(undefined);
                  setRefused(undefined);
                  setErrors({});
                }}
                className={choiceVariants({ active: type === option })}
              >
                {t(`type.${option}`)}
              </button>
            ))}
          </div>

          {type === "stopLimit" && field("stop", "EUR")}
          {type !== "market" ? (
            field("price", "EUR")
          ) : (
            <p className="rounded-md border border-dashed border-border px-2 py-1.5 text-xs text-muted-foreground">
              {t("marketPrice")}
            </p>
          )}
          {field("amount", "BTC")}
          <div className="flex gap-1">
            {SHARES.map((share) => (
              <Button
                key={share}
                type="button"
                variant="outline"
                size="xs"
                className="flex-1"
                onClick={() => pickShare(share)}
              >
                {percent.format(share * 100)} %
              </Button>
            ))}
          </div>
          {(type !== "market" || side === "buy") && field("total", "EUR")}
          <p className="text-xs text-muted-foreground">
            {t("available", {
              eur: eur.format(balances.quote),
              btc: btc.format(balances.base),
            })}
          </p>
          <Button type="submit" className={submitVariants({ side })}>
            {t(`submit.${side}`)}
          </Button>
        </form>
      </div>

      <div aria-live="polite" className="flex flex-col gap-3">
        {refused && (
          <p className={noticeVariants({ tone: "error" })}>
            <AlertTriangleIcon
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-bear"
            />
            {t(`refused.${refused}`)}
          </p>
        )}

        {preview && (
          <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
            <p className="font-semibold">{t("previewTitle")}</p>
            <p className="text-sm">
              {summary(preview.order, preview.simulation)}
            </p>
            {preview.simulation.warnings.map((warning) => (
              <p
                key={warning.kind}
                className={noticeVariants({ tone: "warning" })}
              >
                <AlertTriangleIcon
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-chart-3"
                />
                {warning.kind === "farFromPrice"
                  ? t("warning.farFromPrice", {
                      percent: percent.format(Math.abs(warning.percent)),
                      direction: warning.percent < 0 ? "below" : "above",
                    })
                  : t(`warning.${warning.kind}`)}
              </p>
            ))}
            <div className="flex flex-wrap gap-2">
              <Button onClick={confirm}>{t("confirm")}</Button>
              <Button variant="outline" onClick={() => setPreview(undefined)}>
                {t("edit")}
              </Button>
            </div>
          </div>
        )}

        {done && (
          <div
            ref={resultRef}
            tabIndex={-1}
            className={cn(
              noticeVariants({ tone: "success" }),
              "flex-col outline-none",
            )}
          >
            <p className="flex items-center gap-2 font-semibold">
              <CheckIcon aria-hidden="true" className="size-4 text-bull" />
              {t("doneTitle")}
            </p>
            <p>{result(done.order, done.simulation)}</p>
          </div>
        )}
      </div>

      {openOrders.length > 0 && (
        <section aria-label={t("openOrders")} className="flex flex-col gap-2">
          <p className="text-sm font-semibold">{t("openOrders")}</p>
          <ul className="flex flex-col gap-2">
            {openOrders.map((order) => (
              <li
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm"
              >
                <span>
                  {order.type === "stopLimit"
                    ? t("openStop", {
                        side: order.side,
                        amount: btc.format(order.amount),
                        stop: eur.format(order.stop ?? 0),
                        price: eur.format(order.price),
                      })
                    : t("openLimit", {
                        side: order.side,
                        amount: btc.format(order.amount),
                        price: eur.format(order.price),
                      })}
                </span>
                <Button variant="ghost" size="sm" onClick={() => cancel(order)}>
                  {t("cancel")}
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
        <span>
          {t("fees", {
            maker: percent.format(FEES.maker * 100),
            taker: percent.format(FEES.taker * 100),
          })}
        </span>
        <Button variant="ghost" size="sm" onClick={restart}>
          {t("restart")}
        </Button>
      </div>
    </section>
  );

  // What the order will do, in one or two sentences – read before confirming.
  function summary(order: Order, simulation: Simulation) {
    if (simulation.pending) {
      const outcomes = stopLimitOutcomes(order.side, simulation.pending);
      return `${t("summary.stop", {
        side: order.side,
        amount: btc.format(simulation.pending.amount),
        stop: eur.format(simulation.pending.stop),
        price: eur.format(simulation.pending.price),
      })} ${t(outcomes.jumpFills ? "summary.jumpFills" : "summary.jumpMisses", {
        jump: eur.format(outcomes.jumpPrice),
      })}`;
    }
    const parts: string[] = [];
    if (simulation.filled > 0) {
      parts.push(
        t("summary.fills", {
          side: order.side,
          amount: btc.format(simulation.filled),
          average: eur.format(simulation.averagePrice ?? 0),
          levels: simulation.fills.length,
          fee: eur.format(simulation.fee),
        }),
      );
    }
    if (simulation.slippage !== undefined && simulation.slippage > 0) {
      parts.push(
        t("summary.slippage", {
          slippage: percent.format(simulation.slippage),
        }),
      );
    }
    if (simulation.resting) {
      parts.push(
        t("summary.rests", {
          side: order.side,
          amount: btc.format(simulation.resting.amount),
          price: eur.format(simulation.resting.price),
          fee: percent.format(FEES.maker * 100),
        }),
      );
    }
    return parts.join(" ");
  }

  // What happened after confirming, with the new balance.
  function result(order: Order, simulation: Simulation) {
    return `${summary(order, simulation)} ${t("balanceNow", {
      eur: eur.format(simulation.balances.quote),
      btc: btc.format(simulation.balances.base),
    })}`;
  }
}
