import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import cs from "../../messages/cs.json";
import en from "../../messages/en.json";

import { CLIENT_NAMESPACES, pickMessages } from "./client-messages";

const SRC = path.resolve(import.meta.dirname, "..");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return sourceFiles(file);
    }
    return /\.tsx?$/.test(entry.name) && !entry.name.includes(".test.")
      ? [file]
      : [];
  });
}

// "@/components/x" or "./x" → the file it points to, if it is our own source file.
function resolveImport(specifier: string, from: string): string | undefined {
  const base = specifier.startsWith("@/")
    ? path.join(SRC, specifier.slice(2))
    : specifier.startsWith(".")
      ? path.resolve(path.dirname(from), specifier)
      : undefined;
  if (base === undefined) {
    return undefined;
  }
  return [".tsx", ".ts", "/index.tsx", "/index.ts"]
    .map((extension) => base + extension)
    .find((file) => existsSync(file));
}

/**
 * Namespaces used by code that runs in the browser: every "use client" file and everything it
 * imports, followed through the whole import tree.
 */
function clientNamespaces(): Map<string, string[]> {
  const files = sourceFiles(SRC);
  const source = new Map(
    files.map((file) => [file, readFileSync(file, "utf8")]),
  );
  const pending = files.filter((file) =>
    /^\s*["']use client["']/.test(source.get(file) ?? ""),
  );
  const visited = new Set<string>();
  while (pending.length > 0) {
    const file = pending.pop();
    if (file === undefined || visited.has(file)) {
      continue;
    }
    visited.add(file);
    for (const [, specifier] of (source.get(file) ?? "").matchAll(
      /(?:import|export)\s[^'"]*?from\s+["']([^"']+)["']/g,
    )) {
      const imported = specifier && resolveImport(specifier, file);
      if (imported) {
        pending.push(imported);
      }
    }
  }

  const namespaces = new Map<string, string[]>();
  for (const file of visited) {
    for (const [, namespace] of (source.get(file) ?? "").matchAll(
      /useTranslations\(\s*"([^"]+)"\s*\)/g,
    )) {
      if (namespace) {
        namespaces.set(namespace, [
          ...(namespaces.get(namespace) ?? []),
          path.relative(SRC, file),
        ]);
      }
    }
  }
  return namespaces;
}

describe("client messages", () => {
  it("cover every namespace a client component uses", () => {
    const missing = [...clientNamespaces()]
      .filter(
        ([namespace]) =>
          !CLIENT_NAMESPACES.some(
            (picked) =>
              namespace === picked || namespace.startsWith(`${picked}.`),
          ),
      )
      .map(([namespace, files]) => `${namespace} (${files.join(", ")})`);
    expect(missing).toEqual([]);
  });

  it("exist in both languages", () => {
    for (const messages of [cs, en]) {
      const picked = pickMessages(messages, CLIENT_NAMESPACES);
      for (const namespace of CLIENT_NAMESPACES) {
        const value = namespace
          .split(".")
          .reduce<unknown>(
            (node, key) =>
              typeof node === "object" && node !== null
                ? Reflect.get(node, key)
                : undefined,
            picked,
          );
        expect(value, namespace).toBeDefined();
      }
    }
  });

  it("leave out what only the server needs", () => {
    const picked = pickMessages(en, CLIENT_NAMESPACES);
    expect(picked).not.toHaveProperty("Email");
    expect(picked).not.toHaveProperty("Lesson.illustration");
    expect(picked).toHaveProperty("Lesson.chart");
    expect(picked).not.toHaveProperty("Home.hero.title");
    expect(picked).toHaveProperty("Home.hero.carousel");
  });
});
