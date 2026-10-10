import { describe, expect, it, vi } from "vitest";

// What Next.js does while building: headers() stops the prerender of a dynamic page.
const DYNAMIC = new Error("Dynamic server usage: headers");

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.reject(DYNAMIC)),
}));
vi.mock("./auth", () => ({
  // The build has no login secrets – creating Better Auth there must never happen.
  auth: vi.fn(() => {
    throw new Error("Login is not configured");
  }),
}));

describe("getSession", () => {
  it("reads the request headers before creating Better Auth", async () => {
    const { getSession } = await import("./session");
    await expect(getSession()).rejects.toBe(DYNAMIC);
  });
});
