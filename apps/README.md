# apps/

Next.js applications are added here, one per panel:

- `apps/store` – customer-facing storefront (starts after Phase 1, see `docs/ROADMAP.md`)
- `apps/admin` – admin / dashboard panel

Both consume `@front-dashboard/ui` and talk to the .NET backend only through the generated API client.
