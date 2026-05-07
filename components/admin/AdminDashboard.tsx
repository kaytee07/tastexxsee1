'use client';

import { useState } from 'react';
import { OrdersTab } from '@/components/admin/OrdersTab';
import { InquiriesTab } from '@/components/admin/InquiriesTab';
import type { Order, CateringInquiry } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  orders: Order[];
  inquiries: CateringInquiry[];
}

const TABS = ['Orders', 'Catering Inquiries'] as const;

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-ink-700 p-4 md:p-5 flex flex-col gap-1 border border-gold-700/20">
      <span
        className="font-sans text-xs uppercase text-gold-700"
        style={{ letterSpacing: '0.3em' }}
      >
        {label}
      </span>
      <span
        className={cn(
          'font-display leading-none mt-1',
          accent ? 'text-gold' : 'text-cream',
          'text-4xl'
        )}
      >
        {value}
      </span>
      {sub && (
        <span className="font-sans text-xs text-cream-200/60 mt-0.5">{sub}</span>
      )}
    </div>
  );
}

export function AdminDashboard({ orders, inquiries }: Props) {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('Orders');

  const activeOrders = orders.filter((o) => o.status !== 'completed').length;
  const pendingInquiries = inquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="max-w-[1280px] mx-auto">
      {/* Page header */}
      <div className="mb-8 pb-6 border-b border-gold-700/30">
        <h1 className="font-display italic text-cream text-3xl md:text-4xl leading-none">Dashboard</h1>
        <p className="font-sans text-xs text-cream-200/50 mt-2 uppercase hidden sm:block" style={{ letterSpacing: '0.3em' }}>
          TastexxSee Restaurant — Order Management
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gold-700/10 mb-8">
        <StatCard label="Total Orders" value={orders.length} />
        <StatCard label="Active Orders" value={activeOrders} sub="not yet completed" accent />
        <StatCard label="Inquiries" value={inquiries.length} />
        <StatCard label="Pending Inquiries" value={pendingInquiries} sub="awaiting response" accent />
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-gold-700/40 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'font-sans text-sm px-4 pb-3 border-b-2 transition-colors duration-200 -mb-px',
              activeTab === tab
                ? 'border-gold text-cream'
                : 'border-transparent text-cream-200 hover:text-cream'
            )}
          >
            {tab}
            <span className="ml-2 text-xs text-gold-400">
              ({tab === 'Orders' ? orders.length : inquiries.length})
            </span>
          </button>
        ))}
      </div>

      {activeTab === 'Orders' ? (
        <OrdersTab orders={orders} />
      ) : (
        <InquiriesTab inquiries={inquiries} />
      )}
    </div>
  );
}
