# DESIGN_SYSTEM.md

The aesthetic is **editorial luxury** — black and gold, serif display type, generous negative space, magazine-style asymmetry, and motion that feels intentional. Think boutique hotel restaurant, not chain.

---

## 1. Color tokens

All colors live in `tailwind.config.ts` under `theme.extend.colors`. Never hard-code a hex outside that file.

### Ink (the dark base)
```
ink         #0A0908   primary background — slightly warm black, never pure #000
ink-800     #141210   raised surfaces (cards, drawer)
ink-700     #1C1A17   subtle elevation (hover states on dark cards)
ink-600     #2A2622   borders on dark surfaces
```

### Gold (the accent — use sparingly)
```
gold        #C9A961   primary gold — warm, antique, NOT chrome-yellow
gold-200    #E8D5A8   light champagne — for soft highlights, hover glows
gold-400    #D1B373   for body-on-dark when gold-tinted text is needed
gold-700    #7E6834   muted gold — for subdued borders / dividers
```

### Cream (the light text on dark)
```
cream       #F5F1E8   primary text on ink — never use pure white
cream-200   #EDE6D2   secondary text
```

### Usage rules
- 80% ink, 15% cream, 5% gold. The gold should feel rare and earned.
- Body copy: `cream` on `ink`. Never gold body text — gold is for headings, accents, CTAs, dividers, numerals.
- Dividers: 1px gold-700 hairlines, never thicker.
- No drop shadows on gold — they cheapen it. Use it flat.
- Never combine gold with grey. It's gold + ink + cream, full stop.

---

## 2. Typography

Two fonts. Loaded via `next/font/google` in `app/layout.tsx`.

### Display — Cormorant Garamond
- Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold)
- Italic available — use it. Italics are part of the brand voice.
- Use for: page titles, hero headlines, dish names, section headings, large display numerals.
- Tracking: tight on large sizes (`tracking-tight` or `-0.02em`).

### Body — Jost
- Weights: 300, 400, 500
- Use for: paragraphs, nav, buttons, form fields, all UI text.
- Tracking: normal on body, very wide (`tracking-ultra` = 0.4em) on small ALL-CAPS labels and section markers.

### Type scale
```
Display XL   font-display, 7-9rem (clamp(4rem, 10vw, 9rem)), weight 400, leading-none
Display L    font-display, 5-6rem (clamp(3rem, 7vw, 6rem)),    weight 400, leading-tight
Display M    font-display, 3-4rem,                              weight 500, leading-tight
H2           font-display, 2.5rem,                              weight 500, leading-tight
H3           font-display, 1.75rem,                             weight 500, leading-snug
Body L       font-sans,    1.125rem,                            weight 400, leading-relaxed
Body         font-sans,    1rem,                                weight 400, leading-relaxed
Small        font-sans,    0.875rem,                            weight 400
Eyebrow      font-sans,    0.75rem, tracking-ultra, uppercase, weight 500, color gold
Numeral      font-display, italic, weight 300, color gold (for 01, 02, 03 markers)
```

### Italic moments
Sprinkle italic into headlines for emphasis. Example: `<h1>Three worlds. <em>One table.</em></h1>` — the italic word should be the emotional pivot.

---

## 3. Spacing & layout

- **Grid**: 12-column on desktop, 8-column on tablet, 4-column on mobile. Tailwind defaults are fine.
- **Page horizontal padding**: `px-6 md:px-12 lg:px-20` — generous on desktop.
- **Vertical rhythm between sections**: `py-24 md:py-32` for hero/feature sections, `py-16` for tighter ones. Don't be afraid of breathing room.
- **Max content width**: 1440px wrapper, with most content sitting at 1280px or narrower.
- **Asymmetry**: at least one section per page should break the centered grid — text aligned left while image floats right slightly off-axis, etc.

---

## 4. Motion principles

We use **Framer Motion** for React components, and Tailwind keyframes for CSS-only effects. Three principles:

1. **One choreographed entrance per section.** Stagger 3–5 elements with 80–120ms delays. Don't animate everything.
2. **Slow and easy.** Default duration 0.6–0.8s, easing `[0.22, 1, 0.36, 1]` (a soft ease-out). No bouncy springs.
3. **Hover states that draw, not bounce.** Gold underline drawing under nav links and CTAs. Subtle 1.02 scale at most.

### Reusable motion variants (define once in `lib/motion.ts`)

```ts
export const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

export const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export const drawLine = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
  transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
};
```

Use `whileInView` with `viewport={{ once: true, margin: '-100px' }}` so animations only fire once when the section enters view.

### Specific moments
- **Hero load**: Letters of the title fade up one-by-one (split text). Tagline fades in 600ms after. CTA fades in 1200ms after.
- **Cart drawer**: Slides in from right, 0.4s. Backdrop fades in concurrently.
- **Nav link hover**: gold hairline draws left-to-right under the link (300ms).
- **Dish card hover**: image scales 1.04 inside its frame (600ms ease-out), gold border fades in around the card.
- **Section reveal on scroll**: stagger fade-up of children.

### Things to avoid
- No spring animations with overshoot.
- No autoplay carousels.
- No parallax on body content (only acceptable on hero background image, very subtle).
- No animated backgrounds.
- No emoji-style microinteractions.

---

## 5. Component patterns

### Buttons

**Primary (gold filled):**
- Background: `gold`, text: `ink`, height 52px, padding `px-8`, no border-radius (or `rounded-none` — sharp).
- Hover: background fades to `gold-200`, slight 1px upward translate.
- Use sparingly — the page should have ONE primary button per viewport.

**Secondary (gold outline on dark):**
- Background: transparent, border 1px `gold`, text `gold`, height 52px.
- Hover: gold fills behind text from left to right (use a `::before` pseudo or motion div).

**Ghost link with arrow:**
- No border, text `cream`, with a `→` after the label that translates 4px right on hover. Used for "Explore catering →" type links.

### Cards (dish cards)
- Background `ink-800`, no border by default, no radius (or 2px max).
- On hover: 1px `gold` border (animate via box-shadow inset for performance), image inside scales 1.04.
- Padding: `p-0` (image flush) at the top; text content `p-6`.
- Price aligned to the right of the dish name on the same row; "GHS" lighter and smaller than the number.

### Forms
- Input: transparent background, bottom-border only `1px solid ink-600`. Focus → border becomes `gold`. Label sits above in eyebrow style.
- Never use rounded form fields. Sharp corners only.
- Validation: error in `gold-200` (we deliberately use champagne for errors instead of red — it stays on-brand). Subtle.

### Navigation
- Header: 80px tall, transparent on hero, becomes `ink/95 backdrop-blur` after scroll past 80px, with a 1px `gold-700` bottom hairline.
- Logo on left in display serif. Nav center. Cart icon (Lucide `ShoppingBag`) + count badge on right.
- Cart count badge: small circle, `gold` background, `ink` numeral.

### Dividers
- Always `1px solid` `gold-700` at 60–40% opacity. Use as section markers. Never use full-width cream dividers.

### Numerals (section markers)
- Top-left of each major section: `01 / WELCOME`, `02 / OUR MENU`, etc. The number in display italic gold, the label in eyebrow style cream-200.

---

## 6. Imagery

- **All food photography on dark surfaces** — moody lighting, dark backgrounds, soft side-light. Phase 1 use Unsplash placeholder images that match this aesthetic; final shots come from the client's photographer.
- **Aspect ratios**: 4:5 portrait for hero dish, 1:1 square for menu cards, 16:9 for hero background, 3:4 for catering tier images.
- **Image treatment**: a subtle dark gradient overlay from bottom (`bg-gradient-to-t from-ink/60`) on any image with text on top.

### Approved Unsplash sample queries (for placeholder period)
- `italian food dark`
- `american steakhouse dark`
- `chinese cuisine dark restaurant`
- `chef plating fine dining`
- `private chef event`
- `restaurant interior moody`

---

## 7. Voice & copy

- Confident, refined, never cute. Short sentences. One adjective max.
- Don't overpromise. "Restaurant-quality, brought to your table" beats "The best catering in Ghana."
- No exclamation marks anywhere except possibly the order confirmation.
- Numbers spelled out below ten in body copy, except prices and quantities.
- Currency format: `GHS 45.00` — symbol with a space, two decimals.

---

## 8. Don't list

Things that would break the aesthetic — do not do these:

- ❌ Drop shadows on cards/buttons (except on the very subtle cart drawer for depth)
- ❌ Border-radius above 4px
- ❌ Gradients (except the gold-gradient utility for one or two accent moments)
- ❌ Emoji in UI copy
- ❌ Stock illustrations or icon-style graphics
- ❌ Auto-rotating sliders
- ❌ Modal popups for cookie banners or newsletter signup (no newsletter in Phase 1)
- ❌ Decorative "splash" animations on every element
- ❌ Centered-everything layouts
- ❌ The word "delicious" anywhere
