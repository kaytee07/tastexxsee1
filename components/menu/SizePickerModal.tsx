'use client';

import { useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { formatGhs, formatPriceForCard } from '@/lib/format';
import { useCart } from '@/lib/cart-context';
import { cn } from '@/lib/utils';
import type { MenuItem, VariantKey } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolvePrice(item: MenuItem, variant: VariantKey | null): number | null {
  const { price } = item;
  if (price.kind === 'single') return price.amount;
  if (!variant) return null;
  if (price.kind === 'range') return variant === 'min' ? price.min : price.max;
  const k = variant as 'regular' | 'medium' | 'large' | 'family';
  return k in price.sizes ? price.sizes[k] : null;
}

function variantLabel(key: VariantKey): string {
  switch (key) {
    case 'min':     return 'Small';
    case 'max':     return 'Large';
    case 'regular': return 'Regular';
    case 'medium':  return 'Medium';
    case 'large':   return 'Large';
    case 'family':  return 'Family';
    default:        return '';
  }
}

// ─── Size button — taller, two-line (name + price) ───────────────────────────

function SizeButton({
  sizeLabel,
  price,
  active,
  onClick,
}: {
  sizeLabel: string;
  price: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center gap-1 py-3 px-2',
        'border transition-all duration-150 cursor-pointer',
        'focus-visible:outline-2 focus-visible:outline-gold',
        active
          ? 'bg-gold border-gold text-ink'
          : 'bg-transparent border-gold-700 text-gold hover:border-gold'
      )}
      style={{ borderRadius: 0 }}
    >
      <span className={cn(
        'font-display italic text-base leading-none',
        active ? 'text-ink' : 'text-cream'
      )}>
        {sizeLabel}
      </span>
      <span className={cn(
        'font-sans text-[10px] tracking-wide',
        active ? 'text-ink/70' : 'text-gold-400'
      )}>
        {formatGhs(price)}
      </span>
    </button>
  );
}

// ─── Size grid — 2×2 for sized, 1×2 for range ────────────────────────────────

function SizeGrid({
  item,
  selected,
  onChange,
}: {
  item: MenuItem;
  selected: VariantKey | null;
  onChange: (k: VariantKey) => void;
}) {
  const { price } = item;
  if (price.kind === 'single') return null;

  if (price.kind === 'range') {
    return (
      <div className="grid grid-cols-2 gap-2">
        <SizeButton sizeLabel="Small" price={price.min} active={selected === 'min'} onClick={() => onChange('min')} />
        <SizeButton sizeLabel="Large" price={price.max} active={selected === 'max'} onClick={() => onChange('max')} />
      </div>
    );
  }

  // sized — always 2×2
  return (
    <div className="grid grid-cols-2 gap-2">
      <SizeButton sizeLabel="Regular" price={price.sizes.regular} active={selected === 'regular'} onClick={() => onChange('regular')} />
      <SizeButton sizeLabel="Medium"  price={price.sizes.medium}  active={selected === 'medium'}  onClick={() => onChange('medium')} />
      <SizeButton sizeLabel="Large"   price={price.sizes.large}   active={selected === 'large'}   onClick={() => onChange('large')} />
      <SizeButton sizeLabel="Family"  price={price.sizes.family}  active={selected === 'family'}  onClick={() => onChange('family')} />
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface SizePickerModalProps {
  item: MenuItem;
  onClose: () => void;
}

export function SizePickerModal({ item, onClose }: SizePickerModalProps) {
  const cart     = useCart();
  const isSingle = item.price.kind === 'single';

  // Pre-select first/cheapest size immediately so Add button is live on open
  const defaultVariant: VariantKey =
    item.price.kind === 'single'  ? 'default'  :
    item.price.kind === 'range'   ? 'min'       :
    'regular';

  const [selected, setSelected] = useState<VariantKey>(defaultVariant);
  const [imgErr,   setImgErr]   = useState(false);
  const [added,    setAdded]    = useState(false);

  // Image shown = per-size override if available, else base image
  const displayImg =
    item.variantImages?.[selected] ?? item.image;

  // Reset image error when image changes
  useEffect(() => { setImgErr(false); }, [displayImg]);

  // Escape + scroll lock
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); },
    [onClose]
  );
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const unitPrice = resolvePrice(item, selected);

  function handleAdd() {
    cart.add(item.id, selected);
    setAdded(true);
    setTimeout(() => {
      cart.open();
      onClose();
    }, 600);
  }

  const modal = (
    <motion.div
      key="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Panel */}
      <motion.div
        key="panel"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'relative z-10 bg-ink-800 w-full overflow-hidden',
          // Mobile: slides up from bottom, full width
          'max-h-[92vh]',
          // Desktop: centered, two-column, constrained
          'md:max-w-3xl md:flex md:flex-row'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center text-cream-200/50 hover:text-cream transition-colors duration-150 cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* ── LEFT — Image panel (~55% on desktop) ── */}
        <div className="relative w-full md:w-[55%] shrink-0 aspect-[4/3] md:aspect-auto md:self-stretch overflow-hidden bg-ink-700">
          <AnimatePresence mode="wait">
            <motion.div
              key={displayImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="absolute inset-0"
            >
              {!imgErr ? (
                <Image
                  src={displayImg}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className="object-cover"
                  onError={() => setImgErr(true)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display italic text-gold-700 text-5xl opacity-20">
                    {item.name.charAt(0)}
                  </span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Active size badge */}
          <AnimatePresence>
            {selected !== 'default' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="absolute bottom-4 left-4 z-10 bg-ink-800/85 backdrop-blur-sm px-3 py-1.5"
              >
                <span className="font-sans text-[10px] text-gold tracking-[0.35em] uppercase">
                  {variantLabel(selected)}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT — Content panel ── */}
        <div className="flex flex-col gap-5 p-5 md:p-7 overflow-y-auto flex-1">
          {/* Name */}
          <div className="flex flex-col gap-1 pr-8">
            <Eyebrow>
              {item.category === 'rice'      ? 'Rice'
              : item.category === 'banku'    ? 'Banku'
              : item.category === 'yam-chips' ? 'Yam Chips'
              : item.category === 'noodles'  ? 'Noodles'
              : 'Extras'}
            </Eyebrow>
            <h2 className="font-display italic text-cream text-xl md:text-2xl leading-snug">
              {item.name}
            </h2>
            {item.description && (
              <p className="font-sans text-sm text-cream-200/65 leading-relaxed mt-0.5">
                {item.description}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-gold-700/25" />

          {/* Size grid */}
          {!isSingle && (
            <div className="flex flex-col gap-3">
              <p className="font-sans text-[10px] text-cream-200/40 tracking-[0.35em] uppercase">
                Select size
              </p>
              <SizeGrid item={item} selected={selected} onChange={setSelected} />
            </div>
          )}

          {/* Live price */}
          <p className="font-sans text-gold font-medium text-xl tracking-wide">
            {unitPrice !== null ? formatGhs(unitPrice) : formatPriceForCard(item.price)}
          </p>

          <div className="flex-1" />

          {/* Add button */}
          <button
            type="button"
            onClick={handleAdd}
            disabled={added}
            className={cn(
              'w-full h-12 font-sans text-xs font-medium tracking-widest uppercase',
              'border transition-all duration-200 cursor-pointer disabled:cursor-not-allowed',
              added
                ? 'bg-transparent border-gold text-gold'
                : 'bg-gold border-gold text-ink hover:opacity-90'
            )}
            style={{ borderRadius: 0 }}
          >
            {added ? 'Added ✓' : 'Add to Order'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(
    <AnimatePresence>{modal}</AnimatePresence>,
    document.body
  );
}
