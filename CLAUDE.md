# Trading Academy

Free online academy for learning crypto trading — from complete beginners to advanced traders.
Live at **https://trading-academy.app**.

## Product

- Courses are structured as course → module → lesson; every course has a level (Beginner, Intermediate, Advanced).
- English is the default language; Czech is available via a language switch.
- All content is free.
- Market focus: crypto.

## Stack

- TypeScript (strict), React, Next.js (App Router), Tailwind CSS
- Package manager: Yarn 4 (`nodeLinker: node-modules`) — never use npm or pnpm
- Git hosting: GitHub (`gh` CLI), work tracked in GitHub Projects
- CI: GitHub Actions → deploy via Coolify on a Hetzner server

## Conventions

- Detailed rules live in `.claude/rules/` — follow them.
- Every change starts from a GitHub issue; reference it in the branch name (`<type>/<slug>-<N>`) and the PR (`Closes #N`).
- Commits follow Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`).
- Never commit to `main` directly; work on a branch and open a PR.
- Only use libraries that are already in `package.json`. Adding a new dependency is a decision — propose it first.

## Project skills

| Skill          | Use it for                                             |
| -------------- | ------------------------------------------------------ |
| `ship`         | Commit, push and open a GitHub PR                      |
| `review`       | Review a diff or PR against the project rules          |
| `worktree`     | Start a task on a fresh branch in its own git worktree |
| `ci-fix`       | Diagnose a failing GitHub Actions run and fix it       |
| `deploy-check` | Verify a Coolify deploy reached trading-academy.app    |

@AGENTS.md
