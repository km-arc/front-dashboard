# ADR-0001: pnpm workspaces + Turborepo monorepo
Status: accepted

Context: two Next.js apps (store, admin) share a design system and API client; agents need one place and one set of commands.
Decision: single repo, `apps/*` and `packages/*`, pnpm for installs, Turborepo for task caching/ordering.
Consequences: shared code is consumed as source (`exports` → `src/index.ts`) and apps set `transpilePackages`.
