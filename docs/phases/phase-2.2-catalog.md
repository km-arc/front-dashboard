# Step 2.2 – catalog: lists and product pages (read only) / فهرست و صفحهٔ محصول

Status: 2.2a and 2.2b done; 2.2c done (search); **2.2e-1 delivered as a patch** (desktop header and mega menu); 2.2e-2 (phones), 2.2d (product page) and 2.2f (home) not started.

Depends on / وابسته به: 2.1e-4 · Split into 2.2a–2.2f; each sub-step is one PR.

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
| 2.2c | `/search?q=`: search field, results with sort and paging, no-results page, `noindex`; the search tab and header icon on | tests for the search query handling; checklist |
| 2.2e-1 | Desktop navigation (owner request 2026-11-13, see below): two-row header with a wide search bar and the category mega menu | tests for the menu data; checklist |
| 2.2e-2 | Phone navigation: search field in the top bar, app-style category list on the Categories tab | checklist |
| 2.2d | `/products/[slug]`: breadcrumb, gallery placeholder, price, details by kind, add-to-cart off until 2.3, metadata; cards become links | tests for the kind-specific details; checklist |
| 2.2f | Home page: banner carousel, category shortcuts, product shelves (new, special offers, supermarket); `GET /banners` and an `onSale` filter in the contract | contract and sample tests; checklist |

## Navigation and home design (owner request 2026-11-13)

The owner wants a large-marketplace layout and menu. We follow the same information design (a search-first header, a category
mega menu, a home page with a banner and shelves) with our own visual identity: the brand colors and logo come from the
backend (see the brand step), and pictures from the backend. Nothing is copied from another site's logo, images or texts.

- **Desktop header, two rows.** Row 1: brand, a wide search bar, the account control (Sign in or the avatar menu), the cart.
  Row 2: a "Categories" button that opens the mega menu, quick links to the four top-level categories and to the special offers.
- **Mega menu.** A list of the top-level categories at the start side; hovering (with a short delay) or focusing one shows its
  sub-categories in columns with a "view all" link. Click and keyboard (arrows, Escape) work too, and on touch screens it opens
  on tap. It reads `GET /categories`.
- **Phones.** The top bar gets the brand and a search field that opens the search page. The Categories tab becomes an
  app-style list with expandable sub-categories instead of cards. The bottom tab bar stays.
- **Home page (2.2f).** A banner carousel (from `GET /banners`; the sample API draws designed banners with text and gradients,
  no photos), a row of category shortcuts, and horizontal product shelves: newest, special offers (products with an old price)
  and supermarket.

## Risks and open questions

- Real images and their host: needed before 2.2d is final (C6).
- Search quality (typos, Persian and Arabic letter variants such as ی and ي, digits) is simple substring matching in the sample;
  the backend decides how the real search works. The front end only passes `q`.
- Stock is a plain `inStock` flag for now; quantities and variants (size, color) are a later contract change.

## Hand-off notes / یادداشت تحویل

### 2.2a – contract and sample catalog (done)

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

### 2.2b – category and list pages (done)

- `/categories`: the four top-level categories as cards with their sub-categories and product counts (static, rebuilt at most
  every five minutes). `/categories/[slug]`: breadcrumb, sub-category chips, product count, sort, a grid of product cards
  (2 columns on phones, up to 4 on desktop) and paging. The categories tab, the header link and the footer link are on.
- `features/catalog/`: `api.ts` (server readers `getStoreCurrency`, `getCategories`, `getProducts`; any failure or a missing API
  becomes `CatalogUnavailableError`, and the pages then show a notice instead of an error page, so a build without an API
  still works), `categories.ts` (tree, path and children from the flat list), `query.ts` (sort and page from the URL, invalid
  values fall back to the defaults), `pricing.ts` (whole-percent discount) and `config.ts`.
- `ProductCard` (server): a neutral placeholder where the picture will go (the first letter of the name), the name, the price in
  the store currency through `createFormatters(...).money` (new server-safe entry `@front-dashboard/ui/format`), the old price and
  the saving, the kind (course or digital) and "out of stock". It is **not a link yet**: `PRODUCT_PAGES_AVAILABLE` in
  `features/catalog/config.ts` is `false` until the product page exists (2.2d), which prevents links to a 404.
- Sort and page live in the URL (`?sort=price_asc&page=2`, defaults left out); changing the sort returns to page 1.
  `SortSelect` and `PageNav` are small client components that use the ui `Select` and `Pagination`.
- Known limit: the page buttons are buttons, not links, so a crawler follows only the first page of a list. Real links can
  replace them if SEO needs it.
- Tests: pricing, URL query parsing and the category tree helpers; the en and fa message parity test covers the new texts.

**Not executed in the authoring sandbox** (no network): install, lint, typecheck, tests, build and the manual checks.

### 2.2c – search (done)

- `/search?q=`: a search field, then the results as the same product grid with the count, sort and paging, or a prompt when there
  is no text, or a no-results box with a link to the categories. The page is `noindex` (results are endless and thin). A page
  past the last one is "not found". With no API it shows the catalog notice.
- `parseSearchQuery` in `features/catalog/query.ts`: trims the text, collapses spaces, cuts it at 100 characters, takes the
  first value of a repeated parameter; sort and page work as on a category page. Changing the sort keeps the text.
- `SearchForm` (client): `type="search"` field with `enterKeyHint="search"`, autofocus on the empty search page; an empty
  submit opens `/search`. `ProductGrid` is shared by the category and search pages.
- The search tab (phones) and the header icon are on. The wide header bar and the phone search field come with 2.2e.
- Search quality is the backend's job; the sample API matches the name and the summary in the page's language (see risks).

**Not executed in the authoring sandbox** (no network): install, lint, typecheck, tests, build and the manual checks.

### 2.2e-1 – desktop header and mega menu (patch delivered, awaiting local verification)

- **Header from `md` up, two rows.** Row 1: brand, the wide search bar (`HeaderSearch`: Enter opens `/search?q=...`), the cart
  icon and the account control. Row 2: the "Categories" button, quick links to the four top-level categories, then language and
  theme. The old row of Home, Categories and Contact links is gone (the brand is Home; Contact stays in the footer and the
  phone drawer). Phones keep their header until 2.2e-2.
- **`MegaMenu`** (client): the top-level categories at the start side, and the sub-categories of the one you point at or focus on
  in three columns with a "view all in ..." link. Opens on mouse hover (120 ms delay, mouse pointers only), on click or tap;
  closes on Escape (focus returns to the button), on a click outside, when focus leaves it, 220 ms after the mouse leaves, and
  after a navigation. It is a disclosure of plain links, not an ARIA menu, so Tab order and screen readers behave normally.
- The categories come from `GET /categories` in the header (a server component; the answer is cached like the other catalog
  reads). If the catalog cannot be read, the menu and the quick links are left out and the rest of the header still works,
  so a build without an API is fine. `toMenuCategories` turns the tree into plain data for the client, with tests.
- No new dependency.

**Not executed in the authoring sandbox** (no network): install, lint, typecheck, tests, build and the manual checks.

---

## خلاصهٔ فارسی

گام ۲.۲ فروشگاه را با محتوای واقعی پر می‌کند: دسته‌بندی‌ها (درختی)، فهرست محصول با مرتب‌سازی و صفحه‌بندی، جستجو و صفحهٔ
محصول. واحد قیمت از بک‌اند می‌آید (`GET /store/settings` و `currency.code`، مثل `IRT` برای تومان)، نه ثابت در کد. چهار دستهٔ اصلی:
کالاهای دیجیتال، کتاب و فرهنگ، دوره‌های آنلاین، و سوپرمارکت و کالاهای خوراکی، هر کدام با زیرمجموعه. محصول سه نوع دارد: فیزیکی،
دیجیتال و دوره. ۲.۲a فقط قرارداد، داده‌های نمونه و مسیرهای API نمونه است؛ صفحه‌ها در ۲.۲b تا ۲.۲d می‌آیند.
