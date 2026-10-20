# AGENTS.md – single source of truth for AI agents

This file is for any AI agent (Claude, Gemini, others) continuing work on this repo.
`CLAUDE.md` and `GEMINI.md` point here. Read this file first, then `docs/ROADMAP.md`.

## Project
A multi-module **storefront + admin dashboard** frontend. Single seller, multiple warehouses.
Backend is a separate **.NET** service (MongoDB inside the backend; the frontend never touches the DB).
Full requirement list: `docs/REQUIREMENTS.md`.

## Stack (see docs/decisions for the why)
- Monorepo: pnpm workspaces + Turborepo
- Next.js (App Router) + TypeScript (strict), React
- Tailwind CSS v4 + shadcn/ui (Radix primitives); OKLCH semantic tokens (see `docs/THEMING.md`)
- i18n: English (`en`, LTR) and Persian (`fa`, RTL); Jalali calendar for `fa` (see `docs/I18N.md`)
- Themes: two independent axes – mode (light/dark) × brand (loaded at runtime from the backend; default light blue)
- API: OpenAPI contract with a generated TypeScript client; mocks until backend exists

## Non-negotiable rules
1. **Plan before code.** Every phase/step has a plan doc in `docs/phases/` (use `docs/templates/phase-plan.md`).
   Implementation starts only after the human owner has approved the plan. Never skip this.
2. **Respect dependencies.** Do not start a step whose prerequisites in `docs/ROADMAP.md` are not `done`.
3. **Mobile-first.** Design/code for 360px first; enhance upward with `sm: md: lg:`.
4. **RTL-safe by default.** Use logical utilities only (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`,
   `text-start`, `text-end`, `border-s`, `rounded-e`…). Physical ones (`ml-*`, `left-*`…) are lint errors.
   Icons that imply direction must flip in RTL.
5. **No hard-coded colors or strings.** Colors come from design tokens (CSS variables); text comes from i18n messages.
6. **Components in `packages/ui` must work in plain React and in Next.js**: no `next/*` imports, no app routing
   or data fetching inside; accept data and callbacks via props. Add `"use client"` only where needed.
7. **Accessibility**: keyboard operable, visible focus, labels/ARIA, WCAG AA contrast in every theme.
8. **Small, reviewable changes**: one step per PR, conventional commits.
9. **Keep docs alive**: update `docs/ROADMAP.md` status and any affected doc in the same PR.
   Record significant decisions as a new ADR in `docs/decisions/`.
10. **If something is ambiguous, ask** (add it to `docs/OPEN_QUESTIONS.md` and ask the owner) rather than guess.

## Workflow for each step
1. Read ROADMAP → pick next `planned` step whose dependencies are `done`.
2. Write/refresh its plan doc → get approval.
3. Implement → run `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
4. Verify against `docs/DEFINITION_OF_DONE.md`.
5. Update ROADMAP status and hand-off notes at the bottom of the phase doc.

## Commands
```
pnpm install
pnpm dev | build | lint | typecheck | test | format
```

## Layout
```
apps/        Next.js apps (store, admin) – added after Phase 1
packages/ui  shared design system / components
docs/        requirements, architecture, conventions, ADRs, phase plans
```
