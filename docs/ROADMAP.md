# Roadmap

Status values: `planned` · `plan-approved` · `in-progress` · `done` · `blocked`.
A step may start only when its dependencies are `done` and its plan is approved by the owner.

| Phase | Step | Title | Depends on | Status |
|-------|------|-------|------------|--------|
| 0 | 0.1 | Monorepo foundation, tooling, agent docs | – | done |
| 1 | 1.1 | Design tokens + theming (mode × brand) | 0.1 | done |
| 1 | 1.2 | i18n + direction (en/fa, RTL, Jalali, number formats) | 0.1 | done |
| 1 | 1.3 | shadcn base setup in packages/ui, `cn`, provider | 1.1, 1.2 | done  |
| 1     | 1.3b | ThemeProvider + BrandProvider (mode switching, no-flash, runtime brand)         | 1.3           | done  |
| 1     | 1.4a | Primitives (1/2): Button, Badge, Card, Label + test infra                       | 1.3           | done  |
| 1     | 1.4b | Primitives (2/2): Input, Checkbox, Radio, Switch, Select                        | 1.4a          | done  |
| 1     | 1.5a | Overlays (1/2): Dialog, Sheet, Alert, Skeleton                                  | 1.4a          | done    |
<<<<<<< HEAD
| 1     | 1.5b | Overlays (2/2): DropdownMenu, Tooltip, Toast (sonner)                           | 1.5a          | done    |
| 1     | 1.6a | Data display (1/2): Table, Pagination, Empty state                              | 1.4a          | done    |
<<<<<<< HEAD
<<<<<<< HEAD
| 1     | 1.6c | Data display (extra): DataTable (TanStack: sort, filter, selection)             | 1.6a          | done\*  |
| 1     | 1.6b | Data display (2/2): Tabs, Accordion                                             | 1.6a          | planned |
=======
| 1     | 1.6b | Data display (2/2): Tabs, Accordion                                             | 1.6a          | done    |
>>>>>>> step/1.6a-data-display
=======
| 1     | 1.6b | Data display (2/2): Tabs, Accordion                                             | 1.6a          | done    |
>>>>>>> step/1.6b-tabs-accordion
=======
| 1     | 1.5b | Overlays (2/2): DropdownMenu, Tooltip, Toast (sonner)                           | 1.5a          | done\*  |
| 1     | 1.6  | Data display: Table, Pagination, Tabs, Accordion, Empty state                   | 1.4a          | planned |
>>>>>>> step/1.5-overlays
| 1     | 1.7  | Forms: react-hook-form + zod integration, field components                      | 1.4b          | done    |
| 1     | 1.8a | Storybook infra: mode/locale toolbar + Button, Badge, Card, Label               | 1.4a, 1.3b    | done    |
| 1     | 1.8b | Storybook: brand toolbar, 1.4b stories, visual review checklist                 | 1.8a, 1.4b    | done    |
| 2 | 2.1 | `apps/store` shell: layout, nav, auth stub, API client + mocks | Phase 1 | planned |
| 2 | 2.2 | Store: product listing + detail (read) | 2.1 | planned |
| 2 | 2.3 | Store: cart and checkout creating an order | 2.2 | planned |
| 2 | 2.4 | Store: view cart / order history | 2.3 | planned |
| 3 | 3.1 | `apps/admin` shell: layout, RBAC navigation | Phase 1 | planned |
| 3 | 3.2 | Admin: orders management | 2.3, 3.1 | planned |
| 4 | – | Catalog definition (products, attributes, bundles, services) | 3.1 | planned |
| 5 | – | Courses (chapters, activities, enrollment, progress, exams, certificates) | 4 | planned |
| 6 | – | Payments: gateway, card-to-card, cheque; wallet and transactions | 2.3 | planned |
| 7 | – | Marketing: discount codes | 6 | planned |
| 8 | – | Support: tickets, tasks, notifications | 3.1 | planned |
| 9 | – | Inventory: multi-warehouse | 4 | planned |
| 10 | – | Dashboard analytics and reports | most of above | planned |

Phases ≥ 2 are provisional. Each gets a plan doc and owner approval before work starts.
Order follows the owner's instruction: components first, then store (cart/order) → view cart → admin orders → next module.

