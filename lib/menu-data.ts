import type { MenuItem } from '@/types';

export const menuItems: MenuItem[] = [
  // ─── Plain Rice ─────────────────────────────────────────────────────────────
  {
    id: 'plain-rice-egg-sausage',
    category: 'rice',
    subGroup: 'plain-rice',
    name: 'Plain Rice with Fried Egg & Sausage',
    description: 'Steamed white rice topped with a golden fried egg and sliced sausage.',
    price: { kind: 'single', amount: 30 },
    image: '/img/plain_rice_sausage_egg.png',
  },
  {
    id: 'plain-rice-goat-stew',
    category: 'rice',
    subGroup: 'plain-rice',
    name: 'Plain Rice with Goat Stew',
    description: 'Slow-braised goat in a tomato-and-pepper stew, served over white rice.',
    price: { kind: 'range', min: 65, max: 85 },
    image: '/img/plain_rice_with_beef_stew.png',
  },

  // ─── Thai Fried Rice ─────────────────────────────────────────────────────────
  {
    id: 'thai-rice-chicken',
    category: 'rice',
    subGroup: 'thai-fried-rice',
    name: 'Thai Fried Rice with Grilled Chicken',
    description: 'Wok-tossed rice with tender grilled chicken, scallions, and aromatics.',
    price: {
      kind: 'sized',
      sizes: { regular: 40, medium: 65, large: 85, family: 125 },
    },
    image: '/img/thai_friedrice_chicken.png',
  },
  {
    id: 'thai-rice-beef',
    category: 'rice',
    subGroup: 'thai-fried-rice',
    name: 'Thai Fried Rice with Beef',
    description: 'Stir-fried rice with seasoned beef strips, garlic, and a touch of soy.',
    price: {
      kind: 'sized',
      sizes: { regular: 50, medium: 65, large: 85, family: 125 },
    },
    image: '/img/thai_friedrice_beef.png',
  },
  {
    id: 'thai-rice-beef-chicken',
    category: 'rice',
    subGroup: 'thai-fried-rice',
    name: 'Thai Fried Rice with Beef & Chicken',
    description: 'A double protein fried rice with seared beef and grilled chicken.',
    price: {
      kind: 'sized',
      sizes: { regular: 85, medium: 125, large: 150, family: 250 },
    },
    image: '/img/thai_firedrice_beef_chicken.png',
  },
  {
    id: 'thai-rice-shrimps',
    category: 'rice',
    subGroup: 'thai-fried-rice',
    name: 'Thai Fried Rice with Shrimps',
    description: 'Wok-tossed rice with prawns, scallions, and a touch of fish sauce.',
    price: {
      kind: 'sized',
      sizes: { regular: 85, medium: 125, large: 150, family: 250 },
    },
    image: '/img/thai_shrimp_friedrice.png',
    featured: true,
  },

  // ─── Spicy Jollof Rice ───────────────────────────────────────────────────────
  {
    id: 'jollof-loaded-fries',
    category: 'rice',
    subGroup: 'spicy-jollof-rice',
    name: 'Spicy Loaded Jollof Rice',
    description: 'Smoke-finished jollof paired with crispy fries, fish, egg, and sausage.',
    price: {
      kind: 'sized',
      sizes: { regular: 40, medium: 65, large: 85, family: 125 },
    },
    image: '/img/loaded_jollof_rice.png',
  },
  {
    id: 'jollof-beef',
    category: 'rice',
    subGroup: 'spicy-jollof-rice',
    name: 'Spicy Jollof Rice with Beef',
    description: 'Party-style jollof rice with tender slow-braised beef.',
    price: {
      kind: 'sized',
      sizes: { regular: 50, medium: 65, large: 85, family: 125 },
    },
    image: '/img/spicy_jollof_with_beef.png',
  },
  {
    id: 'jollof-beef-chicken',
    category: 'rice',
    subGroup: 'spicy-jollof-rice',
    name: 'Spicy Jollof Rice with Beef & Chicken',
    description: 'Smoke-finished jollof with seared beef strips and grilled chicken thigh.',
    price: {
      kind: 'sized',
      sizes: { regular: 85, medium: 125, large: 150, family: 250 },
    },
    image: '/img/spicy_jollof_beef_and_chicken.png',
    featured: true,
  },
  {
    id: 'jollof-shrimps',
    category: 'rice',
    subGroup: 'spicy-jollof-rice',
    name: 'Spicy Jollof Rice with Shrimps',
    description: 'Fragrant jollof rice with plump shrimps and a hit of chili.',
    price: {
      kind: 'sized',
      sizes: { regular: 85, medium: 125, large: 150, family: 250 },
    },
    image: '/img/spicy_jollof_shrimp.png',
  },

  // ─── Banku ───────────────────────────────────────────────────────────────────
  {
    id: 'banku-loaded-fries',
    category: 'banku',
    subGroup: null,
    name: 'Loaded Banku',
    description: 'Fermented corn-and-cassava dough with crispy fries, fish, egg, and sausage.',
    price: { kind: 'single', amount: 50 },
    image: '/img/loaded_banku.png',
  },
  {
    id: 'banku-okro-stew',
    category: 'banku',
    subGroup: null,
    name: 'Banku with Okro Stew',
    description: 'Classic banku served with a rich, slow-cooked okro stew.',
    price: { kind: 'range', min: 50, max: 85 },
    image: '/img/banku_okro_stew.png',
  },
  {
    id: 'banku-tilapia',
    category: 'banku',
    subGroup: null,
    name: 'Banku with Tilapia',
    description: 'Fermented corn-and-cassava dough with grilled whole tilapia and shito on the side.',
    price: { kind: 'range', min: 50, max: 85 },
    image: '/img/banku_with_tilapia.png',
    featured: true,
  },
  {
    id: 'banku-catfish',
    category: 'banku',
    subGroup: null,
    name: 'Banku with Catfish',
    description: 'Banku with grilled whole catfish, served with a side of shito and pepper sauce.',
    price: { kind: 'range', min: 150, max: 200 },
    image: '/img/banku_with_catfish.png',
  },

  // ─── Yam Chips ───────────────────────────────────────────────────────────────
  {
    id: 'yam-chips-grilled-chicken',
    category: 'yam-chips',
    subGroup: null,
    name: 'Yam Chips with Grilled Chicken',
    description: 'Crispy fried yam chips served alongside seasoned grilled chicken.',
    price: { kind: 'single', amount: 50 },
    image: '/img/yam_chips_and_grilled_chicken.png',
  },
  {
    id: 'yam-chips-goat',
    category: 'yam-chips',
    subGroup: null,
    name: 'Yam Chips with Goat',
    description: 'Golden yam chips paired with slow-braised goat in a rich pepper sauce.',
    price: { kind: 'single', amount: 50 },
    image: '/img/yam_chips_goat.png',
  },

  // ─── Noodles ─────────────────────────────────────────────────────────────────
  {
    id: 'noodles-egg-sausage',
    category: 'noodles',
    subGroup: null,
    name: 'Egg & Sausage Assorted Noodles',
    description: 'Stir-fried noodles with fried egg, sliced sausage, and mixed vegetables.',
    price: {
      kind: 'sized',
      sizes: { regular: 30, medium: 50, large: 70, family: 150 },
    },
    image: '/img/noodles_egg_sausage.png',
  },
  {
    id: 'noodles-beef',
    category: 'noodles',
    subGroup: null,
    name: 'Beef Assorted Noodles',
    description: 'Wok-tossed noodles with tender beef strips and a savory sauce.',
    price: {
      kind: 'sized',
      sizes: { regular: 40, medium: 65, large: 85, family: 150 },
    },
    image: '/img/noodles_with_beef_assorted.png',
  },
  {
    id: 'noodles-shrimp',
    category: 'noodles',
    subGroup: null,
    name: 'Shrimp Assorted Noodles',
    description: 'Stir-fried noodles with plump shrimp, garlic, and a touch of chili.',
    price: {
      kind: 'sized',
      sizes: { regular: 85, medium: 125, large: 150, family: 250 },
    },
    image: '/img/noodles_shrimp.png',
  },

  // ─── Extras ──────────────────────────────────────────────────────────────────
  {
    id: 'extra-eggs',
    category: 'extras',
    subGroup: null,
    name: 'Fried or Boiled Eggs',
    description: 'One fried or boiled egg, cooked to order.',
    price: { kind: 'single', amount: 5 },
    image: '/img/fried_eggs.png',
  },
  {
    id: 'extra-sausage-small',
    category: 'extras',
    subGroup: null,
    name: 'Fried Sausage (Small)',
    description: 'Small portion of crispy fried sausage.',
    price: { kind: 'single', amount: 5 },
    image: '/img/fried_sausage_big_and_small.png',
  },
  {
    id: 'extra-sausage-large',
    category: 'extras',
    subGroup: null,
    name: 'Fried Sausage (Large)',
    description: 'Large portion of crispy fried sausage.',
    price: { kind: 'single', amount: 25 },
    image: '/img/fried_sausage_big_and_small.png',
  },
  {
    id: 'extra-banku',
    category: 'extras',
    subGroup: null,
    name: 'Banku',
    description: 'A single ball of fermented corn-and-cassava dough.',
    price: { kind: 'single', amount: 5 },
    image: '/img/banku.png',
  },
  {
    id: 'extra-beef-sauce',
    category: 'extras',
    subGroup: null,
    name: 'Beef Sauce',
    description: 'A rich tomato-based beef sauce to accompany any dish.',
    price: { kind: 'single', amount: 25 },
    image: '/img/beef_sauce.png',
  },
];

export const featuredItems = menuItems.filter((item) => item.featured);
