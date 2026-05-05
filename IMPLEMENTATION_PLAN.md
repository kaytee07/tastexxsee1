# IMPLEMENTATION_PLAN.md

Build the project in **eight phases**. Each phase is a self-contained chunk that ends in a working, demoable state. Don't skip ahead — the design system and layout earn their keep when the page-building phases get fast.

At the end of each phase: run `npm run dev`, confirm it works, commit with the listed message.

---

## Phase 0 — Project initialization

**Goal:** A clean Next.js + TypeScript + Tailwind app boots locally on `http://localhost:3000`.

Tasks:
1. `npx create-next-app@latest tastexxsee --typescript --tailwind --app --no-src-dir --import-alias "@/*"`. Decline ESLint customizations.
2. Install deps:
   ```
   npm i framer-motion lucide-react clsx tailwind-merge
   ```
3. Drop the six spec docs at the repo root: `CLAUDE.md`, `REQUIREMENTS.md`, `DESIGN_SYSTEM.md`, `ARCHITECTURE.md`, `IMPLEMENTATION_PLAN.md`, `MENU_DATA.md`.
4. Replace `tailwind.config.ts` with the design tokens from `DESIGN_SYSTEM.md` §1 + the keyframes block.
5. Replace `app/globals.css` with: Tailwind directives, the `:root` CSS vars, body styles, custom scrollbar, `::selection`.
6. Add the two Google Fonts (Cormorant Garamond + Jost) via `next/font/google` in `app/layout.tsx`. Expose them as CSS variables `--font-cormorant`, `--font-jost`.
7. `.env.local.example` with placeholders for `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `DATABASE_URL`.
8. `.gitignore` should already cover `.env.local`. Verify.
9. Replace `app/page.tsx` with a placeholder that proves fonts work — Cormorant heading, Jost body, both on ink with cream.

**Done when:** the placeholder page shows the fonts loading correctly with the right colors. Commit: `chore: bootstrap project`.

---

## Phase 1 — Design system primitives

**Goal:** The reusable visual building blocks exist in `components/ui/` and `lib/motion.ts`.

Tasks:
1. `lib/motion.ts` — export `fadeUp`, `stagger`, `drawLine`, plus `viewportOnce = { once: true, margin: '-100px' }`.
2. `lib/format.ts` — `formatGhs(n: number)` returns `"GHS 45.00"`. `generateRef()` returns `TXS-YYYYMMDD-XXXX`. `formatPhone(s)` normalizes Ghana phone formats. `formatPriceForCard(price: Price)` returns the right display string for each pricing model (e.g. `"GHS 30.00"` for single, `"From GHS 50"` for range, `"From GHS 40"` for sized).
3. `lib/utils.ts` — a `cn()` helper (clsx + tailwind-merge).
4. `lib/menu-helpers.ts` — `resolveLine(line, items)` per `ARCHITECTURE.md` §6, plus `findItem(id, items)` and `getVariantPrice(item, variantKey)`.
5. `components/ui/Button.tsx` — Primary, Secondary, Ghost variants. Props: `variant`, `href`, `onClick`, `children`, `className`, `disabled`.
6. `components/ui/Eyebrow.tsx` — small uppercase ultra-tracked gold label.
7. `components/ui/SectionMarker.tsx` — `<SectionMarker number="01" label="WELCOME" />`.
8. `components/ui/Divider.tsx` — gold hairline. Variants: full-width and short-50px.
9. `components/ui/Input.tsx` — bottom-border input with floating eyebrow label, focus state.

Build a temporary `app/styleguide/page.tsx` that renders one of each, plus example renderings of all three pricing models. Ship it un-linked.

**Done when:** the styleguide page shows every primitive looking the way `DESIGN_SYSTEM.md` describes. Commit: `feat: design system primitives`.

---

## Phase 2 — Layout shell (Header, Footer, fonts in place)

**Goal:** Navigate between empty stub pages with a sticky header and proper footer.

Tasks:
1. `components/layout/Header.tsx` — logo (Cormorant wordmark "TasteXXSee"), nav (Home / Menu / Catering / Founder / About / Contact), cart icon with count badge. Sticky behaviour: transparent over hero, ink/95 + backdrop-blur after 80px scroll, with gold-700 hairline bottom border. Use Framer Motion's `useScroll`.
2. `components/layout/Footer.tsx` — three columns on desktop (address / hours / social), one column on mobile. Gold hairline at top.
3. `components/layout/PageWrapper.tsx` — wraps page content with consistent horizontal padding, max-width.
4. Stub each route: `app/menu/page.tsx`, `app/catering/page.tsx`, `app/founder/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`. Each just a heading.
5. Wire `Header` and `Footer` into `app/layout.tsx`.
6. Add empty `CartProvider` to `app/layout.tsx` (just the shell — full logic in Phase 4).

**Done when:** every nav link routes to a stub, header behaviour is right on scroll, footer is properly styled, mobile menu works (off-canvas slide from right). Commit: `feat: layout shell`.

---

## Phase 3 — Home page

**Goal:** The home page renders all five sections, animated on scroll.

First, populate `lib/menu-data.ts` from `MENU_DATA.md`. **All ~22 items, all variants and prices.** Mark three as `featured: true` per §4 of `MENU_DATA.md`.

Then build (top of page down):
1. **`Hero.tsx`** — full-viewport, "01 / WELCOME" marker, headline "Local roots. *Global plates.*" (italic on "Global plates."), tagline, primary CTA "Order Now" → /menu, ghost link "Explore Catering →" → /catering. Hero background image with `from-ink/60` gradient overlay. Stagger the entrance: marker → headline (split words, delay 100ms each) → tagline → CTA.
2. **`FeaturedDishes.tsx`** — "02 / FROM THE KITCHEN" marker, h2 "Three plates we'd put our name on", three dish cards (image / category eyebrow / name / one-line description / price). Use `formatPriceForCard(price)` for the price string. On scroll-in: fade up with stagger.
3. **`CateringHighlight.tsx`** — *the standout section*. Lighter ink-800 background, full-width band. h2 "Boutique Catering" with eyebrow "03 / NOW OFFERING". Two side-by-side cards (Private Chef Hire / Custom Diet Catering). Below: ghost link "Inquire about catering →" → /catering. Animate: fade up the section, then `drawLine` on a horizontal gold rule between heading and cards.
4. **`FounderTeaser.tsx`** *(NEW)* — eyebrow "04 / THE FOUNDER", a two-column section: portrait left (4:5 aspect, placeholder for now), pull-quote and short blurb on the right with a "Meet the founder →" link to /founder. On scroll-in: portrait fades in, quote draws in word by word.
5. **`ClosingCta.tsx`** — minimal section, ink background, centered: "Reserve your seat at the table." with two buttons side-by-side (Primary "Order now" and Secondary "Plan an event").

Note: the cuisine triptych from earlier drafts is removed — the menu shape doesn't fit a triptych. The Founder teaser takes its slot.

**Done when:** scrolling the home page is choreographed and elegant. Commit: `feat: home page`.

---

## Phase 4 — Menu page + cart

**Goal:** Full ordering flow up to the checkout form (not the submit). Cart persists across refresh. **All three pricing models work.**

Tasks:
1. **Cart state** — implement `lib/cart-context.tsx` per `ARCHITECTURE.md` §6. `useReducer` for the lines array. Cart line uniqueness key is `(itemId, variantKey)`. localStorage persistence with debounced write.
2. **`MenuPage`** — read `?tab` query param to set initial active tab.
3. **`MenuTabs.tsx`** — five tabs (Rice · Banku · Yam Chips · Noodles · Extras) with animated gold underline that slides between active tabs (Framer Motion `layoutId`). Inside the Rice tab, render three sub-headings (Plain Rice / Thai Fried Rice / Spicy Jollof Rice).
4. **`SearchBar.tsx`** — tiny input, filters dishes within active tab by name match.
5. **`PriceVariantPicker.tsx`** *(NEW — the heart of the new menu)* — given an item's `price`, renders the right control:
   - `single` → just the price text, no picker.
   - `range` → two chip buttons: "Small — GHS X" and "Large — GHS Y". User selects one.
   - `sized` → four chip buttons: Regular / Medium / Large / Family with prices. User selects one.
   Component lifts the chosen variantKey via an `onChange` prop.
6. **`DishCard.tsx`** — image (4:5), eyebrow category label, name, description, `<PriceVariantPicker />`, "Add to order" button. Button is disabled until a variant is selected (for range/sized items); enabled immediately for single-priced items. On click: `cart.add(itemId, variantKey)`, drawer auto-opens.
7. **`CartDrawer.tsx`** — fixed right-side panel, slide in 400ms, ink-800 background. Header "YOUR ORDER" + close icon. Lines: thumbnail / name with variant suffix / qty controls / line total / remove. Empty state copy. Footer: subtotal + "Place order" button → `/checkout`.
8. **`CartButton.tsx`** in the header — opens drawer, badge shows `itemCount`. Animate badge on count change.

**Done when:** add/remove/quantity all work for all three pricing models, the same item in two different sizes shows as two separate cart lines, cart persists across refresh, drawer behaves right on mobile (full-screen slide-up below 768px). Commit: `feat: menu and cart`.

---

## Phase 5 — Catering page (THE FEATURE)

**Goal:** A standalone page that feels like the most premium thing on the site, plus a working inquiry submission to localStorage (will swap to API in Phase 7).

Tasks:
1. **Catering hero** — full-viewport. Eyebrow "BOUTIQUE CATERING". Headline "Restaurant-quality, brought to your table." Background: chef-at-work image with dark overlay. Single primary CTA "Start an inquiry →" anchors to `#inquire`.
2. **Tier 1 — Private Chef Hire**: image-left/text-right, asymmetric (image breaks out by 80px on the left). Eyebrow "TIER ONE". h2. 2-paragraph copy. Bullet list of inclusions. Ghost link "Start an inquiry →" → `#inquire?tier=private-chef`.
3. **Tier 2 — Custom Diet Catering**: text-left/image-right, mirrored asymmetry. Eyebrow "TIER TWO". h2. 2-paragraph copy. **Diet chips display** — every `DietPreference` as a static gold-bordered chip. Ghost link "Start an inquiry →" → `#inquire?tier=custom-diet`.
4. **`HowItWorks.tsx`** — 4-step horizontal stepper. Each step: gold numeral, short label. Connect them with a hairline gold line on desktop; stack vertically on mobile.
5. **Trust band** — three placeholder testimonials.
6. **`InquiryForm.tsx`** at `#inquire`:
   - Reads `?tier=` query string to preselect the tier radio.
   - Fields per `REQUIREMENTS.md` §2.3.
   - Diet chips become interactive (multi-select) when tier = Custom Diet.
   - Validation per `ARCHITECTURE.md` §8.
   - On submit: write to `localStorage` (`txs-catering-pending`) and show the success state. Real API call lands in Phase 7.
7. **Success state** — replaces the form: "We've received your inquiry. The TasteXXSee team will call you within 24 hours."

**Done when:** the catering page feels like the strongest page on the site, the form validates and submits cleanly. Commit: `feat: catering page`.

---

## Phase 6 — Founder + About + Contact

**Goal:** The remaining three public pages. Founder is the headline, the others round out the site.

### 6a. Founder page (`/founder`)

Tasks:
1. **`FounderHero.tsx`** — split layout 50/50 on desktop (stacks on mobile). Right: portrait, full-bleed within its half, 4:5 aspect. Left: eyebrow "THE FOUNDER", his name in Display L Cormorant, italic role line "Chef · Owner · Host". Below the role line, a thin gold hairline. Subtle grain texture overlay. **Use a tasteful silhouette placeholder until the client provides a portrait** — mark with `// TODO replace with client portrait`.
2. **`StoryArticle.tsx`** — single-column article, max-width 65ch, Body L size with generous leading. 3–5 paragraphs. **Placeholder copy clearly marked `TODO: replace with client copy` until client delivers** — do not ship to production with placeholder.
3. **`PullQuote.tsx`** — breaks the article in half. Display M Cormorant italic, gold em-dashes wrapping the quote, attribution underneath in eyebrow style.
4. **`SignatureDishes.tsx`** — 3–4 thumbnail images of dishes the founder selects. Each clickable → links to that dish on the menu page (deep-link with anchor or query). Uses `lib/menu-data.ts` so it's not hardcoded twice.
5. **Closing block** — three small ghost links side-by-side: "Order Now →" /menu, "Hire him →" /catering, "Visit us →" /contact.
6. Animation: Founder hero fades in (portrait first, text after). Article body fades up paragraph-by-paragraph as the user scrolls. Pull-quote does a `drawLine` reveal on its surrounding em-dashes.
7. SEO: `metadata` with title "The Founder — TasteXXSee" and description set up for sharing once the real portrait is in place.

### 6b. About page (`/about`)

Tasks:
1. Hero band — "Three traditions, one obsession with the table." (or copy the client provides).
2. Origin paragraph.
3. Three short cuisine-pillar blocks: **Local plates** / **International rice & noodles** / **Catering**, each ~100 words.
4. Photo grid (`grid-cols-2 md:grid-cols-3` with mixed aspect ratios). Lazy-loaded via `next/image`.

### 6c. Contact page (`/contact`)

Tasks:
1. Split layout — left: address, phone (`tel:` link), email (`mailto:` link), opening hours table. Right: embedded Google Maps iframe (16:9, 1px gold-700 border).
2. Below: short message form (name / email / message). Phase 1 uses `mailto:` fallback. (Real form-to-email is a Phase 2 add — note for client.)

All three pages use the same scroll-in animation choreography as Home.

**Done when:** all three pages styled and responsive; Founder page placeholders are clearly marked TODO. Commit: `feat: founder, about, contact`.

---

## Phase 7 — Backend (API routes + DB) + checkout submit

**Goal:** Orders and catering inquiries actually persist. Customer flow ends at the order confirmation screen.

Tasks:
1. Set up **Neon Postgres** (free tier) → grab `DATABASE_URL` → put in `.env.local`.
2. `npm i -D prisma && npm i @prisma/client && npx prisma init`.
3. Drop in the schema from `ARCHITECTURE.md` §5. Run `npx prisma migrate dev --name init`.
4. `lib/db.ts` — Prisma client singleton.
5. `app/api/orders/route.ts` — POST creates Order (generate ref via `generateRef()`, validate body), GET lists orders. `// TODO auth` on GET.
6. `app/api/orders/[id]/route.ts` — PATCH updates status. `// TODO auth`.
7. `app/api/catering/route.ts` — POST creates inquiry, GET lists. `// TODO auth` on GET.
8. **Checkout page** — full form per `REQUIREMENTS.md` §3.2. On submit: POST `/api/orders` with the resolved cart lines (snapshot of name + unitPrice + qty). On success: `cart.clear()` and route to `/order-confirmation/[ref]`.
9. **Order confirmation page** — server component, fetches by ref, renders summary + reassurance copy + "Place another order" link.
10. **Catering inquiry submit** — replace the localStorage stub from Phase 5 with a real POST to `/api/catering`.

**Done when:** an order placed end-to-end (including a sized variant like Thai Fried Rice – Family) shows up in the DB with all line details, the confirmation page renders with a real ref. Same for a catering inquiry. Commit: `feat: backend + checkout submit`.

---

## Phase 8 — Admin + auth + polish

**Goal:** The owner can log in, see orders, advance their statuses, and read catering inquiries. Final polish across everything.

Tasks:
1. `npm i next-auth@beta`.
2. `lib/auth.ts` + `app/api/auth/[...nextauth]/route.ts` — Credentials provider, env-based username + bcrypt-hashed password. JWT session strategy.
3. `app/admin/login/page.tsx` — minimal styled login form. Single error state for bad credentials.
4. `app/admin/layout.tsx` — server component, calls `auth()`, redirects to login if no session. Renders `AdminShell` with sidebar (Orders / Catering Inquiries) and logout in top-right.
5. `app/admin/dashboard/page.tsx` — two tabs (Orders / Catering Inquiries) with the data lists per `REQUIREMENTS.md` §4.2.
6. `OrderRow.tsx` + `OrderDetail.tsx` — expandable rows. Order detail must show variant info from each line (so the kitchen sees "Thai Fried Rice with Beef – Large × 2", not just "Thai Fried Rice × 2").
7. `StatusPills.tsx` — Received → Preparing → Ready → Completed. Active pill is gold-filled, others are gold-outlined. Click a future pill to advance.
8. `InquiryRow.tsx` — list view + detail panel for catering inquiries.
9. **Lock down API routes** — replace each `// TODO auth` with `auth()` checks. POSTs from public forms remain open; GETs and PATCHes are session-only.
10. **Polish pass** — page by page with the spec open: copy, spacing, animation timing, mobile breakpoints, image alts, focus states, reduced-motion fallbacks.
11. **SEO + meta** — `metadata` export on each page, `app/sitemap.ts`, `app/robots.ts` (Disallow `/admin/*`), `og-default.jpg` in `/public`. Founder page gets its own OG image once the portrait is in.
12. **Accessibility audit** — keyboard nav, screen reader labels on icon-only buttons (cart icon, qty +/-, variant chips), color contrast.
13. **Performance audit** — Lighthouse on home + menu + catering + founder. Target ≥ 90 / 95 / 95.
14. Strip the `/styleguide` route or hide it behind an env flag.
15. Update `README.md` with run instructions, env setup, deploy notes.

**Done when:** acceptance criteria from `REQUIREMENTS.md` §7 are met. Commit: `feat: admin + final polish`. Tag `v1.0`.

---

## After Phase 8 — handoff checklist

Before sending it to the client:

- [ ] All placeholder copy replaced with the agreed final copy
- [ ] **Founder portrait + bio in place** — the page ships with a TODO marker until this happens
- [ ] All Unsplash placeholder images replaced (or formally approved as launch placeholders)
- [ ] Real menu items confirmed (no typos, currency confirmed as GHS or GHC)
- [ ] Three featured dishes confirmed with the client
- [ ] Admin credentials chosen (give the client the username; they pick the password; you hash it)
- [ ] Domain pointed to Vercel
- [ ] Google Business profile linked from the contact page
- [ ] Client trained: how to read orders, advance statuses, read catering inquiries

---

## Backlog (not part of v1.0 — capture for later)

- SMS notification to admin on new order (Termii / Hubtel for Ghana)
- Customer-facing order tracking page
- Online card payment (Paystack)
- Admin menu editor (CRUD)
- Promo codes
- Multi-language (English / French)
- Reservations system
- Customer reviews on dishes
- Loyalty program
- Founder page video intro (15s loop on the hero)
