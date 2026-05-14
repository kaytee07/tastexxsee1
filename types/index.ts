// ───────────────────── Menu ─────────────────────

export type CategoryId =
  | 'rice'        // contains plain rice, thai fried rice, jollof rice
  | 'banku'
  | 'yam-chips'
  | 'noodles'
  | 'extras';

// Some items are grouped under sub-headings within a category.
export type SubGroupId =
  | 'plain-rice'
  | 'thai-fried-rice'
  | 'spicy-jollof-rice'
  | null; // null when the category has no subgroups

export type Price =
  | { kind: 'single'; amount: number }
  | { kind: 'range'; min: number; max: number }  // small / large
  | { kind: 'sized'; sizes: SizedPrices };

export interface SizedPrices {
  regular: number;
  medium: number;
  large: number;
  family: number;
}

export interface MenuItem {
  id: string;             // e.g. "thai-rice-shrimps"
  category: CategoryId;
  subGroup: SubGroupId;
  name: string;           // e.g. "Thai Fried Rice with Shrimps"
  description?: string;
  price: Price;
  image: string;          // base/fallback shown before a size is selected
  variantImages?: Partial<Record<VariantKey, string>>; // per-size photos — e.g. { regular: '/img/jollof_beef_regular.png', family: '/img/jollof_beef_family.png' }
  featured?: boolean;
  available?: boolean;
}

// ─────────────────── Cart ───────────────────

// A cart line is always a SPECIFIC variant of an item — never the abstract item.
// For single-priced items, variantKey is 'default'.
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
  name: string;         // includes the variant suffix, e.g. "Banku with Tilapia – Large"
  unitPrice: number;    // GHS
  qty: number;
  lineTotal: number;    // unitPrice * qty
  image: string;
}

// ─────────────────── Order ───────────────────

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'completed';
export type OrderType = 'delivery' | 'pickup';
export type PaymentMethod = 'cash' | 'momo';
export type MomoProvider = 'mtn' | 'vodafone' | 'airteltigo';

export interface Order {
  id: string;           // uuid
  ref: string;          // TXS-YYYYMMDD-XXXX
  createdAt: string;    // ISO
  status: OrderStatus;
  customerName: string;
  phone: string;
  orderType: OrderType;
  address?: string;     // required if delivery
  paymentMethod: PaymentMethod;
  momoProvider?: MomoProvider;
  momoNumber?: string;
  notes?: string;
  lines: ResolvedCartLine[]; // snapshotted resolved lines
  total: number;
}

// ─────────────────── Catering ───────────────────

export type CateringTier = 'private-chef' | 'custom-diet';
export type DietPreference =
  | 'keto'
  | 'halal'
  | 'vegan'
  | 'vegetarian'
  | 'gluten-free'
  | 'diabetic-friendly'
  | 'low-sodium'
  | 'pescatarian'
  | 'other';

export interface CateringInquiry {
  id: string;
  createdAt: string;
  fullName: string;
  phone: string;
  email: string;
  tier: CateringTier;
  eventDate: string;  // ISO date
  guests: number;
  diets?: DietPreference[];
  location: string;
  message?: string;
  status: 'new' | 'contacted' | 'closed';
}
