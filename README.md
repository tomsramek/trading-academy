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
git clone https://github.com/wptom/trading-academy.git
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

## Contributing

Work is planned in [GitHub Projects](https://github.com/users/wptom/projects/3).
Every change starts from an issue, lives on its own branch and is merged through a pull request.
Commit messages follow [Conventional Commits](https://www.conventionalcommits.org).
