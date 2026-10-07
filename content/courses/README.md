# Courses

Every folder here is one course. A new lesson is added just by creating its files – `yarn build`
checks everything and stops with a clear error when something is wrong.

```
content/courses/
  crypto-basics/                     ← folder = English URL: /courses/crypto-basics
    course.json                      ← title, description, audience, outcomes (en, cs), level, order, slug, image, draft
    01-blockchain/                   ← NN-module: number = order, not part of the URL
      module.json                    ← title (en, cs)
      01-what-is-bitcoin.en.mdx      ← NN-lesson.<locale>.mdx: one file per language
      01-what-is-bitcoin.cs.mdx         URL: /courses/crypto-basics/what-is-bitcoin
```

- Lesson slugs must be unique within a course (the module is not in the URL).
- Every lesson starts with its metadata:
  `export const metadata = { title: "…", description: "…" };`
- Czech URLs are in Czech: `/cs/kurzy/zaklady-kryptomen/co-je-bitcoin`. The course slug goes into
  course.json (`"slug": { "cs": "zaklady-kryptomen" }`), the lesson slug into the metadata of the Czech
  file (`slug: "co-je-bitcoin"`). Without them the English name is used. Slugs have no diacritics and
  must be unique in every language.
- A link to another page of the academy is written in the language of the file, without the language
  prefix: `[Bitcoin](/kurzy/zaklady-kryptomen/bitcoin)` in a Czech lesson.
- The reading time is computed from the text and the charts/diagrams – never written by hand.
- Schemas: `src/lib/content/schema.ts`. Components for lessons: `src/mdx-components.tsx`.
- Market data for charts: `content/market-data/` (see its LICENSE.md).
- `"draft": true` in course.json: the course is visible in `yarn dev` only, never on the website.
- Markdown inside a component (lists in `<Callout>`) needs an empty line after the opening and
  before the closing tag – otherwise it is read as one paragraph:
  `<Callout title="Summary">` ⏎ ⏎ `- first` ⏎ `- second` ⏎ ⏎ `</Callout>`
- Never start a line or a paragraph with a component used inside a sentence (`<KeyTerm>`) – MDX
  would turn it into its own block. Keep text before it on the same line.
