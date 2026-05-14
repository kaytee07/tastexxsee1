'use client';

import { useState, useCallback } from 'react';
import { OrdersTab } from '@/components/admin/OrdersTab';
import { InquiriesTab } from '@/components/admin/InquiriesTab';
import type { Order, CateringInquiry, OrderStatus } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  orders: Order[];
  inquiries: CateringInquiry[];
}

const TABS = ['Orders', 'Catering Inquiries'] as const;
const ORDER_STATUSES: OrderStatus[] = ['received', 'preparing', 'ready', 'completed'];

export function AdminDashboard({ orders: initialOrders, inquiries }: Props) {
  const [activeTab, setActiveTab]   = useState<typeof TABS[number]>('Orders');
  const [liveOrders, setLiveOrders] = useState<Order[]>(initialOrders);
  const [lastRefreshed]             = useState<Date>(() => new Date());

  // ── Lifted order advance (optimistic + rollback) ────────────────────────────
  const handleAdvance = useCallback(async (id: string, newStatus: OrderStatus) => {
    setLiveOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );

    const res = await fetch(`/api/orders/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      setLiveOrders((prev) =>
        prev.map((o) => {
          if (o.id !== id) return o;
          const prevStatus = ORDER_STATUSES[ORDER_STATUSES.indexOf(newStatus) - 1];
          return { ...o, status: prevStatus };
        })
      );
    }
  }, []);

  const pendingInquiries = inquiries.filter((i) => i.status === 'new').length;

  const headerDate    = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const refreshedTime = lastRefreshed.toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="max-w-[1280px] mx-auto">
      {/* Page header */}
      <div className="mb-8 pb-6 border-b border-gold-700/30">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display italic text-cream text-3xl md:text-4xl leading-none">
              Dashboard
            </h1>
            <p
              className="font-sans text-[10px] text-cream-200/40 mt-1.5 uppercase"
              style={{ letterSpacing: '0.3em' }}
            >
              {headerDate}
            </p>
          </div>

          {/* Refresh — compact, unobtrusive */}
          <div className="flex items-center gap-3 self-start mt-1">
            <span className="font-sans text-[10px] text-cream-200/30">
              as of {refreshedTime}
            </span>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="font-sans text-[10px] uppercase tracking-widest text-gold/60 border border-gold/20 px-3 py-1 hover:text-gold hover:border-gold/40 transition-colors duration-150 cursor-pointer"
              style={{ borderRadius: 0 }}
            >
              Refresh ↺
            </button>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-gold-700/40 mb-8">
        {TABS.map((tab) => {
          const count      = tab === 'Orders' ? liveOrders.length : pendingInquiries;
          const showCount  = tab === 'Orders' || pendingInquiries > 0;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'font-sans text-sm px-4 pb-3 border-b-2 transition-colors duration-200 -mb-px cursor-pointer',
                activeTab === tab
                  ? 'border-gold text-cream'
                  : 'border-transparent text-cream-200/60 hover:text-cream'
              )}
            >
              {tab}
              {showCount && (
                <span className="ml-2 text-xs text-gold-400">({count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'Orders' ? (
        <OrdersTab orders={liveOrders} onAdvance={handleAdvance} />
      ) : (
        <InquiriesTab inquiries={inquiries} />
      )}
    </div>
  );
}
