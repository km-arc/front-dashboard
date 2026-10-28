# AGENTS.md – single source of truth for AI agents

This file is for any AI agent (Claude, Gemini, others) continuing work on this repo. `CLAUDE.md` and `GEMINI.md` point here. Read this file first, then `docs/ROADMAP.md`.

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

## Environment

- Node >= 20.19 (Storybook 10 and Vite 7 need it; `.nvmrc` is the reference) and pnpm 9.15.0 (`packageManager` in `package.json`).
  If Corepack cannot download pnpm, use `npm install -g pnpm@9.15.0`.
- Prettier is not applied to Markdown files here: keep tables and lists tidy by hand.
- `packages/ui` has no `build` script; its extra checks are `pnpm build-storybook` and, for visual review, `pnpm storybook`
  (run both inside `packages/ui`).

## `packages/ui` conventions

```
src/components/ui/        public primitives: <name>.tsx + <name>.test.tsx + <name>.stories.tsx
src/components/internal/  helpers used by primitives (not exported, no story needed)
src/theme  src/i18n  src/provider  src/lib  src/styles   tokens, brand/mode, locale + messages, providers, utils, CSS
src/storybook/            decorators (toolbar: mode, brand, locale), story sample text
src/test/                 test helpers (see Testing)
docs/checklists/          visual review checklists, one per step
```

- Export every public primitive from `src/components/ui/index.ts` (append one line per component; no duplicates).
- Variants with `cva`; merge classes with `cn`. Use only semantic tokens (`bg-primary`, `text-muted-foreground`, ...).
- Touch targets are at least 44px on phones (`min-h-11`); controls show a visible focus ring.
- Text comes from props or from built-in messages in `src/i18n/messages.ts` (flat keys such as `common.close`, `a11y.pagination`).
  Add every key to both `en` and `fa`; placeholders use `{name}` and are filled with `t(key, { name })`.
  Numbers, dates and money go through `useLocale().formatters` (Persian digits and Jalali dates in `fa`).
- Components that need a translated label take it as a prop or read `useLocale()`; they then require a `LocaleProvider`.
- Direction: `UiProvider` supplies Radix direction; the app sets `<html lang dir>` from the locale. Direction-bearing icons
  flip with `rtl:`. Portal content (tooltips, menus, dialogs) inherits direction from `<html>`.

## Testing and guards

- Stack: Vitest + jsdom + Testing Library + `jest-axe`. Put `// @vitest-environment jsdom` at the top of component tests.
- Helpers in `src/test/`: `utils.tsx` (`renderWithDir`, `directions`, `expectNoA11yViolations`), `locale-render.tsx`
  (`renderLocalized`, `testLocales`, for components that read messages) and `polyfills.ts` (import it in tests that render
  Radix primitives needing `ResizeObserver` or pointer capture: Select, Checkbox/Switch inside a form, Dialog, Tooltip...).
- Test every component in LTR and RTL (and in `en` and `fa` when it reads messages), including `jest-axe`.
  Arrow-key tests on Radix RadioGroup must hold the key (see `radio-group.test.tsx`).
- Guards that fail the build, so keep sources clean:
  - `src/components/conventions.test.ts` scans non-test sources under `src/components` line by line, comments included,
    for color literals, Tailwind palette colors and physical utilities. Do not write words like `right-align` or `left-to-right`
    in comments or strings; write `end-align` or `LTR`.
  - ESLint rejects string literals containing physical class names (`left-`, `right-`, `ml-`...).
  - `src/storybook/stories.test.ts` requires a `.stories.tsx` for every `components/ui/*.tsx`.
  - `src/config.test.ts` forbids `next/*` imports.

## Review and definition of done

- A step is `done` in `docs/ROADMAP.md` only after the owner has reviewed it in Storybook with that step's checklist
  (mode x brand x `en`/`fa`). Tests alone are not enough for anything visual or directional.
- Phase docs and checklists are bilingual (English and Persian).
- Each step plan sets a file and line budget. Stay inside it, or say plainly in the PR how much it was exceeded and why.

## Git, CI and GitHub

- Branch per step: `step/<n>-<slug>` (docs-only work: `docs/<slug>`). Conventional commits. One step per PR; CI job `CI/verify` must pass.
- Before pushing any merge or rebase, run `git grep -nE '^(<<<<<<<|=======|>>>>>>>)' -- packages docs apps`
  and `pnpm lint && pnpm typecheck && pnpm test`. Conflict markers were once committed to `main`; never resolve conflicts by committing them.
- `gh pr create`, `gh pr edit` and `gh pr merge` can fail in this setup (GraphQL errors such as Projects classic or
  "Head sha can't be blank"). Use the REST API instead:
  `gh api -X POST repos/km-arc/front-dashboard/pulls -f title=... -f head=<branch> -f base=main -f body=...`
  and `gh api -X PUT repos/km-arc/front-dashboard/pulls/<n>/merge -f merge_method=squash`.
  "No commits between main and <branch>" usually means the branch was already merged and deleted.

## Working with other agents

Several agents (and the owner) work in this repo. Before starting a step:

1. `git fetch origin && git ls-remote --heads origin` and `gh pr list --state all --limit 10`: check that nobody has the step.
2. Set the step to `in-progress` in `docs/ROADMAP.md` on your branch early, and push the branch.
3. Do not push to another agent's branch, force-push `main`, or redo work that already exists on a branch: review it and add what is missing.

## Talking to the owner

The owner writes in Persian. When asking the owner to run commands, give one step at a time, say what output to expect, and wait for the
result before the next step. Do not hand over several tasks or ask the owner to decide from several outputs at once.

## Known follow-ups

- `src/components/ui/index.ts` has duplicated `export * from "./form";` lines (harmless; tidy up).
- `DialogContent` and `SheetContent` default `closeLabel` to the English text "Close": callers must pass the translated label.
- `Table` scrolls inside a wrapper that is not keyboard focusable; TanStack Table is deferred to the admin phase.
