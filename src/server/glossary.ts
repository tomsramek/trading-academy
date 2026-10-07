import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import { cache } from "react";
import { z } from "zod";

import { glossarySchema, type GlossaryData } from "@/lib/content/schema";

/*
 * The glossary from content/glossary/terms.json, validated. Lessons link to it with
 * <KeyTerm term="…">, and the content loader checks that every such term exists here.
 */

const FILE = path.join(process.cwd(), "content", "glossary", "terms.json");

export const getGlossary = cache(async (): Promise<GlossaryData> => {
  const relative = path.relative(process.cwd(), FILE);
  let data: unknown;
  try {
    data = JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch (error) {
    throw new Error(`Invalid content in ${relative}:\n${String(error)}`);
  }
  const result = glossarySchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `Invalid content in ${relative}:\n${z.prettifyError(result.error)}`,
    );
  }

  // A related term must exist too, otherwise its link would lead nowhere.
  for (const [id, entry] of Object.entries(result.data)) {
    const missing = entry.related?.find((other) => !(other in result.data));
    if (missing) {
      throw new Error(
        `Invalid content in ${relative}:\n"${id}" is related to "${missing}", which is not in the glossary`,
      );
    }
  }
  return result.data;
});
