# Trading Academy

A free online academy for learning crypto trading — from your very first candle chart to advanced strategies.

🌐 **https://trading-academy.app**

## Features

- Structured courses: course → module → lesson
- Levels for every course: Beginner, Intermediate, Advanced
- English and Czech
- Free for everyone

## Tech stack

| Area            | Technology                                 |
| --------------- | ------------------------------------------ |
| Framework       | [Next.js](https://nextjs.org) (App Router) |
| Language        | TypeScript                                 |
| Styling         | [Tailwind CSS](https://tailwindcss.com)    |
| Package manager | [Yarn 4](https://yarnpkg.com)              |
| CI              | GitHub Actions                             |
| Hosting         | Coolify on Hetzner                         |

## Getting started

### Requirements

- [Node.js](https://nodejs.org) 22 or newer
- Yarn — enable it once with `corepack enable` (the project pins its own Yarn version)

### Install and run

```bash
git clone https://github.com/tomsramek/trading-academy.git
cd trading-academy
yarn install
yarn dev
```

Open http://localhost:3000.

## Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `yarn dev`        | Start the development server   |
| `yarn build`      | Create a production build      |
| `yarn start`      | Run the production build       |
| `yarn lint`       | Check the code with ESLint     |
| `yarn typecheck`  | Check types with TypeScript    |
| `yarn format`     | Check formatting with Prettier |
| `yarn format:fix` | Fix formatting with Prettier   |

## Deployment

The app runs as a Docker container on a Hetzner server managed by [Coolify](https://coolify.io).

```
merge to main → GitHub Actions (CI) → Coolify webhook → docker build → health check → live
```

- Every push to `main` is deployed automatically.
- Coolify starts the new version next to the old one and switches traffic only after the health check passes. If it fails, the old version keeps running.
- HTTPS certificates (Let's Encrypt) are issued and renewed by Coolify. `www.trading-academy.app` redirects to `trading-academy.app`.

### Health check

```bash
curl https://trading-academy.app/api/health
# {"status":"ok","commit":"<git sha>"}
```

`commit` is the deployed Git commit. Compare it with the latest commit on `main`:

```bash
git fetch && git rev-parse origin/main
```

### Verify a deployment

1. CI on `main` is green (GitHub → Actions).
2. The deployment in Coolify (application → Deployments) finished with **Success**.
3. `/api/health` returns `"status":"ok"` and the expected `commit`.
4. The home page loads over HTTPS.

### Roll back

**Fast — previous image in Coolify:** application → **Rollback** → pick the last working version → **Rollback**. The old image is started again without a rebuild. Use this when production is broken and you need it fixed now.

**Permanent — revert in Git:** create a branch, `git revert <bad-commit>`, open a pull request and merge it. The revert is deployed like any other change and keeps `main` in sync with production. Do this after a fast rollback, otherwise the next deploy brings the broken change back.

### Run the production image locally

```bash
docker build -t trading-academy:local --build-arg SOURCE_COMMIT=$(git rev-parse --short HEAD) .
docker run --rm -p 3000:3000 trading-academy:local
```

## Contributing

Work is planned in [GitHub Projects](https://github.com/users/tomsramek/projects/1).
Every change starts from an issue, lives on its own branch and is merged through a pull request.
Commit messages follow [Conventional Commits](https://www.conventionalcommits.org).
