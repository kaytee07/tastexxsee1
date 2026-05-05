'use client';

import { useCart } from '@/lib/cart-context';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { formatGhs } from '@/lib/format';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Divider } from '@/components/ui/Divider';
import Image from 'next/image';

export default function CheckoutPage() {
  const cart = useCart();

  if (!cart.resolvedLines.length) {
    return (
      <div className="min-h-screen bg-ink flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-display italic text-cream text-4xl">Your cart is empty.</h1>
        <a href="/menu" className="font-sans text-sm text-gold hover:underline">
          Back to the menu →
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 lg:gap-24">
        {/* Left: form */}
        <div>
          <Eyebrow>Almost there</Eyebrow>
          <h1 className="font-display text-cream mt-3 mb-10 leading-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            Place your <em className="italic text-gold">order.</em>
          </h1>
          <CheckoutForm />
        </div>

        {/* Right: order summary */}
        <aside className="flex flex-col gap-6 lg:pt-28">
          <Eyebrow>Order Summary</Eyebrow>
          <Divider />
          <ul className="flex flex-col gap-5">
            {cart.resolvedLines.map((line) => (
              <li key={`${line.itemId}-${line.variantKey}`} className="flex items-start gap-4">
                <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden bg-ink-800">
                  <Image
                    src={line.image}
                    alt={line.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm text-cream leading-snug">{line.name}</p>
                  <p className="font-sans text-xs text-cream-200 mt-0.5">× {line.qty}</p>
                </div>
                <p className="font-sans text-sm text-cream flex-shrink-0">
                  {formatGhs(line.lineTotal)}
                </p>
              </li>
            ))}
          </ul>
          <Divider />
          <div className="flex justify-between items-center">
            <span className="font-sans text-sm text-cream-200">Total</span>
            <span className="font-display text-cream text-2xl">{formatGhs(cart.subtotal)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
