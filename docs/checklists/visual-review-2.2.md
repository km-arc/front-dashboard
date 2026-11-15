# Visual review: Step 2.2 (catalog)

Needs `NEXT_PUBLIC_API_MOCKING=enabled` in `apps/store/.env.local` (sample catalog: 15 products, Toman prices).
Check `/fa` and `/en`, 360px and desktop, light and dark.

2.2b: categories and lists
- [ ] The Categories tab (phones), the header link and the footer link open `/categories`
- [ ] `/categories` shows four cards: Digital goods, Books and culture, Online courses, Supermarket and food, each with its sub-categories and counts (Persian digits in fa)
- [ ] A category page shows the breadcrumb, the sub-category chips (on a top-level category), the count, the sort and a grid of cards (2 columns at 360px)
- [ ] Prices read like `۱۸۵٬۰۰۰ تومان` in fa and `185,000 Toman` in en; discounted products show the old price crossed out and a "17% off" badge
- [ ] "Home Cooking" shows "Out of stock"; courses show "Course", digital products "Digital"
- [ ] Sorting by price changes the order and the URL (`?sort=price_asc`) and the sort survives a reload; changing the sort returns to page 1
- [ ] `/categories/online-courses` lists the four courses (the products of its sub-categories); `/categories/programming` lists two
- [ ] `/categories/books-culture?page=2` is a "not found" page, and `/categories/nope` too
- [ ] The cards are not links yet (no hover border, nothing opens) until the product page exists
- [ ] The breadcrumb and chips read well in right-to-left; the touch targets are at least 44px
- [ ] With the sample API off, `/categories` shows the "catalog is not available" notice instead of an error page

2.2c: search
- [ ] The Search tab (phones) and the header icon open `/search` with the field focused
- [ ] `/fa/search?q=دفترچه` shows one result (the A5 notebook); `/en/search?q=tea` shows the green tea
- [ ] Typing a word and pressing Enter (or the button) shows the results and puts the word in the address
- [ ] Sorting keeps the search text and returns to page 1
- [ ] `/en/search?q=zzzz` shows the no-results box with the link to the categories
- [ ] `/en/search` without text shows the prompt; the text field does not zoom on iOS
- [ ] The tab title says "Results for ..." and the page is `noindex` (view source: `robots`)

Sign-off: Reviewer ____________  Date ____________
After sign-off set the step to `done` in docs/ROADMAP.md.
