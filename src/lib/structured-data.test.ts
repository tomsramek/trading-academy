import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { JsonLd } from "@/components/seo/JsonLd";

import { breadcrumbData, faqData, websiteData } from "./structured-data";

describe("structured data", () => {
  it("numbers the breadcrumbs from 1", () => {
    expect(
      breadcrumbData([
        { name: "Kurzy", url: "https://trading-academy.app/cs/kurzy" },
        {
          name: "Základy kryptoměn",
          url: "https://trading-academy.app/cs/kurzy/zaklady-kryptomen",
        },
      ]).itemListElement,
    ).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Kurzy",
        item: "https://trading-academy.app/cs/kurzy",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Základy kryptoměn",
        item: "https://trading-academy.app/cs/kurzy/zaklady-kryptomen",
      },
    ]);
  });

  it("turns questions and answers into a FAQ page", () => {
    expect(
      faqData([{ question: "Is it free?", answer: "Yes." }]).mainEntity,
    ).toEqual([
      {
        "@type": "Question",
        name: "Is it free?",
        acceptedAnswer: { "@type": "Answer", text: "Yes." },
      },
    ]);
  });

  it("points the site to its address in the language", () => {
    expect(websiteData("cs", "Popis")).toMatchObject({
      "@type": "WebSite",
      url: "https://trading-academy.app/cs",
      inLanguage: "cs",
    });
  });

  // A text containing "</script>" must not be able to end the tag and inject markup.
  it("cannot be broken out of by a text in the data", () => {
    const html = renderToStaticMarkup(
      createElement(JsonLd, {
        data: faqData([
          { question: "</script><script>alert(1)</script>", answer: "x" },
        ]),
      }),
    );
    expect(html.match(/<\/script>/g)).toHaveLength(1);
    expect(html).toContain("\\u003c/script>");
  });
});
