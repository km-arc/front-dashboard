# Visual review: overlays and feedback (1.5a + 1.5b) / بازبینی بصری

Storybook group: Overlays (Dialog, Sheet, Alert, Skeleton, DropdownMenu, Tooltip, Toaster).
Check mode (light, dark) × brand (default, emerald) × locale (en, fa). Use the `OpenByDefault` stories for a quick look.

## Dialog and Sheet
- [ ] Sheet **start** enters from the left edge in en and from the RIGHT edge in fa / از لبهٔ شروع وارد می‌شود
- [ ] Sheet **end** enters from the right edge in en and from the LEFT edge in fa / از لبهٔ پایان وارد می‌شود
- [ ] Sheet exit animation leaves toward the edge it came from; **top** and **bottom** work / خروج به همان لبه
- [ ] All four Sheet stories really differ (if two look identical, a side name is wrong) / چهار سمت متفاوت‌اند
- [ ] Dialog is centered and scrolls inside when tall / وسط‌چین و اسکرول داخلی
- [ ] Backdrop dims the page in light and dark (readable, not washed out) / پس‌زمینه در هر دو حالت درست است
- [ ] Close button is at the end corner (top-left in fa), has a focus ring, and is announced in Persian in fa / دکمهٔ بستن
- [ ] Tab stays inside the open overlay; Escape closes; focus returns to the trigger / فوکوس

## Menus, tooltip, toast
- [ ] DropdownMenu opens aligned to the trigger; check, radio dot and shortcut sit on the correct sides in fa / هم‌ترازی و نشانگرها
- [ ] Sub-menu arrow points toward the sub-menu in both directions and the sub-menu opens on the correct side / فلش و سمت زیرمنو
- [ ] Tooltip is readable, positioned by the trigger, and uses the page direction / جهت Tooltip
- [ ] Toaster: toast at bottom center, text aligned to the reading direction, close button on the end side / جای دکمهٔ بستن
- [ ] Toast colors follow the theme (light, dark, brand) / رنگ‌ها با تم عوض می‌شوند

## Alert and Skeleton
- [ ] Alert variants are distinct (border/tint) and text is readable; success/warning render only if they exist / وضوح و کنتراست
- [ ] Skeleton pulses; with "reduce motion" enabled in the OS it does not / با کاهش حرکت نمی‌تپد
- [ ] Accessibility panel: no violations on any open overlay / پنل Accessibility

Reviewer: ______  Date: ______  Result: ☐ approved ☐ needs fixes
Findings / یافته‌ها:
