---
name: review
description: Review code changes (local diff, branch, or GitHub PR number) against the project's TypeScript/React/Next.js/Tailwind rules and report concrete findings. Use when asked to review, check a PR, or look over changes before shipping.
---

# Review

## 1. Get the diff

- Local work: `git diff main...HEAD` plus `git diff` for uncommitted changes.
- PR: `gh pr diff <number>` and `gh pr view <number>` for context (description, linked issue).

Read the full files around each hunk, not only the hunk itself.

## 2. Check, in this order

1. **Correctness** — logic errors, wrong conditions, unhandled promise rejections, race conditions, stale closures, missing `await`.
2. **Security** — unvalidated input, missing auth check in Server Actions / Route Handlers, server secrets reachable from client code, `dangerouslySetInnerHTML`, open redirects.
3. **Next.js boundaries** — needless `"use client"`, server-only imports in client components, data fetching in `useEffect`, missing `loading`/`error` handling.
4. **UI states** — loading, empty, error, pending states per `.claude/rules/ui-states.md`.
5. **Types** — `any`, unsafe casts, `!` assertions, types that don't match runtime data.
6. **Styling & a11y** — hardcoded colors/sizes instead of tokens, missing labels/alt, non-semantic interactive elements, no focus styles.
7. **Tests** — changed behaviour without a test; bug fix without a regression test.
8. **Simplicity** — dead code, duplication of an existing helper, over-abstraction.

## 3. Report

For each finding:

- `path:line` — one-sentence problem
- why it matters (concrete failure scenario)
- suggested fix (snippet when short)

Order by severity: **blocker → should fix → nit**. Skip pure style nits that Prettier/ESLint would catch. If nothing is wrong, say so plainly.

For a PR, ask before posting comments to GitHub; when approved, use `gh pr review <n> --comment --body-file <file>`.
