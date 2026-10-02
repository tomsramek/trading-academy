# TypeScript & React

## TypeScript

- `strict` mode stays on. No `any`; use `unknown` and narrow it.
- No non-null assertions (`!`) unless the invariant is commented right next to it.
- Prefer `type` for unions and props, `interface` only when extension is needed.
- Validate every external input (forms, route params, API responses, env vars) with a zod schema at the boundary (add `zod` with the first form or API route); trust the inferred types inside.
- Export types from the module that owns them; do not create a global `types.ts` dumping ground.

## React

- Function components only. One exported component per file; file name = component name in PascalCase.
- Props are typed explicitly; destructure them in the signature.
- Derive values during render instead of syncing them into state with `useEffect`.
- `useEffect` is for talking to things outside React (subscriptions, DOM APIs). Data fetching is not one of them — use Server Components or the data layer.
- Keys must be stable IDs, never array indexes for lists that can reorder.
- Lift state only as high as needed; colocate it with its consumers.
- Memoize (`useMemo`, `useCallback`, `memo`) only with a measured reason.

## Next.js (App Router)

- Components are Server Components by default. Add `"use client"` only to the smallest leaf that needs interactivity or browser APIs.
- Fetch data in Server Components or Route Handlers; mutations go through Server Actions with validation and auth checks inside the action.
- Never import server-only code (DB, secrets) into client components — guard such modules with `import "server-only"` (add the `server-only` package when the first such module appears).
- Every route segment that loads data has `loading.tsx` and `error.tsx` where it makes sense.
- Use `next/image`, `next/link` and `next/font`; set `metadata` per page.
- Env vars exposed to the browser must start with `NEXT_PUBLIC_`; everything else stays server-side.

## Project structure

```
src/
  app/            routes, layouts, route handlers
  components/     shared UI (ui/ = primitives, feature folders for the rest)
  lib/            pure helpers, clients, schemas
  server/         server-only code (db, auth, actions)
```

Use the `@/` import alias instead of long relative paths.
