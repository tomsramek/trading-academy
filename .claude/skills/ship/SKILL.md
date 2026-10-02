---
name: ship
description: Commit current changes, push the branch and open a GitHub pull request. Use when the user says ship it, commit and push, open a PR, or the task is finished and ready for review.
---

# Ship: commit → push → PR

## 1. Inspect

```bash
git status --short
git diff --stat
git branch --show-current
```

- If on `main`, create a branch first: `git switch -c <type>/<slug>-<issue-number>` (type from the change: feat, fix, chore, refactor, docs, test; e.g. `feat/landing-page-12`).
- Look for things that must not be committed: `.env*`, credentials, debug `console.log`, commented-out code, large binaries. Stop and ask if found.

## 2. Verify

Run the checks that exist in `package.json` scripts (skip missing ones, say which were skipped):

```bash
yarn typecheck && yarn lint && yarn test --run
```

If anything fails, fix it or report it — do not ship red.

## 3. Commit

- Stage deliberately (`git add <paths>`), not `git add -A` blindly.
- One logical change per commit. Split if the diff mixes concerns.
- Message: Conventional Commits, imperative, subject ≤ 72 chars, body explains _why_ when not obvious.

## 4. Push and open the PR

```bash
git push -u origin HEAD
gh pr create --base main --title "<same style as commit subject>" --body-file <tmpfile>
```

PR body template:

```markdown
## What

<1–3 bullets>

## Why

<motivation / linked issue: Closes #123>

## How to test

<steps, URLs, accounts>

## Screenshots

<before / after for UI changes>
```

If a PR already exists for the branch (`gh pr view` succeeds), just push and report the existing URL.

## 5. Report

Give the user the PR URL, the checks that ran and their result, and anything skipped.
