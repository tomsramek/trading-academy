# Courses

Every folder here is one course. A new lesson is added just by creating its files – `yarn build`
checks everything and stops with a clear error when something is wrong.

```
content/courses/
  crypto-basics/                     ← course slug = URL: /courses/crypto-basics
    course.json                      ← title, description, audience, outcomes (en, cs), level, order, image, draft
    01-blockchain/                   ← NN-module: number = order, not part of the URL
      module.json                    ← title (en, cs)
      01-what-is-bitcoin.en.mdx      ← NN-lesson.<locale>.mdx: one file per language
      01-what-is-bitcoin.cs.mdx         URL: /courses/crypto-basics/what-is-bitcoin
```

- Lesson slugs must be unique within a course (the module is not in the URL).
- Every lesson starts with its metadata:
  `export const metadata = { title: "…", description: "…" };`
- The reading time is computed from the text and the charts/diagrams – never written by hand.
- Schemas: `src/lib/content/schema.ts`. Components for lessons: `src/mdx-components.tsx`.
- Market data for charts: `content/market-data/` (see its LICENSE.md).
- `"draft": true` in course.json: the course is visible in `yarn dev` only, never on the website.
- Markdown inside a component (lists in `<Callout>`) needs an empty line after the opening and
  before the closing tag – otherwise it is read as one paragraph:
  `<Callout title="Summary">` ⏎ ⏎ `- first` ⏎ `- second` ⏎ ⏎ `</Callout>`
- Never start a line or a paragraph with a component used inside a sentence (`<KeyTerm>`) – MDX
  would turn it into its own block. Keep text before it on the same line.
