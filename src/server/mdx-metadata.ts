import "server-only";

import vm from "node:vm";

/**
 * The `export const metadata = { … };` object of an MDX file, read from its source instead of importing
 * the file. Importing a lesson pulls its whole module graph – the MDX components and their client
 * code – into every page that only needs the course list (the layout, the catalog…). The content is
 * our own repository, and the object is evaluated in an empty context with a time limit.
 */
export function readMdxMetadata(source: string): unknown {
  const literal = /^export const metadata = (\{[\s\S]*?^\});$/m.exec(
    source,
  )?.[1];
  if (literal === undefined) {
    return undefined;
  }
  return vm.runInNewContext(`(${literal})`, Object.create(null), {
    timeout: 100,
  });
}
