---
name: deploy-check
description: Verify that a deploy through Coolify on Hetzner reached https://trading-academy.app and the site is healthy. Use after merging to main, when the user asks whether the deploy went out, or when production looks broken.
---

# Deploy check

Pipeline: push/merge to `main` → GitHub Actions (checks) → Coolify builds and deploys on the Hetzner server → https://trading-academy.app.

## 1. Did CI pass?

```bash
gh run list --branch main --limit 3
```

If the latest run failed, switch to the `ci-fix` skill.

## 2. Is the new version live?

```bash
curl -sS -o /dev/null -w "%{http_code} %{time_total}s\n" https://trading-academy.app
curl -sS https://trading-academy.app/api/health
```

- Expect `200`. The health endpoint should return the deployed commit SHA — compare with `git rev-parse origin/main`.
- If the SHA is old, the Coolify deploy has not finished or failed: ask the user to check the deployment log in the Coolify dashboard (or use the Coolify API if a token is configured in env as `COOLIFY_TOKEN` — never print it).

## 3. Smoke test

Check the key pages respond and render (status + no error page):

- `/` — home
- main course/listing page
- login page

Use a browser tool for a visual check when available; report console errors.

## 4. If production is broken

1. Report what fails and since which commit.
2. Propose rollback: redeploy the previous successful deployment in Coolify, or `git revert` the offending commit and ship it.
3. Do not roll back or redeploy without the user's explicit OK.

## Notes

- If `/api/health` does not exist yet, suggest adding a Route Handler returning `{ status: "ok", commit: process.env.SOURCE_COMMIT }` (Coolify exposes the commit SHA as `SOURCE_COMMIT` when enabled in the app's build settings).
