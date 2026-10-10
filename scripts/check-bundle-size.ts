/*
 * JavaScript budget: after `yarn build`, sums the gzipped scripts that key pages load up front and
 * fails when a page is over its budget – so a change that ships a chart library or zod to every page
 * (as happened before #95) does not reach production unnoticed.
 *
 *   yarn build && yarn size:check
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

const APP = path.join(".next", "server", "app");

// Prerendered pages and their budget in kB (gzip). About 10 % above the size after #95 – raise a
// budget deliberately, in the same pull request as the change that needs it.
const BUDGETS = [
  { page: "en.html", name: "Home", kB: 310 },
  // zod/mini checks ?level= in the browser.
  { page: "en/courses.html", name: "Course catalog", kB: 335 },
  { page: "en/courses/crypto-basics.html", name: "Course", kB: 320 },
  {
    page: "en/courses/crypto-basics/mining-and-staking.html",
    name: "Lesson without a chart",
    kB: 325,
  },
  {
    page: "en/courses/indicators/rsi.html",
    name: "Lesson with charts",
    kB: 325,
  },
  { page: "en/glossary.html", name: "Glossary", kB: 310 },
  { page: "en/privacy.html", name: "Privacy policy", kB: 305 },
];

const gzipSizes = new Map<string, number>();
function gzipSize(file: string) {
  let size = gzipSizes.get(file);
  if (size === undefined) {
    size = gzipSync(readFileSync(file)).length;
    gzipSizes.set(file, size);
  }
  return size;
}

let failed = false;
const rows: string[] = [];
for (const { page, name, kB } of BUDGETS) {
  const file = path.join(APP, page);
  if (!existsSync(file)) {
    console.error(`✗ ${name}: ${file} not found – run \`yarn build\` first`);
    failed = true;
    continue;
  }
  const html = readFileSync(file, "utf8");
  const scripts = new Set(
    [...html.matchAll(/<script[^>]+src="\/_next\/(static\/[^"]+\.js)"/g)].map(
      ([, src]) => path.join(".next", src ?? ""),
    ),
  );
  const total =
    [...scripts].reduce((sum, script) => sum + gzipSize(script), 0) / 1024;
  const ok = total <= kB;
  failed ||= !ok;
  rows.push(
    `${ok ? "✓" : "✗"} ${name.padEnd(24)} ${total.toFixed(0).padStart(4)} kB / ${kB} kB  (${scripts.size} scripts)`,
  );
}

console.log("JavaScript loaded up front (gzip):\n" + rows.join("\n"));
if (failed) {
  console.error(
    "\nA page is over its JavaScript budget. Find what grew (e.g. a client component importing a big library) or raise the budget in scripts/check-bundle-size.ts on purpose.",
  );
  process.exit(1);
}
