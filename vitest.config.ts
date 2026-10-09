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
  },
});
