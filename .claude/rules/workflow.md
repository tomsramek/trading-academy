# Working rules for the agent

- Read the relevant code before changing it; match the surrounding style.
- Keep changes scoped to the task. Unrelated refactors go into a separate PR.
- Before saying "done": run the checks available in `package.json` scripts (`yarn lint`, `yarn build`, and `yarn typecheck` / `yarn test` once they exist), and report the real result. If something was not verified, say so.
- Never commit secrets. `.env*` files stay out of git; add new variables to `.env.example` with a placeholder.
- Branch names: `feat/<short-slug>`, `fix/<short-slug>`, `chore/<short-slug>`.
- Commits: Conventional Commits, imperative mood, subject ≤ 72 chars.
- Do not push, merge, deploy or touch production without the user's explicit go-ahead.

## Testing

Test tooling is introduced in a later phase. Until then, verify changes with `yarn lint`, `yarn build` and a manual check in the browser. Once added:

- Unit / component tests: Vitest + Testing Library, colocated as `*.test.ts(x)`.
- E2E: Playwright in `e2e/`. Select elements by role and accessible name, not by CSS classes or test IDs unless unavoidable.
- A bug fix comes with a test that fails without the fix.
