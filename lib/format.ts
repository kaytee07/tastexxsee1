import type { Price } from '@/types';

/**
 * Format a number as a GHS price string.
 * e.g. formatGhs(45) → "GHS 45.00"
 */
export function formatGhs(n: number): string {
  return `GHS ${n.toFixed(2)}`;
}

/**
 * Generate a unique order reference.
 * Format: TXS-YYYYMMDD-XXXX (4 random digits)
 */
export function generateRef(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const rand = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `TXS-${year}${month}${day}-${rand}`;
}

/**
 * Normalize a Ghana phone number.
 * Accepts: +233XXXXXXXXX, 0XXXXXXXXX
 * Returns normalized form (keeps leading + if present, strips whitespace).
 */
export function formatPhone(s: string): string {
  const stripped = s.replace(/\s/g, '');
  // If it starts with +233, leave it
  if (/^\+233\d{9}$/.test(stripped)) {
    return stripped;
  }
  // If it starts with 0 and has 10 digits total, convert to +233
  if (/^0\d{9}$/.test(stripped)) {
    return `+233${stripped.slice(1)}`;
  }
  // Return as-is (let validation catch malformed numbers)
  return stripped;
}

/**
 * Format a Price for use on a card/listing.
 * - single → "GHS 30.00"
 * - range  → "From GHS 50.00" (uses min)
 * - sized  → "From GHS 40.00" (uses regular)
 */
export function formatPriceForCard(price: Price): string {
  switch (price.kind) {
    case 'single':
      return formatGhs(price.amount);
    case 'range':
      return `From ${formatGhs(price.min)}`;
    case 'sized':
      return `From ${formatGhs(price.sizes.regular)}`;
  }
}
