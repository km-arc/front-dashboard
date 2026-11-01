# Step 1.6b – Tabs and Accordion

Status: implemented (patch delivered).

## Decisions (owner-approved)
- **Tabs on phones**: the tab list scrolls sideways (no wrapping, no Select fallback).
- **Accordion default**: `type="single"` with `collapsible` (one open section, closable). `type="multiple"` is opt-in.

## Delivered (`packages/ui/src/components/ui/`)
| Component | Notes |
|-----------|-------|
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | Radix. Underline style. The list scrolls sideways on narrow screens (`overflow-x-auto`); triggers are `shrink-0 whitespace-nowrap` with a 44px height. In RTL the tabs run right to left and the horizontal arrow keys are mirrored (ArrowLeft = next). Give `TabsList` an `aria-label` |
| `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` | Radix. `Accordion` defaults to `type="single" collapsible`; pass `type="multiple"` or `collapsible={false}` to change it. Each trigger sits in a heading (h3), 44px high, text aligned to the reading start; the chevron only rotates, it never mirrors |
| `storybook/disclosure-text.ts` | en/fa sample copy for the stories (type-tied) |

Stories: `Disclosure/Tabs` (Default, WithDisabledTab, ManyTabsScroll) and `Disclosure/Accordion` (Single, SingleFirstOpen, Multiple).

## Apply
```bash
git am step-1.6b-tabs-accordion.patch
python3 apply-1_6b-glue.py      # barrel exports + ROADMAP 1.6b -> done* (idempotent)
pnpm --filter @front-dashboard/ui add @radix-ui/react-tabs @radix-ui/react-accordion
pnpm format && pnpm lint && pnpm typecheck && pnpm exec turbo run test --force
```

## Usage
```tsx
<Tabs defaultValue="overview">
  <TabsList aria-label={t("orders.sections")}>
    <TabsTrigger value="overview">{t("orders.overview")}</TabsTrigger>
    <TabsTrigger value="items">{t("orders.items")}</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">...</TabsContent>
  <TabsContent value="items">...</TabsContent>
</Tabs>

<Accordion defaultValue="shipping">      {/* single + collapsible */}
  <AccordionItem value="shipping">
    <AccordionTrigger>{t("faq.shipping")}</AccordionTrigger>
    <AccordionContent>{t("faq.shippingBody")}</AccordionContent>
  </AccordionItem>
</Accordion>
```

## Not in this step
Open/close animations (no animation plugin yet; decide together with the other overlays), vertical tabs, a
"Select on mobile" variant (not chosen).

## Hand-off notes
- Verified in the authoring sandbox: strict typecheck against typed stubs (including the Accordion single/multiple
  prop union), repo convention rules (comments included), en/fa copy parity by type, glue script (idempotent).
- **Not executed there** (no Radix, jsdom, Storybook): the component tests and stories. Run the test command above.
  The Accordion `args: { type: "single" }` in the story meta exists to satisfy Storybook's typing of the props
  union; if typecheck complains about the story, send the error.
