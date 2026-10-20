# Requirements

Living document. Update it whenever the owner changes scope. IDs are stable; never renumber.

## Cross-cutting (NFR)
| ID | Requirement |
|----|-------------|
| NFR-1 | Built incrementally with AI agents; each step planned before implementation |
| NFR-2 | Dependent steps are ordered by dependency |
| NFR-3 | Mobile-first responsive |
| NFR-4 | Theming: light, dark, and customer-brand themes |
| NFR-5 | Multi-language: en, fa |
| NFR-6 | RTL and LTR |
| NFR-7 | Follow best practices (a11y, performance, security, testing) |
| NFR-8 | Components usable in React and Next.js |
| NFR-9 | Codebase continuable by other agents (Claude, Gemini) – see AGENTS.md |

## Panels
| ID | Requirement |
|----|-------------|
| PNL-1 | Storefront panel (customer) |
| PNL-2 | Admin / dashboard panel |
| PNL-3 | Single seller; products may ship from multiple warehouses |

## Domain modules
| ID | Module | Notes |
|----|--------|-------|
| CAT-1 | Product types | physical, bundle, service, course |
| CAT-2 | Product / course definition and product attributes | |
| CRS-1 | Courses | course → chapters → activities |
| CRS-2 | Activity types | multiple kinds, plus exams |
| CRS-3 | Progress tracking and certificates | |
| CRS-4 | Enrollment | purchase enrolls the student for a fixed duration |
| ORD-1 | Cart and orders | first storefront module |
| PAY-1 | Payment methods | online gateway, card-to-card, cheque |
| PAY-2 | Wallet and transactions | |
| MKT-1 | Discount codes and marketing | |
| SUP-1 | Tickets | |
| SUP-2 | Tasks | |
| SUP-3 | Notifications | multiple channel types |
| INV-1 | Multi-warehouse stock and shipping | |

## Tech decisions
Next.js, .NET backend (MongoDB behind it), shadcn + Tailwind, pnpm monorepo. See `docs/decisions/`.
