# Roadmap

Status values: `planned` · `plan-approved` · `in-progress` · `done` · `blocked`.
A step may start only when its dependencies are `done` and its plan is approved by the owner.

| Phase | Step | Title | Depends on | Status |
|-------|------|-------|------------|--------|
| 0 | 0.1 | Monorepo foundation, tooling, agent docs | – | done |
| 1 | 1.1 | Design tokens + theming (mode × brand) | 0.1 | done* |
| 1 | 1.2 | i18n + direction (en/fa, RTL, Jalali, number formats) | 0.1 | done* |
| 1 | 1.3 | shadcn base setup in packages/ui, `cn`, provider | 1.1, 1.2 | planned |
| 1 | 1.4 | Primitives: Button, Input, Label, Checkbox, Radio, Switch, Select, Badge, Card | 1.3 | planned |
| 1 | 1.5 | Overlays and feedback: Dialog, Sheet, Dropdown, Tooltip, Toast, Skeleton, Alert | 1.4 | planned |
| 1 | 1.6 | Data display: Table, Pagination, Tabs, Accordion, Empty state | 1.4 | planned |
| 1 | 1.7 | Forms: react-hook-form + zod integration, field components | 1.4 | planned |
| 1 | 1.8 | Storybook with theme/brand/locale/direction toolbar + a11y checks | 1.4 | planned |
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

\* Code and tests done; visual verification across mode × brand × dir happens with Storybook in Step 1.8.
