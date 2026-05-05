# REQUIREMENTS.md

**TasteXXSee — Website Requirements (v1.2)**
*Updates v1.1 with the real menu (per `MENU_DATA.md`) and the Founder page.*

---

## 1. Project overview

TasteXXSee is a single restaurant in Ghana serving Ghanaian local plates (Plain Rice, Banku, Yam Chips) alongside Asian-influenced rice and noodle dishes (Thai Fried Rice, Spicy Jollof Rice, assorted Noodles). On top of the everyday menu, the restaurant offers a **boutique catering** service.

The website has four jobs:

1. **Showcase** the restaurant and its menu.
2. **Take online orders** for delivery or pickup, with no customer accounts.
3. **Promote and capture leads** for the boutique catering service.
4. **Tell the founder's story** — the client wants his face and his story prominent on the site.

A private admin login lets the owner view and manage incoming orders and catering inquiries.

---

## 2. Storefront pages

All public pages share a global header (logo, navigation, cart icon with item count) and footer (address, hours, social, fine print). Header sticky on scroll; goes from transparent to solid ink with a hairline gold divider after ~80px scroll.

**Navigation order:** Home · Menu · Catering · Founder · About · Contact

### 2.1 Home page

- **Hero**: Full-viewport. Restaurant name in large display serif. Tagline: *"Local roots. Global plates."* Single primary CTA "Order Now" → /menu. Secondary text link "Explore Catering →" → /catering. Subtle grain texture over a dark hero image. Numbered marker "01 / WELCOME" in the corner.
- **Intro paragraph**: One refined paragraph about TasteXXSee — comfort food done with care, where local meets international.
- **Featured dishes**: 3 dishes (one local, one Asian-influenced, one crowd-pleaser — see `MENU_DATA.md` §4 for picks). Each card: photo, name, category eyebrow, price (or "from GHS X" for sized/range items). Hover reveals a thin gold border and an "Add to order" affordance.
- **Catering highlight band**: Full-width section that is *visually distinct* from the rest of the page (slightly lighter ink background, larger type, gold accents). Two service cards side-by-side: Private Chef Hire / Custom Diet Catering. CTA: "Inquire about catering →" → /catering.
- **Founder teaser**: A short editorial-style block — large portrait of the founder on the left (4:5 aspect), a short pull-quote on the right ("Every plate that leaves my kitchen is one I'd serve at my own table." — placeholder until the client provides one), and a "Meet the founder →" link to /founder.
- **Closing CTA**: "Reserve your seat at the table. Order now or plan your event."

### 2.2 Menu page

The menu is organized into **five tabs**: Rice · Banku · Yam Chips · Noodles · Extras. (The Rice tab contains three sub-sections: Plain Rice, Thai Fried Rice, Spicy Jollof Rice — all on the same tab, with sub-headings.)

- **Tabs**: Active tab styled with a sliding gold underline. Tab change animated (cross-fade).
- **Optional search bar**: filters dishes within the active tab by name.
- **Dish cards** show photo, name, short description, and a price block whose layout depends on the pricing model (see `MENU_DATA.md` §2):
  - **Single price** → "GHS 30.00" + "Add to order" button.
  - **Range price** → two chip buttons ("Small — GHS 65" / "Large — GHS 85"); user picks a chip and the button activates as "Add to order".
  - **Sized price** → four chip buttons (Regular / Medium / Large / Family) showing each size's price; user picks a size and the button activates.
- **Cart drawer**: slides in from the right when an item is added or the cart icon is clicked. Shows line items (with the variant suffix on the name, e.g. "Thai Fried Rice with Beef – Family") with qty + / – / remove, running total, and a "Place order" button. Empty-cart state with elegant copy.

### 2.3 Catering page (FEATURED OFFERING)

A standalone page dedicated to the boutique catering service. Should feel like the most premium page on the site.

- **Hero band**: "Boutique Catering" in display serif. One-line statement of intent: "Restaurant-quality, brought to your table."
- **Two service tiers**, presented as full-width alternating sections (image-left/text-right, then text-left/image-right):

  **Tier 1 — Private Chef Hire**
  - What it is: A chef from TasteXXSee comes to the customer's home or venue to prepare and serve the meal on-site.
  - Includes: chef + sous if needed, all cookware, ingredients, plating.
  - Use cases: dinner parties, anniversaries, private events.
  - "Start an inquiry" CTA → `#inquire?tier=private-chef`.

  **Tier 2 — Custom Diet Catering**
  - What it is: a bespoke menu built around the customer's dietary needs/preferences.
  - Diet options to surface (with chips/pills): Keto · Halal · Vegan · Vegetarian · Gluten-free · Diabetic-friendly · Low-sodium · Pescatarian · Other.
  - Delivered to the customer's location at an agreed time.
  - "Start an inquiry" CTA → `#inquire?tier=custom-diet`.

- **How it works**: a 4-step horizontal stepper:
  1. Send inquiry
  2. We call you back to design the menu
  3. Confirm and pay deposit
  4. Enjoy the experience

- **Catering inquiry form** (lives at the bottom of the page, anchor `#inquire`):
  Fields: full name · phone · email · service tier (Private Chef / Custom Diet) · event date · number of guests · diet preferences (multi-select chips, only if Custom Diet selected) · location (city/area) · brief message.
  Submit → simple confirmation screen + admin sees it in the dashboard.

- **Trust band**: 3 short quotes/testimonials. Placeholder copy in Phase 1; real ones added later.

### 2.4 Founder page (NEW)

A dedicated profile page for the restaurant's founder/chef. The client specifically wants his face on the site, so this page treats him like the editorial subject of a magazine feature — not a generic "Meet the team" card.

- **Hero**: Full-viewport editorial layout. Large portrait (4:5 aspect, dark moody lighting if available) on the right, takes up about 50% of the viewport. Left side: eyebrow "THE FOUNDER", his name in display serif at Display L size, a one-line role descriptor in italic ("Chef · Owner · Host"). Subtle grain texture over the page.
- **Story section**: An editorial-style article. Three to five paragraphs covering his background, why he opened TasteXXSee, his philosophy. Body copy is wider than usual (max 65ch) for readability. A pull-quote breaks the article in half — large display italic with gold em-dashes around it.
- **Signature dishes**: A small gallery of 3–4 dishes the founder personally signs off on. Each thumbnail clickable → links to that dish on the menu page.
- **Behind-the-scenes gallery** (optional, only if client provides photos): 4–6 candid shots of him in the kitchen, with the same dark editorial treatment.
- **Closing CTA**: "Eat his food, hire him for your event, or just say hi." Three small ghost links: Order Now → /menu · Hire him → /catering · Visit us → /contact.

**Phase 1 placeholder rule**: Until the client provides his portrait and bio, use a tasteful silhouette placeholder and lorem-style filler that the developer clearly marks as `TODO: replace with client copy`. The page must not go to production with placeholder content in this section.

### 2.5 About page

- Short story about TasteXXSee — origin, philosophy, why local + international under one roof.
- A short paragraph for each menu pillar (Local plates / International rice & noodles / Catering) explaining what each part of the menu represents.
- A small photo grid (4–6 images) of the food/space. Lazy-loaded.

### 2.6 Contact page

- Address (full street address)
- Phone — `tel:` link, click-to-call on mobile
- Email — `mailto:` link
- Opening hours, day-by-day, in a clean two-column table
- Embedded Google Map of the location (iframe — no API key needed)
- A short-form contact message box (name, email, message) — Phase 1 just stores submission to admin (or sends to email — see `ARCHITECTURE.md`)

---

## 3. Online ordering flow

No customer accounts. The flow is intentionally short.

### 3.1 Add to cart
- "Add to order" on a dish card → item added to cart context, cart drawer slides in.
- For range and sized items, the user must pick a variant before the button activates.
- Drawer shows: thumbnail, name (with variant suffix where applicable), qty controls (`–` / number / `+`), per-line subtotal, remove (×).
- Running total is always visible at the bottom of the drawer.

### 3.2 Checkout
On clicking "Place order" the drawer transitions to a checkout view (or routes to `/checkout`). Fields:
- Full name *(required)*
- Phone number *(required, validated as Ghana format e.g. +233 / 0XX...)*
- Order type: **Delivery** or **Pickup** (radio)
- If Delivery → delivery address *(required)*
- Payment method: **Cash on Delivery** or **Mobile Money** (radio)
- If Mobile Money → MoMo number + provider (MTN / Vodafone / AirtelTigo) — admin reconciles manually
- Optional notes ("ring the bell", "no chili", etc.)
- Order summary on the side, fixed on desktop, collapsed on mobile

"Confirm order" → submits → shows confirmation screen.

### 3.3 Confirmation
- Reference number (format: `TXS-YYYYMMDD-XXXX`)
- Order summary
- Reassurance line: *"We've received your order. The restaurant will call you within 10 minutes to confirm. Estimated delivery: 30–45 minutes."*
- "Place another order" link → /menu

---

## 4. Admin

No public account system. One private admin login that isn't linked from the public navigation.

### 4.1 Admin login
- Route: `/admin/login` (not in any sitemap or header)
- Username + password
- Phase 1: env-based credentials, JWT in httpOnly cookie. See `ARCHITECTURE.md`.

### 4.2 Admin dashboard (`/admin/dashboard`)
- Two tabs: **Orders** · **Catering Inquiries**
- **Orders tab**: list, most recent first. Each row: ref number, time, customer name, total GHS, status pill, expand for details.
  - Status options: Received → Preparing → Ready → Completed (sequential pills, click to advance)
  - Filters: status, date
- **Catering Inquiries tab**: list of catering form submissions. Each row: time, name, tier (Chef / Custom Diet), event date, guests, view details.
- Logout in the top-right.

### 4.3 Admin scope limits
- No menu editing in Phase 1. Menu changes go through the developer (edit `lib/menu-data.ts`).
- No analytics, no exports — Phase 2.

---

## 5. Out of scope (Phase 1)

To stay within the GHS 1,000 budget:

- Customer accounts / login
- Customer-facing order tracking page (admin calls customer instead)
- Online card payment
- Admin menu editor
- Promotions / discount codes
- SMS / email automated notifications
- Multi-language
- Reservations system

---

## 6. Page summary

| Page | Path | Audience | Purpose |
|---|---|---|---|
| Home | `/` | Public | Welcome, featured dishes, catering highlight, founder teaser |
| Menu | `/menu` | Public | Browse & order |
| Catering | `/catering` | Public | Showcase + capture inquiries (FEATURED) |
| Founder | `/founder` | Public | Founder portrait, story, philosophy (NEW) |
| About | `/about` | Public | Restaurant story + menu pillars |
| Contact | `/contact` | Public | Address, hours, map, form |
| Cart / Checkout | `/checkout` | Public | Complete order |
| Order confirmation | `/order-confirmation/[ref]` | Public | Order received |
| Admin login | `/admin/login` | Admin only | Private login |
| Admin dashboard | `/admin/dashboard` | Admin only | View & manage orders + inquiries |

---

## 7. Acceptance criteria

The site is "done" for Phase 1 when:
- All pages render correctly on desktop, tablet, and mobile (tested at 360px, 768px, 1280px, 1920px)
- A customer can complete an order end-to-end (including a sized-variant item) and see the confirmation
- A customer can submit a catering inquiry and see confirmation
- An admin can log in, see the order, and advance its status
- An admin can see the catering inquiry
- The Founder page has the client's actual portrait and bio in place — not the placeholder
- Lighthouse: ≥ 90 Performance, ≥ 95 Accessibility, ≥ 95 Best Practices on the home page
- All copy is the agreed copy (no Lorem Ipsum left behind)
