import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Points next-intl to src/i18n/request.ts.
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Self-contained server bundle for the Docker image.
  output: "standalone",
};

export default withNextIntl(nextConfig);
