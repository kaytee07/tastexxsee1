'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { PriceVariantPicker } from '@/components/menu/PriceVariantPicker';
import { formatPriceForCard } from '@/lib/format';
import { useCart } from '@/lib/cart-context';
import { cn } from '@/lib/utils';
import type { MenuItem, VariantKey } from '@/types';

const CATEGORY_LABELS: Record<string, string> = {
  rice: 'Rice',
  banku: 'Banku',
  'yam-chips': 'Yam Chips',
  noodles: 'Noodles',
  extras: 'Extras',
};

interface DishCardProps {
  item: MenuItem;
}

export function DishCard({ item }: DishCardProps) {
  const cart = useCart();
  const [selectedVariant, setSelectedVariant] = useState<VariantKey | null>(
    null
  );
  const [imageError, setImageError] = useState(false);

  const isSingle = item.price.kind === 'single';
  const canAdd = isSingle || selectedVariant !== null;

  function handleAdd() {
    if (!canAdd) return;
    cart.add(item.id, selectedVariant ?? 'default');
    cart.open();
  }

  return (
    <article
      className={cn(
        'group relative flex flex-col bg-ink-800 transition-all duration-300',
        'hover:shadow-[0_0_0_1px_var(--color-gold-700)] hover:shadow-gold-700'
      )}
      style={{
        boxShadow: undefined,
      }}
    >
      {/* Hover border via outline approach */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-1 ring-gold-700 z-10" />

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-ink-700">
        {!imageError ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display italic text-gold-700 text-lg opacity-40">
              {item.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Text content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex flex-col gap-1">
          <Eyebrow>{CATEGORY_LABELS[item.category] ?? item.category}</Eyebrow>
          <h3 className="font-display text-xl text-cream leading-snug">
            {item.name}
          </h3>
          {item.description && (
            <p className="font-sans text-sm text-cream-200 leading-relaxed line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        {/* Price summary */}
        <p className="font-sans text-xs text-gold-400 tracking-wide">
          {formatPriceForCard(item.price)}
        </p>

        {/* Variant picker */}
        {item.price.kind !== 'single' && (
          <PriceVariantPicker
            price={item.price}
            selected={selectedVariant}
            onChange={setSelectedVariant}
          />
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Add to order button */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          className={cn(
            'w-full h-10 font-sans text-xs font-medium tracking-widest uppercase transition-all duration-200 cursor-pointer',
            'border disabled:opacity-40 disabled:cursor-not-allowed',
            canAdd
              ? 'bg-gold border-gold text-ink hover:opacity-90'
              : 'bg-transparent border-gold-700 text-gold'
          )}
          style={{ borderRadius: 0 }}
        >
          Add to Order
        </button>
      </div>
    </article>
  );
}
