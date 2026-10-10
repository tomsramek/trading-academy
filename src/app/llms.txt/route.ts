import { llmsIndex } from "@/server/llms";

// An index of the academy for AI assistants (https://llmstxt.org), built at build time.
export const dynamic = "force-static";

export async function GET() {
  return new Response(await llmsIndex(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
