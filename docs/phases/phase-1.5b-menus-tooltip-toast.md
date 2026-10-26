# Step 1.5b – DropdownMenu, Tooltip, Toast

Status: implemented (patch delivered). Completes Step 1.5.

## Decisions
- **Toast**: `sonner` (small, accessible live region, swipe to dismiss, RTL via its `dir` prop). Colors come from
  the design tokens through sonner's CSS variables, so light, dark and brand themes work.
- Default toast position is `bottom-center` (best one-handed on phones). Sonner's corner positions are
  physical (left/right); pick them per app if needed.

## Delivered (`packages/ui/src/components/ui/`)
| Component | Notes |
|-----------|-------|
| `DropdownMenu` (+ Trigger, Content, Item, CheckboxItem, RadioGroup/RadioItem, Label, Separator, Shortcut, Sub, SubTrigger, SubContent) | Radix. 44px items on mobile, compact from `md`. Submenu opens with ArrowRight in LTR and **ArrowLeft in RTL**; the sub-menu chevron flips with `rtl:rotate-180`; indicators at `start-2`, shortcuts at `ms-auto` |
| `Tooltip` (+ Trigger, Content, Provider) | Radix. `Tooltip` includes its own provider. Opens on hover and keyboard focus, closes on Escape. Never put essential info only in a tooltip (no hover on touch) |
| `Toaster`, `toast` | Mount `<Toaster />` once inside `UiProvider`; call `toast("Saved")`, `toast.error(...)` from anywhere |

All three read the direction from `UiProvider` (also inside portals).

## Dependencies to install
```bash
pnpm --filter @front-dashboard/ui add @radix-ui/react-dropdown-menu @radix-ui/react-tooltip sonner
```

## Companion fix (run once, from the repo root)
`dialog.tsx` and `sheet.tsx` (Step 1.5a) call `useDirection`, so they need the `"use client"` directive to be
importable from Next.js Server Components:
```bash
python3 use-client-fix.py
```
The new files already have it. The script is idempotent and independent of formatting.

## Usage
```tsx
// once, near the root (inside UiProvider). `theme` only affects sonner's own icons/close button.
const { resolvedMode } = useTheme();
<Toaster theme={resolvedMode} />

toast.success(t("order.placed"));
```
Toast messages must be translated by the caller (`t()`); the library never hard-codes visible text.

## Not in this step
Toast actions styling beyond sonner defaults, animations plugin decision (Step 1.8).

## Hand-off notes
- Tests (jsdom + Testing Library + axe, ltr and rtl) could **not** be executed in the authoring sandbox.
  Verified there: strict typecheck of the whole package against stubs, convention rules (comments included),
  the ESLint string rule, and a scan that every file calling hooks has `"use client"`.
- Sonner needs `window.matchMedia` (not in jsdom): `toaster.test.tsx` stubs it locally. Add the same stub to
  `src/test/polyfills.ts` if more tests render `<Toaster />`.
- Submenu keyboard tests rely on Radix behavior under jsdom. If they are flaky, check the polyfills first.
- Run `pnpm test --force` and report failures.
