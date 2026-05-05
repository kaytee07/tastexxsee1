# CLAUDE.md

> **Read this first.** This is the context document for Claude Code. Other specs live alongside it: `REQUIREMENTS.md`, `DESIGN_SYSTEM.md`, `ARCHITECTURE.md`, `IMPLEMENTATION_PLAN.md`, `MENU_DATA.md`.

---

## What we're building

**TasteXXSee** — a boutique restaurant website for a single restaurant in Ghana. The site has three jobs:

1. A public storefront showcasing the restaurant's menu (Ghanaian local plates plus Asian-influenced rice and noodles).
2. An online ordering flow with no customer accounts.
3. A prominent **boutique catering** offering with two tiers: Private Chef Hire and Custom Diet Catering.

A **Founder page** featuring the owner's portrait and story is part of v1.0 — the client wants his face front-and-centre on the site.

A private admin login lets the owner view and manage incoming orders and catering inquiries.

> **Note on cuisine framing**: The original requirements doc described the menu as "Italian, American, Chinese." The actual printed menu (see `MENU_DATA.md`) is Ghanaian local food (Plain Rice, Banku, Yam Chips) plus Asian-influenced dishes (Thai Fried Rice, Spicy Jollof, Noodles). The website now reflects the real menu. Confirm with the client before launch.

---

## Aesthetic non-negotiables

The client's brand colors are **black and gold**. The execution must feel **luxury, editorial, classy** — not generic restaurant-template. Think boutique hotel restaurant, not chain. See `DESIGN_SYSTEM.md` for exact tokens.

Three rules that override convenience:

1. **No generic sans-serif body fonts** (no Inter, no Roboto, no system stack). Use the typography pairing in the design system.
2. **No purple-on-white, no pastel gradients, no rounded everything.** Sharp edges or very subtle radii (2–4px max). Hairline gold dividers, generous negative space.
3. **Animations are intentional, not scattered.** One well-orchestrated entrance per section beats ten micro-bounces. See animation principles in `DESIGN_SYSTEM.md`.

---

## Tech stack (locked)

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** with custom design tokens
- **Framer Motion** for animations
- **Lucide React** for icons
- **React Context** for cart state (no Redux/Zustand needed at this scope)
- **Local TS file** for menu data in Phase 1 (`lib/menu-data.ts`, sourced from `MENU_DATA.md`)

No other UI libraries. No shadcn unless explicitly approved — we want a custom-feeling UI, not a stack of common components.

---

## Project context

| Item | Value |
|---|---|
| Client | TasteXXSee Restaurant |
| Location | Ghana (currency: GHS — Ghanaian Cedi; printed menu uses "GHC", confirm preference with client) |
| Project fee | GHS 1,000 (low budget — keep scope tight) |
| Phase | 1 (MVP) |
| Payments | Cash on Delivery, Mobile Money (no card processing) |
| Notifications | None in Phase 1 (admin sees orders in dashboard) |

---

## How to use the other docs

- **`REQUIREMENTS.md`** — the *what*. Every page, every flow, every field. If a feature isn't in there, it's out of scope.
- **`MENU_DATA.md`** — the actual menu items, prices, and pricing models. Source of truth for `lib/menu-data.ts`.
- **`DESIGN_SYSTEM.md`** — the *look*. Colors, type, spacing, motion, component patterns. Copy hex codes from here, don't invent new shades.
- **`ARCHITECTURE.md`** — the *how*. File structure, routes, data shapes, state management.
- **`IMPLEMENTATION_PLAN.md`** — the *order*. Build it phase by phase. Don't jump ahead.

---

## Working agreement for Claude Code

- Build phase by phase as laid out in `IMPLEMENTATION_PLAN.md`. Don't scaffold every page at once.
- After each phase, run the dev server and confirm it renders before moving on.
- Use TypeScript strictly — no `any` unless commented why.
- Keep components under ~150 lines; split when they grow.
- Commit at the end of each phase with a clean message.
- If something in the spec is ambiguous, ask before guessing — the client cares about polish.
