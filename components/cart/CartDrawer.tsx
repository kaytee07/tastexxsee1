'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatGhs } from '@/lib/format';
import type { ResolvedCartLine } from '@/types';

// ─── Line item ────────────────────────────────────────────────────────────────

function CartLineRow({ line }: { line: ResolvedCartLine }) {
  const cart = useCart();
  const [imageError, setImageError] = useState(false);

  return (
    <li className="flex items-start gap-3 py-4 border-b border-gold-700/20">
      {/* Thumbnail */}
      <div className="relative w-12 h-12 flex-shrink-0 bg-ink-700 overflow-hidden">
        {!imageError ? (
          <Image
            src={line.image}
            alt={line.name}
            fill
            sizes="48px"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display italic text-gold text-base opacity-60">
              {line.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Name + controls */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <p className="font-sans text-xs text-cream leading-snug">{line.name}</p>

        <div className="flex items-center gap-3">
          {/* Qty controls */}
          <div className="flex items-center gap-0 border border-gold-700/50">
            <button
              onClick={() => cart.decrement(line.itemId, line.variantKey)}
              aria-label="Decrease quantity"
              className="w-7 h-7 flex items-center justify-center text-gold hover:bg-ink-600 transition-colors"
            >
              <Minus size={12} strokeWidth={1.5} />
            </button>
            <span className="w-7 text-center font-sans text-xs text-cream">
              {line.qty}
            </span>
            <button
              onClick={() => cart.increment(line.itemId, line.variantKey)}
              aria-label="Increase quantity"
              className="w-7 h-7 flex items-center justify-center text-gold hover:bg-ink-600 transition-colors"
            >
              <Plus size={12} strokeWidth={1.5} />
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => cart.remove(line.itemId, line.variantKey)}
            aria-label={`Remove ${line.name}`}
            className="text-gold-700 hover:text-gold transition-colors"
          >
            <Trash2 size={13} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Line total */}
      <p className="font-sans text-xs text-gold flex-shrink-0 pt-0.5">
        {formatGhs(line.lineTotal)}
      </p>
    </li>
  );
}

// ─── Drawer ───────────────────────────────────────────────────────────────────

export function CartDrawer() {
  const cart = useCart();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (cart.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [cart.isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') cart.close();
    }
    if (cart.isOpen) {
      document.addEventListener('keydown', handleKey);
    }
    return () => document.removeEventListener('keydown', handleKey);
  }, [cart.isOpen, cart.close]);

  return (
    <AnimatePresence>
      {cart.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm"
            onClick={cart.close}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="cart-panel"
            role="dialog"
            aria-label="Your order"
            aria-modal="true"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-50 flex flex-col w-full sm:w-[420px] bg-ink-800 border-l border-gold-700/30"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gold-700/30">
              <span className="font-sans text-xs text-gold tracking-[0.4em] uppercase font-medium">
                Your Order
              </span>
              <button
                onClick={cart.close}
                aria-label="Close cart"
                className="text-cream-200 hover:text-cream transition-colors"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Content */}
            {cart.resolvedLines.length === 0 ? (
              /* Empty state */
              <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 text-center">
                <p className="font-display italic text-cream text-2xl leading-snug">
                  Your order is empty.
                </p>
                <p className="font-sans text-sm text-cream-200/60">
                  The menu awaits.
                </p>
                <Link
                  href="/menu"
                  onClick={cart.close}
                  className="font-sans text-xs text-gold tracking-widest uppercase border border-gold-700 px-6 py-3 hover:border-gold transition-colors"
                >
                  Browse Menu
                </Link>
              </div>
            ) : (
              <>
                {/* Lines */}
                <ul className="flex-1 overflow-y-auto px-6 py-2 scrollbar-thin">
                  {cart.resolvedLines.map((line) => (
                    <CartLineRow
                      key={`${line.itemId}::${line.variantKey}`}
                      line={line}
                    />
                  ))}
                </ul>

                {/* Footer */}
                <div className="px-6 py-5 border-t border-gold-700/30 flex flex-col gap-4">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs text-cream-200 tracking-wide uppercase">
                      Subtotal
                    </span>
                    <span className="font-display text-xl text-gold">
                      {formatGhs(cart.subtotal)}
                    </span>
                  </div>

                  {/* Place order */}
                  <Link
                    href="/checkout"
                    onClick={cart.close}
                    className="w-full h-[52px] flex items-center justify-center font-sans text-sm font-medium tracking-widest uppercase bg-gold text-ink hover:opacity-90 transition-opacity"
                  >
                    Place Order
                  </Link>

                  {/* Clear cart */}
                  <button
                    type="button"
                    onClick={cart.clear}
                    className="font-sans text-xs text-gold-700 hover:text-gold transition-colors text-center tracking-wide uppercase"
                  >
                    Clear order
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
