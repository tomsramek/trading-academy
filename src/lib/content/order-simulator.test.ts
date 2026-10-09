import { describe, expect, it } from "vitest";

import {
  FEES,
  cancelOrder,
  START_BALANCES,
  START_BOOK,
  orderSchema,
  parseNumber,
  shareOfBalance,
  simulate,
  stopLimitOutcomes,
  type Order,
  type Simulation,
} from "./order-simulator";

function run(order: Order, balances = START_BALANCES): Simulation {
  const result = simulate(order, START_BOOK, balances);
  if ("error" in result) {
    throw new Error(result.error);
  }
  return result;
}

const kinds = (simulation: Simulation) =>
  simulation.warnings.map((warning) => warning.kind);

describe("parseNumber", () => {
  it("reads Czech and English number formats", () => {
    expect(parseNumber("58 000")).toBe(58_000);
    expect(parseNumber("0,002")).toBe(0.002);
    expect(parseNumber("58,000.5")).toBe(58_000.5);
    expect(parseNumber("")).toBeUndefined();
    expect(parseNumber("abc")).toBeUndefined();
  });
});

describe("orderSchema", () => {
  it("asks for the fields the order type needs", () => {
    const result = orderSchema.safeParse({ side: "sell", type: "stopLimit" });
    expect(result.success).toBe(false);
    const fields = result.error?.issues.map((issue) => issue.path[0]);
    expect(fields).toEqual(["price", "amount", "stop"]);
  });

  it("lets a market buy give a total instead of an amount", () => {
    expect(
      orderSchema.safeParse({ side: "buy", type: "market", total: 500 })
        .success,
    ).toBe(true);
  });
});

describe("simulate", () => {
  it("a limit buy below the price waits in the book and reserves the money", () => {
    const result = run({
      side: "buy",
      type: "limit",
      price: 58_000,
      amount: 0.002,
    });
    expect(result.fills).toEqual([]);
    expect(result.resting).toEqual({ price: 58_000, amount: 0.002 });
    expect(result.balances.quote).toBeCloseTo(5_000 - 116);
    expect(result.book.bids.at(-1)).toEqual({ price: 58_000, amount: 0.002 });
  });

  it("a limit buy above the price executes now at the book's cheaper prices", () => {
    const result = run({
      side: "buy",
      type: "limit",
      price: 60_050,
      amount: 0.004,
    });
    expect(kinds(result)).toContain("crossesSpread");
    expect(result.fills).toEqual([{ price: 60_010, amount: 0.004 }]);
    expect(result.fee).toBeCloseTo(60_010 * 0.004 * FEES.taker);
  });

  it("a market order walks up a thin book – slippage", () => {
    const result = run({ side: "buy", type: "market", amount: 0.03 });
    expect(result.fills.map((fill) => fill.price)).toEqual([
      60_010, 60_030, 60_060, 60_100,
    ]);
    expect(result.averagePrice).toBeGreaterThan(60_010);
    expect(result.slippage).toBeGreaterThan(0);
    expect(result.book.asks[0]?.price).toBe(60_100);
    expect(result.book.last).toBe(60_100);
  });

  it("a market buy by total spends no more than the total", () => {
    const result = run({ side: "buy", type: "market", total: 1_000 });
    const spent = result.fills.reduce(
      (sum, fill) => sum + fill.price * fill.amount,
      0,
    );
    expect(spent).toBeCloseTo(1_000);
  });

  it("an extra zero missing: a sale at 5,800 is a typo and sells into the bids", () => {
    const result = run({
      side: "sell",
      type: "limit",
      price: 5_800,
      amount: 0.02,
    });
    const typo = result.warnings.find(
      (warning) => warning.kind === "farFromPrice",
    );
    expect(typo && "percent" in typo && typo.percent).toBeCloseTo(-90.33, 1);
    expect(kinds(result)).toContain("crossesSpread");
    // It sells at the buyers' prices, not at 5,800 – but far lower than one bid.
    expect(result.fills[0]?.price).toBe(59_990);
    expect(result.filled).toBeCloseTo(0.02);
  });

  it("a stop-limit sell waits below the price and keeps the coins aside", () => {
    const result = run({
      side: "sell",
      type: "stopLimit",
      stop: 55_000,
      price: 54_500,
      amount: 0.01,
    });
    expect(result.pending).toEqual({
      stop: 55_000,
      price: 54_500,
      amount: 0.01,
      direction: "down",
    });
    expect(result.warnings).toEqual([]);
    expect(result.balances.base).toBeCloseTo(0.04);
  });

  it("a stop-limit sell above the price waits for a rise, as on Binance", () => {
    const result = run({
      side: "sell",
      type: "stopLimit",
      stop: 62_000,
      price: 61_900,
      amount: 0.01,
    });
    expect(result.pending).toEqual({
      stop: 62_000,
      price: 61_900,
      amount: 0.01,
      direction: "up",
    });
    expect(kinds(result)).toContain("oppositeStop");
  });

  it("a stop-limit buy below the price waits for a fall", () => {
    const result = run({
      side: "buy",
      type: "stopLimit",
      stop: 58_000,
      price: 58_100,
      amount: 0.01,
    });
    expect(result.pending?.direction).toBe("down");
    expect(kinds(result)).toContain("oppositeStop");
  });

  it("a stop exactly at the last price would trigger at once – rejected", () => {
    expect(
      simulate(
        {
          side: "sell",
          type: "stopLimit",
          stop: 60_000,
          price: 59_900,
          amount: 0.01,
        },
        START_BOOK,
        START_BALANCES,
      ),
    ).toEqual({ error: "stopWouldTrigger" });
  });

  it("warns about a stop-limit without room and about the whole balance", () => {
    const result = run({
      side: "sell",
      type: "stopLimit",
      stop: 55_000,
      price: 55_000,
      amount: 0.05,
    });
    expect(kinds(result)).toEqual(["noRoom", "wholeBalance"]);
  });

  it("refuses an order the balance cannot pay for", () => {
    expect(
      simulate(
        { side: "buy", type: "limit", price: 58_000, amount: 1 },
        START_BOOK,
        START_BALANCES,
      ),
    ).toEqual({ error: "notEnoughQuote" });
    expect(
      simulate(
        { side: "sell", type: "market", amount: 1 },
        START_BOOK,
        START_BALANCES,
      ),
    ).toEqual({ error: "notEnoughBase" });
  });

  it("a sale pays its fee from the proceeds", () => {
    const result = run(
      { side: "sell", type: "market", amount: 0.005 },
      { base: 0.005, quote: 0 },
    );
    expect(result.balances.quote).toBeCloseTo(
      59_990 * 0.005 * (1 - FEES.taker),
    );
  });
});

describe("stopLimitOutcomes", () => {
  it("a crash that gaps past the limit leaves the sale unfilled", () => {
    const stop = { stop: 55_000, price: 54_500, direction: "down" } as const;
    expect(stopLimitOutcomes("sell", stop)).toEqual({
      jumpPrice: 52_250,
      jumpFills: false,
    });
    expect(
      stopLimitOutcomes("sell", { ...stop, price: 52_000 }).jumpFills,
    ).toBe(true);
  });

  it("a sale triggered by a rise fills even when the price jumps higher", () => {
    expect(
      stopLimitOutcomes("sell", {
        stop: 62_000,
        price: 61_900,
        direction: "up",
      }),
    ).toEqual({ jumpPrice: 65_100, jumpFills: true });
  });
});

describe("shareOfBalance", () => {
  it("leaves room for the fee when buying", () => {
    const amount = shareOfBalance("buy", 1, START_BALANCES, 60_000);
    expect(amount * 60_000 * (1 + FEES.taker)).toBeCloseTo(5_000);
    expect(shareOfBalance("sell", 0.5, START_BALANCES, 60_000)).toBe(0.025);
  });
});

describe("cancelOrder", () => {
  it("takes a waiting limit order out of the book and returns the money", () => {
    const placed = run({
      side: "buy",
      type: "limit",
      price: 58_000,
      amount: 0.002,
    });
    const cancelled = cancelOrder(
      { id: 1, side: "buy", type: "limit", price: 58_000, amount: 0.002 },
      placed.book,
      placed.balances,
    );
    expect(cancelled.book).toEqual(START_BOOK);
    expect(cancelled.balances.quote).toBeCloseTo(START_BALANCES.quote);
  });

  it("returns the coins of a stop-limit sell", () => {
    const placed = run({
      side: "sell",
      type: "stopLimit",
      stop: 55_000,
      price: 54_500,
      amount: 0.01,
    });
    const cancelled = cancelOrder(
      {
        id: 1,
        side: "sell",
        type: "stopLimit",
        price: 54_500,
        stop: 55_000,
        amount: 0.01,
      },
      placed.book,
      placed.balances,
    );
    expect(cancelled.balances.base).toBeCloseTo(START_BALANCES.base);
  });
});
