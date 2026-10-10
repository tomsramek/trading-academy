import type { StructuredData } from "@/lib/structured-data";

// Structured data for search engines and AI assistants (schema.org as JSON-LD). A plain <script>, not
// next/script – it is data, not code. "<" is escaped so a text in the data cannot close the tag.
export function JsonLd({ data }: { data: StructuredData }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
