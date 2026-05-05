# ARCHITECTURE.md

How the project is wired together. File structure, routes, data shapes, state, and the deferred decisions.

---

## 1. Stack & rationale

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | SEO matters for a restaurant; App Router lets us mix server and client components cleanly |
| Language | TypeScript (strict) | Catches the dumb bugs early; the order data shape benefits from it |
| Styling | Tailwind CSS | Fast, already used by Claude Code conventions, easy to enforce design tokens |
| Animation | Framer Motion | Best-in-class declarative motion for React |
| Icons | Lucide React | Clean, consistent stroke icons that match the editorial aesthetic |
| Cart state | React Context + `useReducer` | The cart is small enough that Redux/Zustand is overkill |
| Cart persistence | `localStorage` via a context effect | No accounts → must persist locally so refresh doesn't kill the cart |
| Form state | Plain React state, or `react-hook-form` if forms grow | Keep it simple in Phase 1 |
| Menu data | TypeScript file `lib/menu-data.ts` | Phase 1 has no DB; menu changes ship via dev. See `MENU_DATA.md` for source data |
| Order persistence | API route → Postgres on Neon free tier via Prisma | See decision below |
| Catering inquiries | Same as orders | Same store |
| Auth (admin) | NextAuth Credentials provider with env-based username/password | Lightweight; one user only |
| Hosting | Vercel | Free tier covers this; matches Next.js perfectly |

### Order persistence decision

For the budget (GHS 1,000) and the scope (one restaurant, low volume), three viable options. **Recommend Option B for Phase 1.**

- **A. JSON file in repo** — too brittle, breaks on Vercel's read-only filesystem.
- **B. SQLite/Postgres on Neon free tier with Prisma** — small, free, reliable, easy migration. ✅ Recommended.
- **C. Supabase** — overkill for the scope, but a fine choice if the client wants to self-serve later.

If Claude Code is uncertain at start of Phase 4, default to Option B with a single Postgres on Neon (free tier). Schema in §5.

---

## 2. File structure

```
tastexxsee/
├── README.md
├── CLAUDE.md
├── REQUIREMENTS.md
├── DESIGN_SYSTEM.md
├── ARCHITECTURE.md
├── IMPLEMENTATION_PLAN.md
├── MENU_DATA.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── postcss.config.js
├── .env.local.example
├── .gitignore
├── prisma/
│   └── schema.prisma
├── public/
│   ├── images/
│   │   ├── menu/                   ← dish photos, named by item id
│   │   └── founder/                ← portrait + behind-the-scenes
│   └── og-default.jpg
├── app/
│   ├── layout.tsx                  ← root layout, fonts, providers
│   ├── globals.css
│   ├── page.tsx                    ← home
│   ├── menu/page.tsx
│   ├── catering/page.tsx
│   ├── founder/page.tsx            ← NEW
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── checkout/page.tsx
│   ├── order-confirmation/[ref]/page.tsx
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   └── layout.tsx              ← admin shell, guards auth
│   └── api/
│       ├── orders/
│       │   ├── route.ts            ← POST create / GET list (admin)
│       │   └── [id]/route.ts       ← PATCH status
│       ├── catering/route.ts       ← POST inquiry / GET list (admin)
│       └── auth/[...nextauth]/route.ts
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── PageWrapper.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── FeaturedDishes.tsx
│   │   ├── CateringHighlight.tsx
│   │   ├── FounderTeaser.tsx       ← NEW
│   │   └── ClosingCta.tsx
│   ├── menu/
│   │   ├── MenuTabs.tsx
│   │   ├── DishCard.tsx
│   │   ├── PriceVariantPicker.tsx  ← NEW — handles single/range/sized
│   │   └── SearchBar.tsx
│   ├── cart/
│   │   ├── CartDrawer.tsx
│   │   ├── CartLine.tsx
│   │   └── CartButton.tsx
│   ├── catering/
│   │   ├── TierCard.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── DietChips.tsx
│   │   └── InquiryForm.tsx
│   ├── founder/                    ← NEW
│   │   ├── FounderHero.tsx
│   │   ├── StoryArticle.tsx
│   │   ├── PullQuote.tsx
│   │   └── SignatureDishes.tsx
│   ├── checkout/
│   │   └── CheckoutForm.tsx
│   ├── admin/
│   │   ├── OrderRow.tsx
│   │   ├── OrderDetail.tsx
│   │   ├── StatusPills.tsx
│   │   └── InquiryRow.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── SectionMarker.tsx
│       ├── Eyebrow.tsx
│       ├── Divider.tsx
│       └── Input.tsx
├── lib/
│   ├── menu-data.ts                ← the menu, hand-edited from MENU_DATA.md
│   ├── cart-context.tsx
│   ├── motion.ts
│   ├── format.ts                   ← formatGhs, formatPhone, generateRef, formatPriceForCard
│   ├── db.ts
│   └── auth.ts
└── types/
    └── index.ts
```

---

## 3. Routes

| Path | File | Type | Notes |
|---|---|---|---|
| `/` | `app/page.tsx` | Static | Home |
| `/menu` | `app/menu/page.tsx` | Static | Menu, deep-link via `?tab=banku` etc. |
| `/catering` | `app/catering/page.tsx` | Static | The featured page |
| `/founder` | `app/founder/page.tsx` | Static | Founder profile (NEW) |
| `/about` | `app/about/page.tsx` | Static | |
| `/contact` | `app/contact/page.tsx` | Static | |
| `/checkout` | `app/checkout/page.tsx` | Client | Cart + form |
| `/order-confirmation/[ref]` | `app/order-confirmation/[ref]/page.tsx` | Server | Fetch order by ref |
| `/admin/login` | `app/admin/login/page.tsx` | Client | Not in any nav |
| `/admin/dashboard` | `app/admin/dashboard/page.tsx` | Client | Auth-guarded |
| `/api/orders` | API | POST/GET | Create + list |
| `/api/orders/[id]` | API | PATCH | Update status |
| `/api/catering` | API | POST/GET | Create + list inquiries |
| `/api/auth/[...nextauth]` | API | NextAuth | |

`robots.txt` should disallow `/admin/*`. Add `<meta name="robots" content="noindex">` on the admin pages.

---

## 4. TypeScript types

Centralize in `types/index.ts`:

```ts
// ───────────────────── Menu ─────────────────────

export type CategoryId =
  | 'rice'         // contains plain rice, thai fried rice, jollof rice
  | 'banku'
  | 'yam-chips'
  | 'noodles'
  | 'extras';

// Some items are grouped under sub-headings within a category (e.g. Plain Rice / Thai Fried Rice / Spicy Jollof Rice are all under the 'rice' category).
export type SubGroupId =
  | 'plain-rice'
  | 'thai-fried-rice'
  | 'spicy-jollof-rice'
  | null;       // null when the category has no subgroups (banku, yam-chips, noodles, extras)

export type Price =
  | { kind: 'single'; amount: number }
  | { kind: 'range'; min: number; max: number }              // small/large
  | { kind: 'sized'; sizes: SizedPrices };

export interface SizedPrices {
  regular: number;
  medium: number;
  large: number;
  family: number;
}

export interface MenuItem {
  id: string;                    // e.g. "thai-rice-shrimps"
  category: CategoryId;
  subGroup: SubGroupId;
  name: string;                  // e.g. "Thai Fried Rice with Shrimps"
  description?: string;
  price: Price;
  image: string;                 // path under /public/images/menu
  featured?: boolean;
  available?: boolean;
}

// ─────────────────── Cart ───────────────────

// A cart line is always a SPECIFIC variant of an item — never the abstract item.
// For single-priced items, variantKey is just 'default'.
// For range items, variantKey is 'min' or 'max'.
// For sized items, variantKey is 'regular' | 'medium' | 'large' | 'family'.

export type VariantKey = 'default' | 'min' | 'max' | 'regular' | 'medium' | 'large' | 'family';

export interface CartLine {
  itemId: string;
  variantKey: VariantKey;
  qty: number;
}

// Helper: resolve a CartLine to a concrete display object for the drawer/checkout.
export interface ResolvedCartLine {
  itemId: string;
  variantKey: VariantKey;
  name: string;            // includes the variant suffix, e.g. "Banku with Tilapia – Large"
  unitPrice: number;       // GHS
  qty: number;
  lineTotal: number;       // unitPrice * qty
  image: string;
}

// ─────────────────── Order ───────────────────

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'completed';
export type OrderType = 'delivery' | 'pickup';
export type PaymentMethod = 'cash' | 'momo';
export type MomoProvider = 'mtn' | 'vodafone' | 'airteltigo';

export interface Order {
  id: string;            // uuid
  ref: string;           // TXS-YYYYMMDD-XXXX
  createdAt: string;     // ISO
  status: OrderStatus;
  customerName: string;
  phone: string;
  orderType: OrderType;
  address?: string;      // required if delivery
  paymentMethod: PaymentMethod;
  momoProvider?: MomoProvider;
  momoNumber?: string;
  notes?: string;
  lines: ResolvedCartLine[];   // we snapshot the full resolved line, not just refs
  total: number;
}

// ─────────────────── Catering ───────────────────

export type CateringTier = 'private-chef' | 'custom-diet';
export type DietPreference =
  | 'keto' | 'halal' | 'vegan' | 'vegetarian' | 'gluten-free'
  | 'diabetic-friendly' | 'low-sodium' | 'pescatarian' | 'other';

export interface CateringInquiry {
  id: string;
  createdAt: string;
  fullName: string;
  phone: string;
  email: string;
  tier: CateringTier;
  eventDate: string;     // ISO date
  guests: number;
  diets?: DietPreference[];
  location: string;
  message?: string;
  status: 'new' | 'contacted' | 'closed';
}
```

---

## 5. Database schema (Prisma — Phase 4+)

```prisma
model Order {
  id              String   @id @default(cuid())
  ref             String   @unique
  createdAt       DateTime @default(now())
  status          String   // received | preparing | ready | completed
  customerName    String
  phone           String
  orderType       String   // delivery | pickup
  address         String?
  paymentMethod   String   // cash | momo
  momoProvider    String?
  momoNumber      String?
  notes           String?
  lines           Json     // serialized ResolvedCartLine[] — name, unitPrice, qty etc all snapshotted
  total           Float
}

model CateringInquiry {
  id          String   @id @default(cuid())
  createdAt   DateTime @default(now())
  fullName    String
  phone       String
  email       String
  tier        String   // private-chef | custom-diet
  eventDate   DateTime
  guests      Int
  diets       Json?    // string[]
  location    String
  message     String?
  status      String   @default("new")
}
```

---

## 6. State management — Cart

A single `CartProvider` wraps the entire app in `app/layout.tsx`. It exposes:

```ts
interface CartContextValue {
  lines: CartLine[];
  resolvedLines: ResolvedCartLine[];   // computed via menu lookup
  itemCount: number;                   // sum of qty
  subtotal: number;
  isOpen: boolean;
  add(itemId: string, variantKey: VariantKey): void;
  increment(itemId: string, variantKey: VariantKey): void;
  decrement(itemId: string, variantKey: VariantKey): void;
  remove(itemId: string, variantKey: VariantKey): void;
  clear(): void;
  open(): void;
  close(): void;
}
```

Cart line uniqueness is `(itemId, variantKey)` — the same item in different sizes is two separate lines. The provider:

1. Reads from `localStorage` on mount (key: `txs-cart`).
2. Writes to `localStorage` on every change (debounced 200ms).
3. Computes `resolvedLines`, `itemCount`, `subtotal` via `useMemo` against `lib/menu-data.ts`.
4. Uses `useReducer` internally — actions: `ADD`, `INC`, `DEC`, `REMOVE`, `CLEAR`.

`lib/format.ts` should also export a `resolveLine(line: CartLine, items: MenuItem[]): ResolvedCartLine` helper that:
- Looks up the item by id
- Maps variantKey → unitPrice from the item's `price` field
- Builds the display name by appending the variant suffix (e.g. " – Family", " – Large", "")

---

## 7. Auth (admin)

NextAuth v5 with the **Credentials** provider.

```
.env.local
ADMIN_USERNAME=...
ADMIN_PASSWORD_HASH=...   # bcrypt hash, never the plain password
NEXTAUTH_SECRET=...       # generate with: openssl rand -base64 32
NEXTAUTH_URL=https://tastexxsee.com
DATABASE_URL=postgres://...
```

Flow:
- `/admin/login` posts to NextAuth's signIn.
- On success, redirect to `/admin/dashboard`.
- `app/admin/layout.tsx` does a server-side `auth()` check; redirects to `/admin/login` if no session.
- API routes `GET /api/orders`, `PATCH /api/orders/[id]`, `GET /api/catering` also `auth()`-check.

---

## 8. Forms & validation

Use plain `<form>` with controlled inputs in Phase 1. Validation rules:

- **Phone (Ghana)**: regex accepting `+233XXXXXXXXX`, `0XXXXXXXXX` (10 digits starting 0). Strip whitespace before validating.
- **Email**: standard pattern.
- **Required fields**: labels show, errors appear below the field in `gold-200` after first blur.
- Submit button disabled until valid. Disabled state subtle — don't grey out aggressively.

If forms get fiddly, lift to `react-hook-form` + `zod` — but only when justified.

---

## 9. SEO

- Each page exports a `metadata` object with title, description, OpenGraph image.
- Title pattern: `Page Name — TasteXXSee`. Home: `TasteXXSee — Local roots, global plates · Accra`.
- One OG image (1200×630) lives in `/public/og-default.jpg`. The Founder page should have its own OG image with the founder's portrait once the photoshoot is done.
- `app/sitemap.ts` and `app/robots.ts`. Disallow `/admin/*`.
- Structured data (`Restaurant` JSON-LD) in the home page `<head>`.

---

## 10. Performance & accessibility

- All images via `next/image` with explicit width/height. No layout shift.
- Fonts via `next/font/google` with `display: 'swap'`.
- `prefers-reduced-motion`: motion variants gracefully degrade — wrap motion components in a `useReducedMotion()` check.
- Keyboard: full tab-through tested. Focus rings on dark are 2px `gold` outline.
- Color contrast: `cream` on `ink` is ~13:1, well above AAA. Gold on ink is ~6.5:1 — fine for headings/links, never for body text smaller than 16px.
- Founder portrait must have descriptive alt text — not "founder photo" but "[Name], founder and head chef of TasteXXSee".

---

## 11. Deployment

Vercel, connected to GitHub. Auto-deploy on `main`. Env vars set in Vercel dashboard. Neon free Postgres for `DATABASE_URL`. Prisma migrations run via `vercel-build` script: `prisma migrate deploy && next build`.

---

## 12. Open decisions to confirm with the client

Before committing further, the developer should confirm:

1. **Cuisine framing** — the original brief said "Italian, American, Chinese." The actual menu is local + Asian-influenced. The website now reflects the real menu. Confirm this is correct, or if the menu is being expanded.
2. **Currency display** — printed menu uses "GHC", but the ISO code is "GHS". Pick one and stay consistent.
3. **Two suspected menu typos** (see `MENU_DATA.md` top): Yam Chips with Goat range, and the duplicate "Fried Sausage" in Extras.
4. **Founder portrait + bio** — needs a proper photoshoot and copy before the Founder page can ship.
5. **Domain** — does the client own `tastexxsee.com`?
6. **Logo** — existing logo file or do we set the wordmark in Cormorant?
7. **Mobile Money reconciliation** — admin sees the MoMo number, but who confirms payment landed? (Manual for Phase 1.)
8. **Catering deposit** — fixed % or per-quote? (Affects copy on the catering page.)
