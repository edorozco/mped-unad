# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

MPED (Mi Primer Empleo Digital) — a prototype connecting young job-seekers ("young"), employers, and admins for micro-employment in Colombia (Spanish UI). All data is mocked (JSON files, `setTimeout`-based fake async, `localStorage`), there is no backend/API/database.

## Commands

Package manager is **pnpm** (`pnpm-lock.yaml` is present).

```bash
pnpm install
pnpm dev       # runs Vite dev server — serves ONLY the src/ SPA (see Architecture)
pnpm build     # vite build
pnpm preview   # vite preview
```

There is no lint script and no test suite/framework configured in this repo.

To preview the app the way it's meant to run in production (Next.js App Router), run Next directly, e.g. `npx next dev`. `next.config.js` sets `typescript.ignoreBuildErrors: true`, so type errors do not fail the Next build.

**Known blocker: `next dev`/`next build` currently fail outright** with `Error: \`pages\` and \`app\` directories should be under the same folder`. Next.js auto-detects `src/pages/` (the Vite SPA's page components, not a Next Pages Router) as a Pages Router directory, which conflicts with `app/` living at the repo root. This has not been fixed — confirm with the user before renaming `src/pages` (touches every import across the `src/` SPA), since it also means production (Vercel, which builds with `"framework": "nextjs"`) may currently fail to build for the same reason.

## Architecture: two parallel apps in one repo

This repo contains **two separate frontend entry points that both exist simultaneously**, at different stages of a migration from Vite/React Router to Next.js App Router. Knowing which one you're editing matters — a route can exist in one, the other, or (partially) both.

1. **`src/` — the original Vite + React Router SPA.**
   Entry: `index.html` → `src/main.jsx` → `src/App.jsx` (wraps `BrowserRouter` + `AuthProvider`/`UserProvider`/`JobsProvider`) → `src/AppRoutes.jsx` (all routes + `ProtectedRoute` role-gating based on context state, not middleware). Pages live in `src/pages/**`, shared presentational components in `src/components/{common,layout,jobs,academic}`, mock data in `src/data/*.json`. Auth/user/job state lives in `src/contexts/*.jsx` and persists the current user to `localStorage["mped_user"]`. `pnpm dev` (Vite) serves *only* this app — routes such as `/contacto`, `/credentials`, `/ratings`, `/notifications`, `/work/*` only exist here.

2. **`app/` — the Next.js App Router app.**
   This is what `vercel.json` (`"framework": "nextjs"`) actually deploys to production. It re-implements routing per-page using Next primitives (`next/navigation`, `next/link`) instead of React Router, with its own context providers in `app/contexts/*.tsx` (mounted via `app/providers.tsx`, though not every page tree currently wires `Providers` in) and its own top-level auth check in `middleware.ts`. Pages under `app/**/page.tsx` import and reuse the *same* presentational components from `src/components/**` (e.g. `Header`, `Navigation`, `JobCard`, `Button`, `Input`) rather than duplicating them — so shared UI edits in `src/components/**` affect both apps, but page-level logic/data-fetching must be changed in each app's own page file. Only a subset of routes has been migrated here (compare `app/` route folders against `src/pages/**`/`src/AppRoutes.jsx` to see what's missing, e.g. Contact, Credentials, Ratings, Notifications, Work/* are not yet under `app/`).

   Notably `app/page.tsx` (the Next root `/` route) renders the *entire* `src/App` SPA as a client component — so navigating client-side from `/` (e.g. via React Router `Link`s inside pages rendered by `src/AppRoutes.jsx`) can reach routes that have no corresponding `app/**/page.tsx`, but a hard refresh/direct URL to one of those paths will 404 against the Next.js server since Next only knows about its own `app/` route tree.

   Auth is inconsistent between the two: `middleware.ts` in the Next app checks a `mped_user` **cookie**, but `app/contexts/AuthContext.tsx` (like its `src/` counterpart) only ever writes the user to `localStorage`, never sets a cookie — so the middleware's redirect logic will not see a logged-in user.

### Practical implication

When asked to change a page/feature, check whether it needs to change in `src/pages/**` (Vite SPA), the matching `app/**/page.tsx` (Next), or both, and whether the corresponding shared component in `src/components/**` also needs updating. When adding a new route, decide whether it belongs only in `src/AppRoutes.jsx`, only under `app/`, or both, based on whichever of the two apps the feature is targeting.

## UI stack

- Tailwind CSS v4 (`app/globals.css`, CSS variables/oklch tokens) plus a v3-style `tailwind.config.js` defining custom MPED brand colors (`primary-dark`, `primary-cyan`, `gray-soft-*`, `accent-gold`) alongside the shadcn/ui CSS-variable palette (`--primary`, `--card`, etc.).
- shadcn/ui components (`components.json`, `style: new-york`) live in `components/ui`; import aliases are `@/components`, `@/lib`, `@/hooks`, `@/components/ui` (see `tsconfig.json` `paths` and `components.json` `aliases`).
- `lib/utils.ts` exports `cn()` (clsx + tailwind-merge) used throughout for conditional classNames.
