---
name: worktree
description: Start a new task on a fresh branch in a separate git worktree so it can run in parallel with other work. Use when the user wants to work on something new without disturbing the current checkout.
---

# Worktree

Worktrees live next to the repo: `../trading-academy-worktrees/<branch-slug>`.

## Steps

1. Pick a branch name from the task: `<type>/<slug>-<issue-number>`, e.g. `feat/landing-page-12` (lowercase, dashes, ≤ 40 chars, issue number last).
2. Update main and create the worktree:

   ```bash
   git fetch origin
   git worktree add -b <branch> ../trading-academy-worktrees/<slug> origin/main
   ```

3. Prepare it:

   ```bash
   cd ../trading-academy-worktrees/<slug>
   cp ../../trading-academy/.env.local .env.local 2>/dev/null || true
   yarn install --immutable
   ```

4. If a dev server should run in parallel, use a free port: `yarn dev -p 3001`.
5. Tell the user the path and branch.

## Cleanup (after the PR is merged)

```bash
git worktree remove ../trading-academy-worktrees/<slug>
git branch -d <branch>
git worktree prune
```

Never remove a worktree that has uncommitted changes without asking.
