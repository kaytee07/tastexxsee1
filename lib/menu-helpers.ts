import type { CartLine, MenuItem, ResolvedCartLine, VariantKey } from '@/types';

/**
 * Find a MenuItem by id.
 */
export function findItem(id: string, items: MenuItem[]): MenuItem | undefined {
  return items.find((item) => item.id === id);
}

/**
 * Resolve a variantKey to a unit price for a given MenuItem.
 * Throws if the variant is incompatible with the item's price kind.
 */
export function getVariantPrice(item: MenuItem, variantKey: VariantKey): number {
  const { price } = item;

  switch (price.kind) {
    case 'single':
      return price.amount;

    case 'range':
      if (variantKey === 'min') return price.min;
      if (variantKey === 'max') return price.max;
      // Fallback for 'default' on a range item — use min
      return price.min;

    case 'sized': {
      const key = variantKey as 'regular' | 'medium' | 'large' | 'family';
      if (key in price.sizes) return price.sizes[key];
      // Fallback — use regular
      return price.sizes.regular;
    }
  }
}

/**
 * Build the display name suffix for a given variant key.
 */
function variantSuffix(variantKey: VariantKey): string {
  switch (variantKey) {
    case 'default': return '';
    case 'min':     return ' – Small';
    case 'max':     return ' – Large';
    case 'regular': return ' – Regular';
    case 'medium':  return ' – Medium';
    case 'large':   return ' – Large';
    case 'family':  return ' – Family';
  }
}

/**
 * Resolve a CartLine to a full ResolvedCartLine for display.
 * Throws if the item is not found in the items array.
 */
export function resolveLine(line: CartLine, items: MenuItem[]): ResolvedCartLine {
  const item = findItem(line.itemId, items);
  if (!item) {
    throw new Error(`MenuItem not found: ${line.itemId}`);
  }

  const unitPrice = getVariantPrice(item, line.variantKey);
  const name = item.name + variantSuffix(line.variantKey);

  return {
    itemId: line.itemId,
    variantKey: line.variantKey,
    name,
    unitPrice,
    qty: line.qty,
    lineTotal: unitPrice * line.qty,
    image: item.image,
  };
}
