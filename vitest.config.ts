import { defineConfig } from "vitest/config";

// Unit tests for pure logic (indicators, simulators). Test files sit next to the code as *.test.ts.
export default defineConfig({
  resolve: {
    // The @/ and @content/ aliases from tsconfig.json.
    tsconfigPaths: true,
  },
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
    // next-intl imports "next/navigation" without an extension, which plain Node cannot resolve –
    // let Vite bundle it for the tests (needed for getPathname in the page metadata).
    server: { deps: { inline: ["next-intl"] } },
  },
});
