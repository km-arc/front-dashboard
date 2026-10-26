# Step 1.5a – Overlays: Dialog, Sheet, Alert, Skeleton

Status: implemented (patch delivered). Step 1.5 is split: **1.5b** = DropdownMenu, Tooltip, Toast.

## Decisions
- **Sheet**: logical edges. `side` is `start | end | top | bottom` (default `end`); `start`/`end` flip in RTL.
  (Owner did not object to the proposal; confirm or change before 1.5b.)
- **Toast** (1.5b): proposal is `sonner`. Not part of this patch.
- **Scrim**: `bg-background/80` + blur instead of black, so it works in light, dark and brand themes and respects
  the "no palette colors" rule.

## Delivered (`packages/ui/src/components/ui/`)
| Component | Notes |
|-----------|-------|
| `Dialog` (+ Trigger, Content, Header, Footer, Title, Description, Close) | Radix. Content is centered by a scrollable overlay (works with long content on small screens, no direction-dependent translate). Overlay carries `dir` from `UiProvider`, so the portal always matches the app direction |
| `Sheet` (+ same parts, `sheetVariants`) | Radix Dialog as a drawer; `start/end` logical edges; max 85dvh for top/bottom |
| `Alert`, `AlertTitle`, `AlertDescription`, `getAlertRole` | Variants default/info/success/warning/destructive as a logical start stripe, text stays `foreground` (contrast safe in every theme). Role: `alert` for destructive/warning, `status` otherwise |
| `Skeleton` | Decorative (`aria-hidden`), `motion-reduce` aware |
| `overlay-parts.tsx` (internal) | Shared scrim and close button (`end-4 top-4`, 44px hit area) |

## Dependencies to install
```bash
pnpm --filter @front-dashboard/ui add @radix-ui/react-dialog
```

## Usage notes
- Always render a `DialogTitle`/`SheetTitle` (Radix warns otherwise) and a description, or pass
  `aria-describedby={undefined}`.
- The close button label defaults to English `"Close"`: pass the translated text, e.g.
  `closeLabel={t("common.close")}`. (`packages/ui` components stay usable without `LocaleProvider`.)
- Wrap loading regions with `aria-busy="true"` and an accessible status text; `Skeleton` itself is hidden from AT.

## Not in this step
Open/close animations: no animation plugin is installed yet (candidate: `tw-animate-css`, decide in 1.8).
DropdownMenu, Tooltip, Toast: Step 1.5b.

## Hand-off notes
- Tests (jsdom + Testing Library + axe, ltr and rtl) could **not** be executed in the authoring sandbox. Verified
  there: strict typecheck of the whole package against stubs, the repo's convention rules (comments included),
  the ESLint string rule, and that `tailwind-merge` keeps every intended class.
- Focus-return and Escape tests use `waitFor` because Radix restores focus asynchronously.
- Run `pnpm test --force` and report failures.
