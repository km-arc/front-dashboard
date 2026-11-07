# Definition of Done (per step)

- [ ] Plan doc existed and was approved before coding
- [ ] Mobile-first: works at 360px; no horizontal page scroll
- [ ] Light, dark and brand theme verified
- [ ] LTR (en) and RTL (fa) verified; no physical-direction classes
- [ ] Keyboard navigation and focus visible; ARIA/labels; AA contrast
- [ ] Loading, empty and error states handled
- [ ] Unit/component tests added; `pnpm verify` and `pnpm build` pass locally, and CI is green **before** merging (never merge a red PR)
- [ ] Storybook stories (for `packages/ui`)
- [ ] New imports are declared in the package.json of the package that uses them; lockfile committed (`pnpm install`)
- [ ] Docs and ROADMAP updated; hand-off notes written in the phase doc
