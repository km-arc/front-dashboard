# Step 1.6b – Data display (2/2): Tabs, Accordion / نمایش داده (۲ از ۲)

Depends on / وابسته به: 1.6a · Budget / بودجه: ≤ 10 files, ≤ 450 lines

## Scope / محدوده
- `Tabs` (`@radix-ui/react-tabs`): list scrolls sideways when tabs overflow; triggers are 44px tall on phones. Arrow keys follow the reading direction (UiProvider supplies it).
- `Accordion` (`@radix-ui/react-accordion`): `single` (collapsible) and `multiple`; the arrow points down and rotates when open, so it needs no RTL flip; 44px triggers; `motion-reduce` disables the open/close animation.

## Automated checks / ارزیابی خودکار
Tabs: roles, switching, disabled tab, arrow keys in LTR and RTL, jest-axe. Accordion: closed by default, open and close, single and multiple, keyboard (Enter, ArrowDown), jest-axe.
Conventions guard and "every primitive has a story" guard. `pnpm lint && pnpm typecheck && pnpm test`, `pnpm build-storybook`.

## Owner review / بازبینی مالک
`docs/checklists/visual-review-1.6b-tabs-accordion.md`.
