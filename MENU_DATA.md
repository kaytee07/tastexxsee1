# MENU_DATA.md

The real TasteXXSee menu, transcribed from the client's printed menu boards. This document is the source of truth for `lib/menu-data.ts`.

> **Note on currency**: The printed menu uses "GHC". The website should use **"GHS"** (the ISO 4217 code, official since 2007). Both refer to the Ghanaian Cedi. The developer should confirm with the client which they want displayed before launch.

> **Two suspected typos on the printed menu** — the developer should confirm before going live:
> 1. *Yam Chips with Goat* shows "GHC 50.00 - GHC 50.00" (range to itself). Probably a single price of GHS 50 or a typo for a higher upper bound.
> 2. *Extras* lists "Fried Sausage" twice (GHC 5 and GHC 25). Probably two sizes (small / large) but unlabeled.

The data below assumes the typos are simple single-price items unless the client confirms otherwise.

---

## 1. Categories

Menu is organized into six categories. The Menu page shows them as tabs (or an anchor-linked list on mobile).

| Slug | Display name | Pricing model |
|---|---|---|
| `rice` | Rice | mixed (single, range, sized) |
| `banku` | Banku | mixed (single, range) |
| `yam-chips` | Yam Chips | single |
| `noodles` | Noodles | sized |
| `extras` | Extras | single |

Note: "Plain Rice", "Thai Fried Rice", and "Spicy Jollof Rice" are grouped under one **Rice** tab to keep the navigation tidy. They render as three sub-sections inside that tab.

---

## 2. Pricing models

Three pricing models exist. The TypeScript shape lives in `ARCHITECTURE.md` §4 — summary here:

```ts
type Price =
  | { kind: 'single'; amount: number }                                 // GHS 30.00
  | { kind: 'range'; min: number; max: number }                        // GHS 65.00 – 85.00
  | { kind: 'sized'; sizes: { regular: number; medium: number; large: number; family: number } };
```

Cart UX rules:
- **Single** → "Add to order" button adds directly.
- **Range** → user picks Small or Large via two chip buttons before adding (`min` is "Small", `max` is "Large").
- **Sized** → user picks Regular / Medium / Large / Family via four chip buttons before adding.

Each variant ends up in the cart as one cart line with a fixed price and a label suffix on the dish name (e.g. "Thai Fried Rice with Beef – Family").

---

## 3. Full menu

### 3.1 Rice — Plain Rice

| ID | Name | Price |
|---|---|---|
| `plain-rice-egg-sausage` | Plain Rice with Fried Egg & Sausage | single — 30 |
| `plain-rice-goat-stew` | Plain Rice with Goat Stew | range — 65 / 85 |

### 3.2 Rice — Thai Fried Rice

All sized: Regular / Medium / Large / Family.

| ID | Name | R | M | L | F |
|---|---|---|---|---|---|
| `thai-rice-chicken` | Thai Fried Rice with Grilled Chicken | 40 | 65 | 85 | 125 |
| `thai-rice-beef` | Thai Fried Rice with Beef | 50 | 65 | 85 | 125 |
| `thai-rice-beef-chicken` | Thai Fried Rice with Beef & Chicken | 85 | 125 | 150 | 250 |
| `thai-rice-shrimps` | Thai Fried Rice with Shrimps | 85 | 125 | 150 | 250 |

### 3.3 Rice — Spicy Jollof Rice

All sized: Regular / Medium / Large / Family.

| ID | Name | R | M | L | F |
|---|---|---|---|---|---|
| `jollof-loaded-fries` | Spicy Jollof Rice with Loaded Fries (fish, egg, sausage) | 40 | 65 | 85 | 125 |
| `jollof-beef` | Spicy Jollof Rice with Beef | 50 | 65 | 85 | 125 |
| `jollof-beef-chicken` | Spicy Jollof Rice with Beef & Chicken | 85 | 125 | 150 | 250 |
| `jollof-shrimps` | Spicy Jollof Rice with Shrimps | 85 | 125 | 150 | 250 |

### 3.4 Banku

| ID | Name | Price |
|---|---|---|
| `banku-loaded-fries` | Banku with Loaded Fries (fish, egg, sausage) | single — 50 |
| `banku-okro-stew` | Banku with Okro Stew | range — 50 / 85 |
| `banku-tilapia` | Banku with Tilapia | range — 50 / 85 |
| `banku-catfish` | Banku with Catfish | range — 150 / 200 |

### 3.5 Yam Chips

| ID | Name | Price |
|---|---|---|
| `yam-chips-grilled-chicken` | Yam Chips with Grilled Chicken | single — 50 |
| `yam-chips-goat` | Yam Chips with Goat | single — 50 *(see typo note)* |

### 3.6 Noodles

All sized: Regular / Medium / Large / Family.

| ID | Name | R | M | L | F |
|---|---|---|---|---|---|
| `noodles-egg-sausage` | Egg & Sausage Assorted Noodles | 30 | 50 | 70 | 150 |
| `noodles-beef` | Beef Assorted Noodles | 40 | 65 | 85 | 150 |
| `noodles-shrimp` | Shrimp Assorted Noodles | 85 | 125 | 150 | 250 |

### 3.7 Extras

| ID | Name | Price |
|---|---|---|
| `extra-eggs` | Fried or Boiled Eggs | single — 5 |
| `extra-sausage-small` | Fried Sausage (small) | single — 5 *(see typo note)* |
| `extra-sausage-large` | Fried Sausage (large) | single — 25 *(see typo note)* |
| `extra-banku` | Banku | single — 5 |
| `extra-beef-sauce` | Beef Sauce | single — 25 |

---

## 4. Featured dishes (home page)

The home page surfaces three signature dishes. Recommended picks (the developer can swap if the client requests):

1. `banku-tilapia` — represents the local soul of the menu
2. `thai-rice-shrimps` — represents the international/upscale side
3. `jollof-beef-chicken` — the crowd-pleaser

These get the `featured: true` flag in `lib/menu-data.ts`.

---

## 5. Item description copy

The printed menu has no descriptions. The developer should ask the client to write a single short sentence per item before launch. Until then, use placeholder descriptions in this voice (refined, single-sentence, present-tense, no exclamations):

- Plain Rice with Goat Stew → *"Slow-braised goat in a tomato-and-pepper stew, served over white rice."*
- Banku with Tilapia → *"Fermented corn-and-cassava dough with grilled whole tilapia and shito on the side."*
- Thai Fried Rice with Shrimps → *"Wok-tossed rice with prawns, scallions, and a touch of fish sauce."*
- Spicy Jollof Rice with Beef & Chicken → *"Smoke-finished jollof with seared beef strips and grilled chicken thigh."*

(Use these as a tone reference only — the client's own words are better.)

---

## 6. Image plan

For Phase 1 placeholders, use Unsplash searches that match the dish (e.g. `banku tilapia`, `thai fried rice dark`, `jollof rice plate`). For launch, the client should commission a small photoshoot — 12–14 hero dish shots, dark moody lighting, top-down or 45° angle, served on dark plates.

Image filenames: `{item-id}.jpg` in `/public/images/menu/`. Use `next/image` with explicit width/height.
