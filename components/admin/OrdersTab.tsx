'use client';

import { useState } from 'react';
import { formatGhs } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';

// ─── Status config ────────────────────────────────────────────────────────────

const STATUSES: OrderStatus[] = ['received', 'preparing', 'ready', 'completed'];

const STATUS_META: Record<OrderStatus, {
  label: string;
  next: OrderStatus | null;
  nextLabel: string | null;
  headerColor: string;
  badgeColor: string;
  dim: boolean;
}> = {
  received:  { label: 'Received',  next: 'preparing', nextLabel: 'Start Preparing', headerColor: 'text-gold border-gold/40',        badgeColor: 'bg-gold/10 text-gold border-gold/30',              dim: false },
  preparing: { label: 'Preparing', next: 'ready',     nextLabel: 'Mark Ready',      headerColor: 'text-cream border-cream/30',       badgeColor: 'bg-cream/5 text-cream border-cream/20',            dim: false },
  ready:     { label: 'Ready',     next: 'completed',  nextLabel: 'Complete Order',  headerColor: 'text-gold border-gold',            badgeColor: 'bg-gold/20 text-gold border-gold/50',              dim: false },
  completed: { label: 'Completed', next: null,         nextLabel: null,              headerColor: 'text-cream-200/30 border-ink-600', badgeColor: 'bg-transparent text-cream-200/30 border-ink-600',  dim: true  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function minutesOld(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
}

function timeAgo(iso: string): string {
  const diff = minutesOld(iso);
  if (diff < 1)  return 'just now';
  if (diff < 60) return `${diff}m ago`;
  const h = Math.floor(diff / 60);
  return `${h}h ${diff % 60}m ago`;
}

function clockTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function itemsSummary(order: Order): string {
  const first = order.lines[0]?.name ?? '';
  const rest  = order.lines.length - 1;
  return rest > 0 ? `${first} +${rest} more` : first;
}

// ─── Order card ───────────────────────────────────────────────────────────────

function OrderCard({
  order,
  onAdvance,
}: {
  order: Order;
  onAdvance: (id: string, status: OrderStatus) => void;
}) {
  const [expanded,   setExpanded]   = useState(false);
  const [confirming, setConfirming] = useState(false);

  const meta      = STATUS_META[order.status];
  const isUrgent  = (order.status === 'received' || order.status === 'preparing')
    && minutesOld(order.createdAt) > 15;

  function handleActionClick() {
    if (meta.next === 'completed') {
      // Completing fires irreversible SMS — require inline confirmation
      setConfirming(true);
    } else if (meta.next) {
      onAdvance(order.id, meta.next);
    }
  }

  function handleConfirm() {
    setConfirming(false);
    onAdvance(order.id, 'completed');
  }

  return (
    <div
      className={cn(
        'flex flex-col border transition-opacity duration-200',
        meta.dim
          ? 'border-gold-700/20 opacity-40 hover:opacity-70'
          : 'bg-ink-700 border-gold-700/20',
        isUrgent && 'border-amber-500/60 ring-1 ring-amber-500/30'
      )}
    >
      {/* Card header — always visible, click to expand */}
      <button
        type="button"
        className="w-full text-left px-4 py-3 flex flex-col gap-1.5"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-start justify-between gap-2">
          <span className="font-sans text-sm text-cream font-medium leading-snug">
            {order.customerName}
          </span>
          <span className="font-display text-base text-gold leading-none shrink-0">
            {formatGhs(order.total)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="font-sans text-[10px] text-gold tracking-[0.2em]">
            {order.ref}
          </span>
          <div className="flex items-center gap-1.5 font-sans text-[10px] text-cream-200/40 capitalize">
            <span>{order.orderType}</span>
            <span>·</span>
            <span>{clockTime(order.createdAt)}</span>
            <span>·</span>
            <span className={cn(isUrgent && 'text-amber-400 font-medium')}>
              {timeAgo(order.createdAt)}
            </span>
            {isUrgent && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            )}
          </div>
        </div>

        <p className="font-sans text-xs text-cream-200/60 line-clamp-1">
          {itemsSummary(order)}
        </p>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-3 flex flex-col gap-3 border-t border-gold-700/20 pt-3">
          <ul className="flex flex-col gap-1">
            {order.lines.map((line) => (
              <li
                key={`${line.itemId}-${line.variantKey}`}
                className="flex justify-between font-sans text-xs"
              >
                <span className="text-cream-200">{line.name} × {line.qty}</span>
                <span className="text-cream">{formatGhs(line.lineTotal)}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-0.5 font-sans text-xs">
            <span className="text-cream-200/60">{order.phone}</span>
            {order.address && (
              <span className="text-cream-200/60">{order.address}</span>
            )}
            {order.notes && (
              <span className="text-gold-400 italic">Note: {order.notes}</span>
            )}
          </div>
        </div>
      )}

      {/* Action / confirmation area */}
      {meta.next && (
        <div className="px-4 pb-3">
          {confirming ? (
            /* Inline confirm — sends irreversible SMS */
            <div className="flex flex-col gap-2 border border-gold/20 p-3 bg-ink-600">
              <p className="font-sans text-[10px] text-cream-200/70 leading-snug">
                This will send a completion SMS to the customer. Continue?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 h-8 font-sans text-[10px] font-medium tracking-widest uppercase bg-gold border border-gold text-ink hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ borderRadius: 0 }}
                >
                  Yes, Complete →
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="flex-1 h-8 font-sans text-[10px] font-medium tracking-widest uppercase border border-cream-200/20 text-cream-200/60 hover:text-cream-200 transition-colors cursor-pointer"
                  style={{ borderRadius: 0 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleActionClick}
              className="w-full h-8 font-sans text-[10px] font-medium tracking-widest uppercase bg-gold border border-gold text-ink hover:opacity-90 transition-opacity cursor-pointer"
              style={{ borderRadius: 0 }}
            >
              {meta.nextLabel} →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Kanban column ────────────────────────────────────────────────────────────

function KanbanColumn({
  status,
  orders,
  onAdvance,
  collapsed,
  onToggle,
}: {
  status: OrderStatus;
  orders: Order[];
  onAdvance: (id: string, status: OrderStatus) => void;
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  const meta       = STATUS_META[status];
  const isReady    = status === 'ready';
  const pulseReady = isReady && orders.length > 0;

  return (
    <div
      className={cn(
        'flex flex-col min-w-0 transition-all duration-300',
        pulseReady && 'ring-1 ring-gold/50'
      )}
    >
      {/* Column header */}
      <div
        className={cn(
          'flex items-center justify-between px-1 pb-3 mb-3 border-b',
          meta.headerColor,
          pulseReady && 'animate-pulse'
        )}
      >
        <span className="font-sans text-xs font-medium tracking-[0.25em] uppercase">
          {meta.label}
        </span>
        <div className="flex items-center gap-2">
          <span className={cn('font-sans text-[10px] px-2 py-0.5 border', meta.badgeColor)}>
            {orders.length}
          </span>
          {/* Completed column toggle */}
          {onToggle && (
            <button
              type="button"
              onClick={onToggle}
              className="font-sans text-[10px] text-cream-200/30 hover:text-cream-200/60 transition-colors cursor-pointer"
              title={collapsed ? 'Expand' : 'Collapse'}
            >
              {collapsed ? '▼' : '▲'}
            </button>
          )}
        </div>
      </div>

      {/* Order cards — hidden when collapsed */}
      {!collapsed && (
        <div className="flex flex-col gap-2">
          {orders.length === 0 ? (
            <p className="font-sans text-xs text-cream-200/25 text-center py-8">
              No orders
            </p>
          ) : (
            orders.map((order) => (
              <OrderCard key={order.id} order={order} onAdvance={onAdvance} />
            ))
          )}
        </div>
      )}

      {/* Collapsed placeholder */}
      {collapsed && orders.length > 0 && (
        <p className="font-sans text-xs text-cream-200/25 text-center py-4">
          {orders.length} order{orders.length !== 1 ? 's' : ''} — tap ▼ to expand
        </p>
      )}
    </div>
  );
}

// ─── Mobile tab view ──────────────────────────────────────────────────────────

function MobileView({
  grouped,
  onAdvance,
  completedExpanded,
  onToggleCompleted,
}: {
  grouped: Record<OrderStatus, Order[]>;
  onAdvance: (id: string, status: OrderStatus) => void;
  completedExpanded: boolean;
  onToggleCompleted: () => void;
}) {
  const [activeTab, setActiveTab] = useState<OrderStatus>('received');

  return (
    <div className="flex flex-col gap-0">
      {/* Tabs */}
      <div className="flex border-b border-gold-700/30 overflow-x-auto scrollbar-none">
        {STATUSES.map((s) => {
          const isActive = s === activeTab;
          const count    = grouped[s].length;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setActiveTab(s)}
              className={cn(
                'relative flex items-center gap-1.5 px-4 py-2.5 font-sans text-xs tracking-wide uppercase whitespace-nowrap transition-colors duration-150 cursor-pointer shrink-0',
                isActive ? 'text-gold' : 'text-cream-200/40 hover:text-cream-200/70'
              )}
              style={{ borderRadius: 0 }}
            >
              {STATUS_META[s].label}
              {count > 0 && (
                <span className={cn(
                  'font-sans text-[9px] px-1.5 py-0.5 border',
                  isActive ? STATUS_META[s].badgeColor : 'text-cream-200/30 border-ink-600'
                )}>
                  {count}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-px bg-gold" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active column */}
      <div className="pt-4">
        <KanbanColumn
          status={activeTab}
          orders={grouped[activeTab]}
          onAdvance={onAdvance}
          collapsed={activeTab === 'completed' ? !completedExpanded : false}
          onToggle={activeTab === 'completed' ? onToggleCompleted : undefined}
        />
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function OrdersTab({
  orders,
  onAdvance,
}: {
  orders: Order[];
  onAdvance: (id: string, status: OrderStatus) => void;
}) {
  const [search,            setSearch]            = useState('');
  const [completedExpanded, setCompletedExpanded] = useState(false);

  if (orders.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-display italic text-cream-200 text-2xl">No orders yet.</p>
        <p className="font-sans text-xs text-cream-200/40 mt-2">
          Orders will appear here once customers place them.
        </p>
      </div>
    );
  }

  // Filter by search query (name or ref, case-insensitive)
  const q = search.trim().toLowerCase();
  const filtered = q
    ? orders.filter(
        (o) =>
          o.customerName.toLowerCase().includes(q) ||
          o.ref.toLowerCase().includes(q)
      )
    : orders;

  const grouped = STATUSES.reduce((acc, s) => {
    acc[s] = filtered.filter((o) => o.status === s);
    return acc;
  }, {} as Record<OrderStatus, Order[]>);

  return (
    <>
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or order ref…"
          className="w-full md:w-72 bg-ink-700 border border-gold-700/30 px-4 py-2 font-sans text-sm text-cream placeholder:text-cream-200/30 focus:outline-none focus:border-gold/50 transition-colors duration-150"
          style={{ borderRadius: 0 }}
        />
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <MobileView
          grouped={grouped}
          onAdvance={onAdvance}
          completedExpanded={completedExpanded}
          onToggleCompleted={() => setCompletedExpanded((v) => !v)}
        />
      </div>

      {/* Desktop — 4-column Kanban */}
      <div className="hidden md:grid grid-cols-4 gap-4">
        {STATUSES.map((s) => (
          <KanbanColumn
            key={s}
            status={s}
            orders={grouped[s]}
            onAdvance={onAdvance}
            collapsed={s === 'completed' ? !completedExpanded : false}
            onToggle={s === 'completed' ? () => setCompletedExpanded((v) => !v) : undefined}
          />
        ))}
      </div>
    </>
  );
}
