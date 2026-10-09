import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// drizzle-kit runs outside Next.js, so it does not read .env.local by itself.
if (!process.env.DATABASE_URL && existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/db/schema.ts",
  // Generated SQL migrations – committed to git and applied when the app starts.
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
