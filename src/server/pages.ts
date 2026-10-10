import "server-only";

import path from "node:path";

import type { MDXContent, MDXModule } from "mdx/types";
import type { Locale } from "next-intl";
import { z } from "zod";

import { pageSchema, type PageMeta } from "@/lib/content/schema";

/*
 * Standalone text pages from content/pages/<page>.<locale>.mdx – the terms of use, the risk warning
 * and the privacy policy.
 * The metadata is validated, so a mistake stops `yarn build`.
 */

export type PageName = "terms" | "risk-warning" | "privacy";

export type Page = {
  meta: PageMeta;
  Content: MDXContent;
};

// The bundler includes every file matching the static parts of the path (folder + ".mdx").
function importPage(name: PageName, locale: Locale): Promise<MDXModule> {
  return import(`../../content/pages/${name}.${locale}.mdx`);
}

export async function getPage(name: PageName, locale: Locale): Promise<Page> {
  const file = path.join("content", "pages", `${name}.${locale}.mdx`);
  const mdx = await importPage(name, locale);
  const metadata: unknown = "metadata" in mdx ? mdx.metadata : undefined;
  const result = pageSchema.safeParse(metadata);
  if (!result.success) {
    throw new Error(
      `Invalid content in ${file}:\n${z.prettifyError(result.error)}`,
    );
  }
  return { meta: result.data, Content: mdx.default };
}
