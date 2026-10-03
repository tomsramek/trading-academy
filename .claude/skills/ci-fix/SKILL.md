---
name: ci-fix
description: Diagnose a failing GitHub Actions run for the current branch or a PR, find the root cause and propose or apply a fix. Use when CI is red, a check failed, or the user pastes a failing workflow link.
---

# CI fix

## 1. Find the failing run

```bash
gh run list --branch "$(git branch --show-current)" --limit 5
gh pr checks <number>          # when working from a PR
gh run view <run-id> --log-failed
```

## 2. Classify the failure

| Type          | Signs                              | Typical fix                                                                   |
| ------------- | ---------------------------------- | ----------------------------------------------------------------------------- |
| Type error    | `tsc` output, `TS2xxx`             | Fix types; never silence with `any` / `@ts-ignore`                            |
| Lint          | ESLint rule names                  | Fix the code; disable a rule only with a comment explaining why               |
| Test          | Vitest / Playwright failure        | Reproduce locally first (`yarn test <file>`), then fix code or test           |
| Build         | `next build` error                 | Often server/client boundary, missing env var, or dynamic API in static route |
| Env / secrets | `undefined` config, auth errors    | Missing GitHub secret — tell the user which one, never invent values          |
| Flaky         | Passes on re-run, timing-dependent | Fix the wait/selector; don't just retry                                       |
| Infra         | Runner / network / cache errors    | Re-run once: `gh run rerun <id> --failed`                                     |

## 3. Reproduce locally

Run the same command the workflow runs (read `.github/workflows/*.yml`). Use the same Node version as CI.

## 4. Fix and verify

- Smallest change that fixes the root cause.
- Re-run the failing command locally until green.
- Hand over to `ship` to push (ask first), then watch: `gh run watch`.

## 5. Report

Root cause in one sentence, what changed, and the local verification result.
