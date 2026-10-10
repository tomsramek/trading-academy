import { describe, expect, it } from "vitest";

import { magicLinkEmail, type MagicLinkTexts } from "./magic-link";

const texts: MagicLinkTexts = {
  subject: "Sign in",
  heading: "Your link",
  intro: "Click below.",
  button: "Sign in",
  expiry: "Works for 15 minutes.",
  ignore: "Ignore it if it was not you.",
  noReply: "Do not reply.",
};

describe("magicLinkEmail", () => {
  it("puts the link into the button and the plain text", () => {
    const url =
      "https://trading-academy.app/api/auth/magic?token=abc&next=%2Fcs";
    const email = magicLinkEmail(texts, url, "cs");
    expect(email.subject).toBe("Sign in");
    expect(email.html).toContain(
      'href="https://trading-academy.app/api/auth/magic?token=abc&amp;next=%2Fcs"',
    );
    expect(email.html).toContain('<html lang="cs">');
    expect(email.text).toContain(url);
    expect(email.text).toContain("Works for 15 minutes.");
  });

  it("escapes HTML in the texts and the link", () => {
    const email = magicLinkEmail(
      { ...texts, heading: '<script>alert("x")</script>' },
      'https://example.com/"><img src=x>',
      "en",
    );
    expect(email.html).not.toContain("<script>");
    expect(email.html).toContain("&lt;script&gt;");
    expect(email.html).not.toContain('"><img');
  });
});
