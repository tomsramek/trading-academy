import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";
import { z } from "zod";

// Feature flags (src/lib/features.ts) are inlined into the browser code, so their values are checked
// here, once per build: anything but "true", "false" or unset stops the build.
z.object({
  NEXT_PUBLIC_LOGIN_ENABLED: z.enum(["true", "false"]).optional(),
}).parse(process.env);

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
};

export default withNextIntl(withMDX(nextConfig));
