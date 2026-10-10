import { describe, expect, it } from "vitest";

import { mdxToMarkdown } from "./mdx-to-markdown";

const LESSON = `import btc from "@content/market-data/btc.json";

export const metadata = {
  title: "RSI: the market's thermometer",
  description: 'Why "overbought" does not mean "sell".',
};

<Callout title="In this lesson">

- compute RSI step by step

</Callout>

The <KeyTerm term="rsi">RSI</KeyTerm> indicator is a thermometer.

<Illustration name="rsiThermometer" />

<IndicatorSteps
  data={btc}
  indicator="rsi"
  label="Computing RSI 14 on the daily Bitcoin chart, step by step"
/>

<Video
  src="/videos/rsi.mp4"
  caption="Video (21 s): switching on RSI on Binance > Sub Indicator"
/>

<CandleChart data={btc} />

## The period changes everything`;

describe("mdxToMarkdown", () => {
  const markdown = mdxToMarkdown(LESSON, {
    illustration: (name) =>
      name === "rsiThermometer" ? "A sweating thermometer at 70" : undefined,
  });

  it("drops the imports and the metadata", () => {
    expect(markdown).not.toContain("import");
    expect(markdown).not.toContain("metadata");
    expect(markdown.startsWith("**In this lesson**")).toBe(true);
  });

  it("keeps the word of a glossary link", () => {
    expect(markdown).toContain("The RSI indicator is a thermometer.");
  });

  it("replaces components with their text", () => {
    expect(markdown).toContain("[Illustration: A sweating thermometer at 70]");
    expect(markdown).toContain(
      "[Interactive: Computing RSI 14 on the daily Bitcoin chart, step by step]",
    );
    // A ">" inside a quoted prop does not end the tag early.
    expect(markdown).toContain(
      "[Video: Video (21 s): switching on RSI on Binance > Sub Indicator]",
    );
  });

  it("leaves no component tags behind", () => {
    expect(markdown).not.toMatch(/<\/?[A-Z]/);
    expect(markdown).not.toContain("{btc}");
    expect(markdown).toContain("## The period changes everything");
  });
});
