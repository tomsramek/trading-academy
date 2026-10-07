import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";

// Points next-intl to src/i18n/request.ts.
const withNextIntl = createNextIntlPlugin();

// Compiles imported .mdx files (lessons in content/) into React components.
const withMDX = createMDX();

const nextConfig: NextConfig = {
  // Self-contained server bundle for the Docker image.
  output: "standalone",
};

export default withNextIntl(withMDX(nextConfig));
