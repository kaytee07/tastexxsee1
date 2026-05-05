'use client';

import { useState } from 'react';
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
        'font-sans text-xs px-3 py-1 border transition-colors duration-150 disabled:cursor-default',
        isActive
          ? 'bg-gold text-ink border-gold'
          : isPast
          ? 'bg-transparent text-cream-200/40 border-ink-600'
          : 'bg-transparent text-gold border-gold hover:bg-gold/10'
      )}
    >
      {STATUS_LABELS[status]}
    </button>
  );
}

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
          {new Date(order.createdAt).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}
        </td>
        <td className="py-3 pr-4 font-sans text-sm text-cream">{order.customerName}</td>
        <td className="py-3 pr-4 font-sans text-sm text-cream">{formatGhs(order.total)}</td>
        <td className="py-3">
          <span className="font-sans text-xs text-gold border border-gold/40 px-2 py-0.5">
            {STATUS_LABELS[status]}
          </span>
        </td>
      </tr>

      {expanded && (
        <tr className="border-b border-ink-600 bg-ink-800">
          <td colSpan={5} className="px-4 py-5">
            <div className="flex flex-col gap-5">
              {/* Line items */}
              <div>
                <p className="font-sans text-xs text-gold uppercase mb-3" style={{ letterSpacing: '0.3em' }}>
                  Items
                </p>
                <ul className="flex flex-col gap-1.5">
                  {order.lines.map((line) => (
                    <li key={`${line.itemId}-${line.variantKey}`} className="font-sans text-sm text-cream-200 flex justify-between max-w-md">
                      <span>{line.name} × {line.qty}</span>
                      <span className="text-cream">{formatGhs(line.lineTotal)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Customer info */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 max-w-md font-sans text-sm">
                <span className="text-cream-200">Phone</span><span className="text-cream">{order.phone}</span>
                <span className="text-cream-200">Type</span><span className="text-cream capitalize">{order.orderType}</span>
                {order.address && <><span className="text-cream-200">Address</span><span className="text-cream">{order.address}</span></>}
                <span className="text-cream-200">Payment</span><span className="text-cream capitalize">{order.paymentMethod === 'momo' ? `MoMo (${order.momoProvider})` : 'Cash'}</span>
                {order.notes && <><span className="text-cream-200">Notes</span><span className="text-cream">{order.notes}</span></>}
              </div>

              {/* Status advancement */}
              <div>
                <p className="font-sans text-xs text-gold uppercase mb-3" style={{ letterSpacing: '0.3em' }}>
                  Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <StatusPill
                      key={s}
                      status={s}
                      current={status}
                      onClick={() => advanceStatus(s)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function OrdersTab({ orders }: { orders: Order[] }) {
  if (!orders.length) {
    return (
      <p className="font-sans text-cream-200 text-sm">No orders yet.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-gold-700/40">
            {['Ref', 'Time', 'Customer', 'Total', 'Status'].map((h) => (
              <th key={h} className="pb-3 text-left font-sans text-xs text-gold uppercase pr-4" style={{ letterSpacing: '0.3em' }}>
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
  );
}
