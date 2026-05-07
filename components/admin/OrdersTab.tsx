'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { formatGhs } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';

const STATUSES: OrderStatus[] = ['received', 'preparing', 'ready', 'completed'];
const STATUS_LABELS: Record<OrderStatus, string> = {
  received: 'Received',
  preparing: 'Preparing',
  ready: 'Ready',
  completed: 'Completed',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  received: 'text-gold border-gold/40',
  preparing: 'text-cream border-cream/40',
  ready: 'text-gold-200 border-gold-200/40',
  completed: 'text-cream-200/40 border-ink-600',
};

function StatusPill({
  status,
  current,
  onClick,
}: {
  status: OrderStatus;
  current: OrderStatus;
  onClick: () => void;
}) {
  const isActive = status === current;
  const isPast = STATUSES.indexOf(status) < STATUSES.indexOf(current);
  return (
    <button
      onClick={onClick}
      disabled={isPast}
      className={cn(
        'font-sans text-xs px-3 py-1.5 border transition-colors duration-150 disabled:cursor-default',
        isActive
          ? 'bg-gold text-ink border-gold'
          : isPast
          ? 'bg-transparent text-cream-200/30 border-ink-600'
          : 'bg-transparent text-gold border-gold hover:bg-gold/10'
      )}
    >
      {STATUS_LABELS[status]}
    </button>
  );
}

// ─── Expanded detail — shared between card and table row ─────────────────────

function OrderDetail({
  order,
  status,
  onAdvance,
}: {
  order: Order;
  status: OrderStatus;
  onAdvance: (s: OrderStatus) => void;
}) {
  return (
    <div className="flex flex-col gap-5 p-4 md:px-6 md:py-5 bg-ink-800">
      {/* Line items */}
      <div>
        <p className="font-sans text-xs text-gold uppercase mb-3" style={{ letterSpacing: '0.3em' }}>
          Items
        </p>
        <ul className="flex flex-col gap-1.5">
          {order.lines.map((line) => (
            <li
              key={`${line.itemId}-${line.variantKey}`}
              className="font-sans text-sm text-cream-200 flex justify-between"
            >
              <span>{line.name} × {line.qty}</span>
              <span className="text-cream">{formatGhs(line.lineTotal)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Customer info */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 font-sans text-sm">
        <span className="text-cream-200">Phone</span>
        <span className="text-cream">{order.phone}</span>
        <span className="text-cream-200">Type</span>
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
        {order.notes && (
          <>
            <span className="text-cream-200">Notes</span>
            <span className="text-cream">{order.notes}</span>
          </>
        )}
      </div>

      {/* Status advancement */}
      <div>
        <p className="font-sans text-xs text-gold uppercase mb-3" style={{ letterSpacing: '0.3em' }}>
          Update Status
        </p>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <StatusPill key={s} status={s} current={status} onClick={() => onAdvance(s)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Mobile card ──────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: Order }) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [expanded, setExpanded] = useState(false);

  async function advanceStatus(s: OrderStatus) {
    setStatus(s);
    await fetch(`/api/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: s }),
    });
  }

  return (
    <div className="border border-gold-700/20 bg-ink-700">
      {/* Card header — always visible */}
      <button
        className="w-full text-left px-4 py-4 flex items-start justify-between gap-3"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-sans text-base text-cream font-medium truncate">
            {order.customerName}
          </span>
          <span className="font-sans text-xs text-gold" style={{ letterSpacing: '0.15em' }}>
            {order.ref}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className="font-display text-cream text-lg leading-none">{formatGhs(order.total)}</span>
          <span className={cn('font-sans text-xs border px-2 py-0.5', STATUS_COLORS[status])}>
            {STATUS_LABELS[status]}
          </span>
        </div>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={cn('text-gold-700 flex-shrink-0 mt-1 transition-transform duration-200', expanded && 'rotate-180')}
        />
      </button>

      {/* Expandable detail */}
      {expanded && (
        <OrderDetail order={order} status={status} onAdvance={advanceStatus} />
      )}
    </div>
  );
}

// ─── Desktop table row ────────────────────────────────────────────────────────

function OrderRow({ order }: { order: Order }) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [expanded, setExpanded] = useState(false);

  async function advanceStatus(s: OrderStatus) {
    setStatus(s);
    await fetch(`/api/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: s }),
    });
  }

  return (
    <>
      <tr
        className="border-b border-ink-600 cursor-pointer hover:bg-ink-700/40 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="py-3 pr-4 font-sans text-xs text-gold">{order.ref}</td>
        <td className="py-3 pr-4 font-sans text-xs text-cream-200">
          {new Date(order.createdAt).toLocaleString('en-GB', {
            dateStyle: 'short',
            timeStyle: 'short',
          })}
        </td>
        <td className="py-3 pr-4 font-sans text-sm text-cream">{order.customerName}</td>
        <td className="py-3 pr-4 font-sans text-sm text-cream">{formatGhs(order.total)}</td>
        <td className="py-3">
          <span className={cn('font-sans text-xs border px-2 py-0.5', STATUS_COLORS[status])}>
            {STATUS_LABELS[status]}
          </span>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-ink-600">
          <td colSpan={5} className="p-0">
            <OrderDetail order={order} status={status} onAdvance={advanceStatus} />
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Tab export ───────────────────────────────────────────────────────────────

export function OrdersTab({ orders }: { orders: Order[] }) {
  if (!orders.length) {
    return (
      <div className="py-16 text-center">
        <p className="font-display italic text-cream-200 text-2xl">No orders yet.</p>
        <p className="font-sans text-xs text-cream-200/40 mt-2">Orders will appear here once customers place them.</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile: card list */}
      <div className="flex flex-col gap-2 md:hidden">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-gold-700/40">
              {['Ref', 'Time', 'Customer', 'Total', 'Status'].map((h) => (
                <th
                  key={h}
                  className="pb-3 text-left font-sans text-xs text-gold uppercase pr-4"
                  style={{ letterSpacing: '0.3em' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
