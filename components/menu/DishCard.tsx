'use client';

import { useState } from 'react';
import Image from 'next/image';
import { SizePickerModal } from '@/components/menu/SizePickerModal';
import { formatPriceForCard } from '@/lib/format';
import { useCart } from '@/lib/cart-context';
import { cn } from '@/lib/utils';
import type { MenuItem } from '@/types';

interface DishCardProps {
  item: MenuItem;
}

export function DishCard({ item }: DishCardProps) {
  const cart = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [imgErr, setImgErr]       = useState(false);

  const isSingle = item.price.kind === 'single';

  function handleDirectAdd(e: React.MouseEvent) {
    e.stopPropagation();
    cart.add(item.id, 'default');
    cart.open();
  }

  return (
    <>
      <article
        role={isSingle ? undefined : 'button'}
        tabIndex={isSingle ? undefined : 0}
        onClick={isSingle ? undefined : () => setModalOpen(true)}
        onKeyDown={isSingle ? undefined : (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setModalOpen(true);
          }
        }}
        className={cn(
          'group relative flex flex-col bg-ink-800',
          !isSingle && 'cursor-pointer'
        )}
      >
        {/* Hover gold ring */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-1 ring-gold-700 z-10" />

        {/* Image — 4:3 ratio (more editorial, shows dish depth) */}
        <div className="relative aspect-[4/3] overflow-hidden bg-ink-700">
          {!imgErr ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display italic text-gold-700 text-3xl opacity-30">
                {item.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Card content */}
        <div className="flex flex-col p-4 gap-2">
          <h3 className="font-display italic text-cream text-lg leading-snug">
            {item.name}
          </h3>
          <p className="font-sans text-xs text-gold-400 tracking-wide">
            {formatPriceForCard(item.price)}
          </p>

          {/* CTA */}
          {isSingle ? (
            <button
              type="button"
              onClick={handleDirectAdd}
              className="mt-2 w-full h-9 font-sans text-xs font-medium tracking-widest uppercase bg-gold border border-gold text-ink hover:opacity-90 transition-opacity duration-200 cursor-pointer"
              style={{ borderRadius: 0 }}
            >
              Add to Order
            </button>
          ) : (
            /* Subtle hint — whole card is the click target */
            <p className="font-sans text-[10px] text-gold-700 tracking-[0.25em] uppercase mt-1 group-hover:text-gold transition-colors duration-200">
              Select Size →
            </p>
          )}
        </div>
      </article>

      {modalOpen && (
        <SizePickerModal item={item} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
