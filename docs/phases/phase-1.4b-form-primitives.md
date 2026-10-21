# Step 1.4b – Form primitives: Input, Checkbox, RadioGroup, Switch, Select

Status: implemented (patch delivered).

## Decisions (owner-approved)
- **Select**: Radix Select (consistent look, full RTL support). A `NativeSelect` can be added later if needed.
- **Input**: email / tel / url / number (and `inputMode` email, tel, url, numeric, decimal) are `dir="ltr"`
  automatically, even on RTL pages. Plain text inherits the page direction. An explicit `dir` prop always wins.
- **Height**: same as Button, `min-h-11` (44px touch target) on every size.

## Delivered (`packages/ui/src/components/ui/`)
| Component | Notes |
|-----------|-------|
| `Input` (+ `getInputDir`) | 16px text on mobile (prevents iOS zoom), 14px from `md`; `aria-invalid` styling; Persian placeholder stays on the reading side for LTR content on RTL pages |
| `Checkbox` | Radix; indeterminate state; hit area enlarged to 44px with `after:` |
| `RadioGroup`, `RadioGroupItem` | Radix; arrow keys follow the reading direction (RTL horizontal: ArrowLeft = next) |
| `Switch` | Radix; thumb moves with **logical margin** (`ms-5`), so it flips in RTL with no `rtl:` variants |
| `Select` (+ Trigger, Value, Content, Item, Group, Label, Separator, scroll buttons) | Radix; list inherits `dir` from `UiProvider` inside the portal; 44px items on mobile |
| `icons.tsx` (internal) | Inline SVG check/minus/chevrons, no icon-library dependency |

Also: `src/test/polyfills.ts` (ResizeObserver, pointer capture, `scrollIntoView` for jsdom). Import it from any test
that renders Radix Select / Checkbox / Switch.

## Dependencies to install
```bash
pnpm --filter @front-dashboard/ui add @radix-ui/react-checkbox @radix-ui/react-radio-group @radix-ui/react-switch @radix-ui/react-select
```
(`@radix-ui/react-direction`, `class-variance-authority`, `@radix-ui/react-label` come from steps 1.3 / 1.4a.)

## Not in this step
Field wrapper (label + hint + error + `aria-describedby`) and react-hook-form integration: Step 1.7.
Textarea, Slider, Combobox: not planned yet (add to ROADMAP when needed).

## Hand-off notes
- Tests are jsdom + Testing Library + axe, run in both `ltr` and `rtl`. They could **not** be executed in the
  authoring sandbox (no jsdom / Radix installed). What was verified there: strict typecheck of the whole package
  against stubs, the repo's own convention rules (no hard-coded colors, no palette colors, no physical
  left/right utilities, comments included), the `Input` rendered with real React + `tailwind-merge`
  (dir logic, class overriding), and token existence. Please run `pnpm test` and report failures.
- The Select tests rely on Radix behavior under jsdom (open via keyboard / click, select by click). If a test is
  flaky, check `src/test/polyfills.ts` first.
- Ensure `packages/ui/src/index.ts` exports the components: `export * from "./components/ui";`
- Visual verification (mode × brand × direction) arrives with Storybook in Step 1.8.
