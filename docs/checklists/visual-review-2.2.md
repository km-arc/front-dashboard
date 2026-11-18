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

2.2e-1: desktop header and mega menu (width 1024 and up)
- [ ] Two rows: brand, a wide search bar, the cart and the account; below it the Categories button, four quick links, language and theme
- [ ] Pointing at Categories opens the large panel after a short delay; pointing at another top-level category swaps the sub-categories at once
- [ ] Moving the mouse out closes it a moment later; moving across the gap between the button and the panel does not close it
- [ ] Click toggles it; Escape closes it and returns focus to the button; clicking outside closes it; Tab out of it closes it
- [ ] Tab walks the top-level list, then the sub-categories; arrows are not needed because they are plain links
- [ ] A sub-category link opens its page and the panel closes; "View all in ..." opens the top-level category
- [ ] Typing in the search bar and pressing Enter opens `/search?q=...`
- [ ] In fa the layout mirrors (list on the right, panel text right to left, chevrons turn); light and dark look right
- [ ] With the sample API off the menu and quick links are missing but the search bar, cart and account still work
- [ ] Phones are unchanged: menu button, brand and the bottom tab bar

2.2e-2: phone navigation (360px)
- [ ] The top bar is one row: menu button, brand and a round search field with the placeholder text; nothing wraps, even with the longer Persian brand name
- [ ] Tapping the search field opens `/search` with the keyboard ready; from 768px the field is gone and the wide bar shows
- [ ] The Categories tab opens a list of four rows with counts; tapping a row opens it to "View all in ..." and its sub-categories; opening another row closes the first
- [ ] A sub-category row opens its page; the chevron turns when a row is open; it mirrors correctly in fa
- [ ] From 768px `/categories` shows the cards again, not the list
- [ ] Rows are at least 44px high; the list works with the keyboard (Tab, Enter or Space opens a row)

Sign-off: Reviewer ____________  Date ____________
After sign-off set the step to `done` in docs/ROADMAP.md.
