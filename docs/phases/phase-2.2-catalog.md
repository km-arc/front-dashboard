# Step 2.2 – catalog: lists and product pages (read only) / فهرست و صفحهٔ محصول

Status: **2.2a delivered as a patch** (contract and sample catalog); 2.2b–2.2d not started.

Depends on / وابسته به: 2.1e-4 · Split into 2.2a–2.2d; each sub-step is one PR.

## Goal / هدف

The store shows real content: categories, product lists with sort and paging, search and a product page, in both languages,
fast and indexable. Buying (cart, checkout) is 2.3; the add-to-cart button is shown but off until then.

## What the owner asked for (2026-11-12)

- **The price unit is configurable from the backend.** `GET /store/settings` returns `currency.code`; no unit is hard-coded
  in the app. `IRT` is Toman (not an ISO code, handled by `formatters.money` in `packages/ui`), `IRR` and ISO codes go
  through `Intl`. Every price in the API is an amount in the major unit of that currency.
- **Categories are a tree, with four top-level categories**: Digital goods (software and licenses, gift cards, templates and
  design files), Books and culture (books, stationery), Online courses (programming, languages, design) and Supermarket and
  food (nuts and snacks, tea and beverages, breakfast).
- **Products come in three kinds**, `kind`: `physical` (shipped), `digital` (downloaded or activated) and `course` (access to
  lessons). The catalog lists them together; carts, delivery and the product page differ by kind later (2.3, Phase 5).

## Design decisions (proposed; each becomes an ADR when approved)

| # | Decision | Why |
|---|----------|-----|
| C1 | Contract in `packages/api/openapi/openapi.yaml`: `GET /store/settings`, `GET /categories` (flat list with `parentSlug`), `GET /products` (`category`, `q`, `sort`, `page`, `pageSize`, `locale`), `GET /products/{slug}` (with `categoryPath` for the breadcrumb) | Contract first (ADR-0005); the backend can implement it later |
| C2 | A top-level category filter includes the products of every category below it; `productCount` counts the same way | What a shopper expects from "Online courses" |
| C3 | Texts come in the language of the `locale` query parameter (`en` or `fa`), not from the `Accept-Language` header | Part of the URL, so caches stay correct |
| C4 | Sort and page live in the query string of the list pages (shareable, back button works); list pages are server rendered and cached for a few minutes through the fetch cache | SEO and speed without losing freshness |
| C5 | Product pages are generated on demand and then cached (ISR), with metadata (title, description, Open Graph) per product | A catalog can be large; no build-time list needed |
| C6 | Images: the contract has `images` and `image` (URL and alt). Until the backend supplies them, cards and the page show a neutral placeholder; remote image hosts will be configured by an environment variable when real URLs exist | No fake images; one setting later |
| C7 | The sample API serves the catalog (15 products, 15 categories, Persian and English texts) so every page works without a backend | Same approach as brand and auth |

## Sub-steps and automated evaluation

| Step | Content | Automated evaluation |
|------|---------|----------------------|
| 2.2a | Contract, sample catalog, sample API routes (path parameters added to the mock fetch) | `catalog.test.ts` (settings, tree, counts, paging, filter, search in both languages, sort, discount, validation, product page, 404), `generate:check` |
| 2.2b | `getStoreSettings` and catalog readers in `apps/store`, product card (name, price, old price, stock, kind), category list and product list pages with sort and paging, the categories tab and header link on | tests for the price display and for reading the query string; build keeps `/en` and `/fa` static |
| 2.2c | `/search?q=`, search field, the search tab and header icon on | tests for the query handling; checklist |
| 2.2d | `/products/[slug]`: breadcrumb, gallery placeholder, price, details by kind, add-to-cart off until 2.3, metadata | tests for the kind-specific details; checklist |

## Risks and open questions

- Real images and their host: needed before 2.2d is final (C6).
- Search quality (typos, Persian and Arabic letter variants such as ی and ي, digits) is simple substring matching in the sample;
  the backend decides how the real search works. The front end only passes `q`.
- Stock is a plain `inStock` flag for now; quantities and variants (size, color) are a later contract change.

## Hand-off notes / یادداشت تحویل

### 2.2a – contract and sample catalog (patch delivered, awaiting local verification)

- `openapi.yaml` and `src/schema.d.ts`: the four endpoints above and the `StoreSettings`, `Currency`, `Category`,
  `ProductKind`, `ProductImage`, `ProductSummary`, `ProductPage`, `ProductAttribute`, `CategoryRef` and `Product` schemas.
  The types were written by hand in the generator's format: **run `pnpm --filter @front-dashboard/api generate` once and
  commit any difference**.
- `src/sample-catalog.ts` (only in the `./mock` entry): the category tree, 15 products (digital goods, books and stationery,
  four courses, three food items) with Persian and English texts and Toman prices, and the query function.
- `src/mock.ts`: the four routes; route keys may now have `:name` segments (`GET /products/:slug`), and handlers receive
  those values as a second argument. Bad `locale`, `page`, `pageSize` or `sort` answer 400, an unknown product 404.
- No new dependency; the lockfile does not change.

**Not executed in the authoring sandbox** (no network): install, generate, lint, typecheck and tests.

---

## خلاصهٔ فارسی

گام ۲.۲ فروشگاه را با محتوای واقعی پر می‌کند: دسته‌بندی‌ها (درختی)، فهرست محصول با مرتب‌سازی و صفحه‌بندی، جستجو و صفحهٔ
محصول. واحد قیمت از بک‌اند می‌آید (`GET /store/settings` و `currency.code`، مثل `IRT` برای تومان)، نه ثابت در کد. چهار دستهٔ اصلی:
کالاهای دیجیتال، کتاب و فرهنگ، دوره‌های آنلاین، و سوپرمارکت و کالاهای خوراکی، هر کدام با زیرمجموعه. محصول سه نوع دارد: فیزیکی،
دیجیتال و دوره. ۲.۲a فقط قرارداد، داده‌های نمونه و مسیرهای API نمونه است؛ صفحه‌ها در ۲.۲b تا ۲.۲d می‌آیند.
