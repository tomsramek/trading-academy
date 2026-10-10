import Script from "next/script";

const WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

/**
 * The Umami script, loaded after the page. It goes through our own domain (/stats, rewritten to the
 * Umami server in next.config.ts), counts only trading-academy.app – not localhost or previews – and
 * respects the browser's Do Not Track. Without a website id (development) nothing is loaded.
 */
export function Analytics() {
  if (!WEBSITE_ID) {
    return null;
  }
  return (
    <Script
      src="/stats/script.js"
      strategy="afterInteractive"
      data-website-id={WEBSITE_ID}
      data-host-url="/stats"
      data-domains="trading-academy.app"
      data-do-not-track="true"
    />
  );
}
