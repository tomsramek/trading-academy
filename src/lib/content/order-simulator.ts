import { z } from "zod";

/*
 * The practice order panel: an illustrative BTC/EUR market with a thin order book, so a big market
 * order visibly walks up the book. Nothing here talks to an exchange – it is a simulation.
 */

export type Level = { price: number; amount: number };
export type Book = { asks: Level[]; bids: Level[]; last: number };
export type Balances = { base: number; quote: number };

export const SIDES = ["buy", "sell"] as const;
export type Side = (typeof SIDES)[number];
export const ORDER_TYPES = ["limit", "market", "stopLimit"] as const;
export type OrderType = (typeof ORDER_TYPES)[number];

// The fees of the lesson on maker and taker fees (illustrative, the lowest tier).
export const FEES = { maker: 0.001, taker: 0.002 } as const;

// Sellers from the cheapest up, buyers from the most generous down; thin near the price.
export const START_BOOK: Book = {
  last: 60_000,
  asks: [
    { price: 60_010, amount: 0.004 },
    { price: 60_030, amount: 0.006 },
    { price: 60_060, amount: 0.01 },
    { price: 60_100, amount: 0.02 },
    { price: 60_180, amount: 0.05 },
    { price: 60_300, amount: 0.1 },
    { price: 60_500, amount: 0.3 },
    { price: 61_000, amount: 0.5 },
  ],
  bids: [
    { price: 59_990, amount: 0.005 },
    { price: 59_970, amount: 0.008 },
    { price: 59_940, amount: 0.012 },
    { price: 59_900, amount: 0.025 },
    { price: 59_820, amount: 0.06 },
    { price: 59_700, amount: 0.12 },
    { price: 59_500, amount: 0.3 },
    { price: 59_000, amount: 0.5 },
  ],
};

export const START_BALANCES: Balances = { base: 0.05, quote: 5_000 };

// A price this far from the last trade is most likely a typo – an extra or a missing zero.
const TYPO_DISTANCE = 0.3;

// "58 000,5" or "58,000.5" → 58000.5. Empty or invalid input → undefined.
export function parseNumber(text: string): number | undefined {
  const compact = text.replace(/[\s  ]/g, "");
  if (compact === "") {
    return undefined;
  }
  // A comma is the decimal mark when there is no dot (Czech); otherwise it groups thousands.
  const normalized = compact.includes(".")
    ? compact.replace(/,/g, "")
    : compact.replace(",", ".");
  const value = Number(normalized);
  return Number.isFinite(value) ? value : undefined;
}

const positive = z
  .number({ error: "required" })
  .positive({ error: "positive" });

// What the form sends. Which fields are needed depends on the order type.
export const orderSchema = z
  .strictObject({
    side: z.enum(SIDES),
    type: z.enum(ORDER_TYPES),
    price: positive.optional(),
    stop: positive.optional(),
    amount: positive.optional(),
    // Market buy: how much to spend instead of how much to buy.
    total: positive.optional(),
  })
  .superRefine((order, context) => {
    const need = (field: "price" | "stop" | "amount") => {
      if (order[field] === undefined) {
        context.addIssue({
          code: "custom",
          path: [field],
          message: "required",
        });
      }
    };
    if (order.type !== "market") {
      need("price");
      need("amount");
    } else if (order.amount === undefined && order.total === undefined) {
      need("amount");
    }
    if (order.type === "stopLimit") {
      need("stop");
    }
  });
export type Order = z.infer<typeof orderSchema>;

export type Fill = { price: number; amount: number };

export type Warning =
  // The price is far from the last trade – a typo?
  | { kind: "farFromPrice"; percent: number }
  // A limit order across the spread: it executes now at the book's prices, as a taker.
  | { kind: "crossesSpread" }
  // The whole balance in one order.
  | { kind: "wholeBalance" }
  // A stop-limit with no room between the stop and the limit.
  | { kind: "noRoom" }
  // The book ran out before the market order was filled.
  | { kind: "bookExhausted" }
  // A stop on the other side of the price: a sale that triggers on a rise (taking profit, no
  // protection from a fall) or a purchase that triggers on a fall.
  | { kind: "oppositeStop" };

export type SimulationError =
  | "notEnoughQuote"
  | "notEnoughBase"
  // A stop exactly at the last price would trigger at once; exchanges reject it.
  | "stopWouldTrigger";

// Which way the price must move to reach the stop.
export type StopDirection = "up" | "down";

export type Simulation = {
  fills: Fill[];
  filled: number;
  averagePrice?: number;
  // Average price against the best price in the book, in percent (market orders).
  slippage?: number;
  fee: number;
  // The part of a limit order that waits in the book.
  resting?: Fill;
  // A stop-limit waiting for its trigger.
  pending?: {
    stop: number;
    price: number;
    amount: number;
    direction: StopDirection;
  };
  warnings: Warning[];
  book: Book;
  balances: Balances;
};

// Takes liquidity from one side of the book up to `limit` (any price for a market order), until
// `amount` is filled or – for a market buy by total – the money runs out.
function take(
  levels: Level[],
  side: Side,
  goal: { amount?: number; total?: number },
  limit?: number,
) {
  const fills: Fill[] = [];
  let amountLeft = goal.amount ?? Number.POSITIVE_INFINITY;
  let moneyLeft = goal.total ?? Number.POSITIVE_INFINITY;
  const remaining: Level[] = [];
  for (const level of levels) {
    const reachable =
      limit === undefined ||
      (side === "buy" ? level.price <= limit : level.price >= limit);
    if (!reachable || amountLeft <= 1e-12 || moneyLeft <= 1e-9) {
      remaining.push(level);
      continue;
    }
    const amount = Math.min(level.amount, amountLeft, moneyLeft / level.price);
    fills.push({ price: level.price, amount });
    amountLeft -= amount;
    moneyLeft -= amount * level.price;
    if (level.amount - amount > 1e-12) {
      remaining.push({ price: level.price, amount: level.amount - amount });
    }
  }
  return { fills, remaining };
}

const sum = (fills: Fill[]) =>
  fills.reduce((total, fill) => total + fill.amount, 0);
const value = (fills: Fill[]) =>
  fills.reduce((total, fill) => total + fill.amount * fill.price, 0);

/**
 * What would happen with the order: the fills, the fee, what stays in the book, the new balances.
 * Returns an error instead when the balance is too small or the stop would trigger at once.
 */
export function simulate(
  order: Order,
  book: Book,
  balances: Balances,
): Simulation | { error: SimulationError } {
  const warnings: Warning[] = [];
  const opposite = order.side === "buy" ? book.asks : book.bids;
  const bestOpposite = opposite[0]?.price ?? book.last;

  if (order.type !== "market" && order.price !== undefined) {
    const distance = (order.price - book.last) / book.last;
    if (Math.abs(distance) >= TYPO_DISTANCE) {
      warnings.push({ kind: "farFromPrice", percent: distance * 100 });
    }
  }

  if (order.type === "stopLimit") {
    const { stop = 0, price = 0, amount = 0 } = order;
    if (stop === book.last) {
      return { error: "stopWouldTrigger" };
    }
    // Binance accepts a stop on either side of the price and triggers it when the price gets there.
    const direction: StopDirection = stop > book.last ? "up" : "down";
    if ((order.side === "sell") === (direction === "up")) {
      warnings.push({ kind: "oppositeStop" });
    }
    if (stop === price) {
      warnings.push({ kind: "noRoom" });
    }
    const balanceError = checkBalance(order.side, amount, price * amount);
    if (balanceError) {
      return { error: balanceError };
    }
    if (isWhole(order.side, amount, price * amount)) {
      warnings.push({ kind: "wholeBalance" });
    }
    return {
      fills: [],
      filled: 0,
      fee: 0,
      pending: { stop, price, amount, direction },
      warnings,
      book,
      balances: reserve(order.side, amount, price * amount),
    };
  }

  // Limit and market orders take what they can from the other side of the book.
  const limit = order.type === "limit" ? order.price : undefined;
  if (
    limit !== undefined &&
    (order.side === "buy" ? limit >= bestOpposite : limit <= bestOpposite)
  ) {
    warnings.push({ kind: "crossesSpread" });
  }
  const goal =
    order.type === "market" && order.amount === undefined
      ? { total: order.total }
      : { amount: order.amount };
  const { fills, remaining } = take(opposite, order.side, goal, limit);
  const filled = sum(fills);
  const spent = value(fills);
  const fee = spent * FEES.taker;

  // Money check: the filled part plus what a resting limit order reserves.
  const restingAmount =
    order.type === "limit" ? Math.max((order.amount ?? 0) - filled, 0) : 0;
  const restingValue = restingAmount * (order.price ?? 0);
  // A sale pays its fee from the money it brings in.
  const quoteNeeded = order.side === "buy" ? spent + fee + restingValue : 0;
  const baseNeeded = order.side === "sell" ? filled + restingAmount : 0;
  if (quoteNeeded > balances.quote + 1e-9) {
    return { error: "notEnoughQuote" };
  }
  if (baseNeeded > balances.base + 1e-12) {
    return { error: "notEnoughBase" };
  }
  if (
    order.type === "market" &&
    order.amount !== undefined &&
    filled < order.amount - 1e-12
  ) {
    warnings.push({ kind: "bookExhausted" });
  }
  if (
    isWhole(
      order.side,
      filled + restingAmount,
      order.side === "buy" ? spent + restingValue : 0,
    )
  ) {
    warnings.push({ kind: "wholeBalance" });
  }

  const averagePrice = filled > 0 ? spent / filled : undefined;
  const resting =
    restingAmount > 1e-12 && order.price !== undefined
      ? { price: order.price, amount: restingAmount }
      : undefined;
  const ownSide = order.side === "buy" ? "bids" : "asks";
  const nextBook: Book = {
    last: fills.at(-1)?.price ?? book.last,
    asks: book.asks,
    bids: book.bids,
    [order.side === "buy" ? "asks" : "bids"]: remaining,
  };
  if (resting) {
    nextBook[ownSide] = insertLevel(nextBook[ownSide], resting, ownSide);
  }

  return {
    fills,
    filled,
    averagePrice,
    slippage:
      order.type === "market" && averagePrice !== undefined
        ? (Math.abs(averagePrice - bestOpposite) / bestOpposite) * 100
        : undefined,
    fee,
    resting,
    warnings,
    book: nextBook,
    balances:
      order.side === "buy"
        ? {
            base: balances.base + filled,
            quote: balances.quote - spent - fee - restingValue,
          }
        : {
            base: balances.base - filled - restingAmount,
            quote: balances.quote + spent - fee,
          },
  };

  function checkBalance(
    side: Side,
    amount: number,
    money: number,
  ): SimulationError | undefined {
    if (side === "buy" && money > balances.quote + 1e-9) {
      return "notEnoughQuote";
    }
    if (side === "sell" && amount > balances.base + 1e-12) {
      return "notEnoughBase";
    }
    return undefined;
  }

  function isWhole(side: Side, amount: number, money: number) {
    return side === "buy"
      ? money >= balances.quote * 0.99
      : amount >= balances.base * 0.99;
  }

  // A waiting order keeps its money or coins aside, so they cannot be spent twice.
  function reserve(side: Side, amount: number, money: number): Balances {
    return side === "buy"
      ? { base: balances.base, quote: balances.quote - money }
      : { base: balances.base - amount, quote: balances.quote };
  }
}

// Adds a waiting order to its side of the book, keeping the best price first.
function insertLevel(levels: Level[], order: Fill, side: "asks" | "bids") {
  const existing = levels.find((level) => level.price === order.price);
  const merged = existing
    ? levels.map((level) =>
        level === existing
          ? { ...level, amount: level.amount + order.amount }
          : level,
      )
    : [...levels, order];
  return merged.sort((a, b) =>
    side === "asks" ? a.price - b.price : b.price - a.price,
  );
}

/**
 * What a stop-limit would do if the price jumped 5 % past the stop in the direction it was moving.
 * The limit order fills only if that price is still within its limit.
 */
export function stopLimitOutcomes(
  side: Side,
  pending: { stop: number; price: number; direction: StopDirection },
) {
  const jumpPrice = pending.stop * (pending.direction === "down" ? 0.95 : 1.05);
  return {
    jumpPrice,
    jumpFills:
      side === "sell" ? jumpPrice >= pending.price : jumpPrice <= pending.price,
  };
}

/** The amount a share of the balance buys or sells: buy at `price`, sell from the coins. */
export function shareOfBalance(
  side: Side,
  share: number,
  balances: Balances,
  price: number,
) {
  return side === "buy"
    ? (balances.quote * share) / (price * (1 + FEES.taker))
    : balances.base * share;
}

// An order still waiting: a limit order in the book or a stop-limit before its trigger.
export type OpenOrder = {
  id: number;
  side: Side;
  type: "limit" | "stopLimit";
  price: number;
  amount: number;
  stop?: number;
};

/** Cancels a waiting order: it leaves the book and its reserved money or coins come back. */
export function cancelOrder(
  order: OpenOrder,
  book: Book,
  balances: Balances,
): { book: Book; balances: Balances } {
  const ownSide = order.side === "buy" ? "bids" : "asks";
  const nextBook =
    order.type === "limit"
      ? {
          ...book,
          [ownSide]: book[ownSide]
            .map((level) =>
              level.price === order.price
                ? { ...level, amount: level.amount - order.amount }
                : level,
            )
            .filter((level) => level.amount > 1e-12),
        }
      : book;
  return {
    book: nextBook,
    balances:
      order.side === "buy"
        ? { ...balances, quote: balances.quote + order.price * order.amount }
        : { ...balances, base: balances.base + order.amount },
  };
}
