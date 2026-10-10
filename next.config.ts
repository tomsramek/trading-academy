import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";
import { z } from "zod";

// Values inlined into the browser code or used for the routes are checked here, once per build:
// a wrong value stops the build. Feature flags: src/lib/features.ts. Umami: src/components/analytics.
const env = z
  .object({
    NEXT_PUBLIC_LOGIN_ENABLED: z.enum(["true", "false"]).optional(),
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.uuid().optional(),
    // The shared Umami server, e.g. https://stats.srvr.work.
    UMAMI_HOST: z.url().optional(),
  })
  .parse(process.env);

// Points next-intl to src/i18n/request.ts.
const withNextIntl = createNextIntlPlugin();

// Compiles imported .mdx files (lessons in content/) into React components.
const withMDX = createMDX({
  options: {
    // Plugins are given by name (a string) so they work with Turbopack.
    // remark-gfm adds tables, ~~strikethrough~~ and task lists (GitHub Flavored Markdown).
    remarkPlugins: ["remark-gfm"],
  },
});

const nextConfig: NextConfig = {
  // Self-contained server bundle for the Docker image.
  output: "standalone",
  // Umami through our own domain: the browser talks only to trading-academy.app, so the statistics
  // are first-party and fewer ad blockers drop them.
  async rewrites() {
    // beforeFiles: applied before any page is matched, so no route (e.g. the [locale] catch-all) answers first.
    return {
      beforeFiles: env.UMAMI_HOST
        ? [
            {
              source: "/stats/script.js",
              destination: `${env.UMAMI_HOST}/script.js`,
            },
            {
              source: "/stats/api/send",
              destination: `${env.UMAMI_HOST}/api/send`,
            },
          ]
        : [],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default withNextIntl(withMDX(nextConfig));
