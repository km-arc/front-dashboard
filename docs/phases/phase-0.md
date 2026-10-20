# Phase 0 – Foundation

Status: approved by owner (patch requested)

## Goal
A clean base so any agent can continue: tooling, CI, conventions, roadmap.

## Delivered
- pnpm + Turborepo workspace, strict TS base config, ESLint (with RTL-safety rule), Prettier, EditorConfig
- CI workflow (format, lint, typecheck, test, build)
- `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`
- `docs/`: requirements, roadmap, architecture, conventions, DoD, ADRs, plan template, open questions
- `packages/ui` stub (empty public API)

## Not in this phase
Any component, theme, i18n code or Next.js app.

## Acceptance
`pnpm install && pnpm lint && pnpm typecheck && pnpm test` succeed on a clean checkout; CI is green.

## Hand-off notes
- Lockfile is not included; the first `pnpm install` creates it. Commit it.
- Next: owner answers Open Questions 1–3, approves `phase-1.md`.
