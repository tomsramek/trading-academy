// Verifies that every translation file has exactly the same keys as the source (English) file.
import { readFileSync } from "node:fs";

const SOURCE_LOCALE = "en";
const LOCALES = ["cs"];

type Messages = { [key: string]: string | Messages };

function loadMessages(locale: string): Messages {
  return JSON.parse(readFileSync(`messages/${locale}.json`, "utf8"));
}

// { HomePage: { title: "…" } } → ["HomePage.title"]
function flattenKeys(messages: Messages, prefix = ""): string[] {
  return Object.entries(messages).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string" ? [path] : flattenKeys(value, path);
  });
}

const sourceKeys = new Set(flattenKeys(loadMessages(SOURCE_LOCALE)));
let hasErrors = false;

for (const locale of LOCALES) {
  const keys = new Set(flattenKeys(loadMessages(locale)));
  const missing = [...sourceKeys].filter((key) => !keys.has(key));
  const extra = [...keys].filter((key) => !sourceKeys.has(key));

  if (missing.length > 0 || extra.length > 0) {
    hasErrors = true;
    console.error(`✗ ${locale}.json`);
    missing.forEach((key) => console.error(`  missing: ${key}`));
    extra.forEach((key) => console.error(`  extra:   ${key}`));
  } else {
    console.log(
      `✓ ${locale}.json – ${keys.size} keys, all match ${SOURCE_LOCALE}.json`,
    );
  }
}

if (hasErrors) {
  process.exitCode = 1;
}
