import { hasLocale } from "next-intl";

import { routing } from "@/i18n/routing";
import { llmsFull } from "@/server/llms";

// The full text of the courses in one language for AI assistants, built at build time.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/[locale]/llms-full.txt">,
) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(await llmsFull(locale), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
