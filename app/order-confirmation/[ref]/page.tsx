import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { formatGhs } from '@/lib/format';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Divider } from '@/components/ui/Divider';
import type { ResolvedCartLine } from '@/types';

export const metadata: Metadata = {
  title: 'Order Confirmed — TastexxSee',
  robots: 'noindex',
};

interface Props {
  params: Promise<{ ref: string }>;
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { ref } = await params;

  let order;
  try {
    order = await prisma.order.findUnique({ where: { ref } });
  } catch {
    // DB not connected yet (e.g. no DATABASE_URL in dev) — show a generic confirmation
    order = null;
  }

  if (!order) {
    // If DB is not set up, show a placeholder confirmation page
    return (
      <div className="min-h-screen bg-ink flex flex-col items-center justify-center gap-6 px-6 text-center">
        <Eyebrow>Order Received</Eyebrow>
        <h1 className="font-display italic text-cream" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
          {ref}
        </h1>
        <p className="font-sans text-cream-200 max-w-md">
          We&apos;ve received your order. The restaurant will call you within 10 minutes to confirm.
          Estimated delivery: 30–45 minutes.
        </p>
        <a href="/menu" className="font-sans text-sm text-gold hover:underline">
          Place another order →
        </a>
      </div>
    );
  }

  const lines = order.lines as unknown as ResolvedCartLine[];

  return (
    <div className="min-h-screen bg-ink py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-[680px] mx-auto">
        <Eyebrow>Order Confirmed</Eyebrow>

        <h1
          className="font-display text-cream mt-3 mb-2 leading-tight"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
        >
          {order.ref}
        </h1>

        <p className="font-sans text-cream-200 mb-10">
          We&apos;ve received your order. The restaurant will call you within 10 minutes to confirm.
          Estimated delivery: 30–45 minutes.
        </p>

        <Divider />

        {/* Order details */}
        <div className="my-10 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2 font-sans text-sm">
            <span className="text-cream-200">Customer</span>
            <span className="text-cream">{order.customerName}</span>
            <span className="text-cream-200">Phone</span>
            <span className="text-cream">{order.phone}</span>
            <span className="text-cream-200">Order type</span>
            <span className="text-cream capitalize">{order.orderType}</span>
            {order.address && (
              <>
                <span className="text-cream-200">Address</span>
                <span className="text-cream">{order.address}</span>
              </>
            )}
            <span className="text-cream-200">Payment</span>
            <span className="text-cream">
              {order.orderType === 'delivery' ? 'Cash on Delivery' : 'Cash on Pickup'}
            </span>
          </div>
        </div>

        <Divider />

        {/* Line items */}
        <ul className="my-10 flex flex-col gap-4">
          {lines.map((line) => (
            <li
              key={`${line.itemId}-${line.variantKey}`}
              className="flex justify-between font-sans text-sm"
            >
              <span className="text-cream-200">
                {line.name} × {line.qty}
              </span>
              <span className="text-cream">{formatGhs(line.lineTotal)}</span>
            </li>
          ))}
        </ul>

        <Divider />

        <div className="mt-6 flex justify-between items-center">
          <span className="font-sans text-sm text-cream-200">Total</span>
          <span className="font-display text-cream text-2xl">{formatGhs(order.total)}</span>
        </div>

        <div className="mt-16">
          <a href="/menu" className="font-sans text-sm text-gold hover:underline">
            Place another order →
          </a>
        </div>
      </div>
    </div>
  );
}
