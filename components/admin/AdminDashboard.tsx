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

export function AdminDashboard({ orders, inquiries }: Props) {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('Orders');

  return (
    <div className="max-w-[1280px] mx-auto">
      <h1 className="font-display italic text-cream text-3xl mb-8">Dashboard</h1>

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
