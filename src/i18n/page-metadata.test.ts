import { describe, expect, it } from "vitest";

import { pageMetadata } from "./page-metadata";

describe("pageMetadata", () => {
  const lesson = pageMetadata({
    locale: "cs",
    title: "Co dál – Základy kryptoměn",
    description: "Kam pokračovat po prvním kurzu.",
    hrefFor: (locale) => ({
      pathname: "/courses/[course]/[lesson]",
      params:
        locale === "cs"
          ? { course: "zaklady-kryptomen", lesson: "co-dal" }
          : { course: "crypto-basics", lesson: "what-next" },
    }),
    type: "article",
  });

  // A shared link used to show the home page: the layout's preview was never replaced.
  it("previews the page itself when shared, not the home page", () => {
    expect(lesson.openGraph).toMatchObject({
      type: "article",
      title: "Co dál – Základy kryptoměn",
      description: "Kam pokračovat po prvním kurzu.",
      url: "/cs/kurzy/zaklady-kryptomen/co-dal",
      locale: "cs_CZ",
      siteName: "Trading Academy",
    });
  });

  it("links the canonical URL and both language versions", () => {
    expect(lesson.alternates).toEqual({
      canonical: "/cs/kurzy/zaklady-kryptomen/co-dal",
      languages: {
        en: "/courses/crypto-basics/what-next",
        cs: "/cs/kurzy/zaklady-kryptomen/co-dal",
        "x-default": "/courses/crypto-basics/what-next",
      },
    });
  });
});
