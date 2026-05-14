'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { menuItems } from '@/lib/menu-data';
import { DishCard } from '@/components/menu/DishCard';
import type { CategoryId, SubGroupId, MenuItem } from '@/types';

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS: { id: CategoryId; label: string }[] = [
  { id: 'rice',      label: 'Rice' },
  { id: 'banku',     label: 'Banku' },
  { id: 'yam-chips', label: 'Yam Chips' },
  { id: 'noodles',   label: 'Noodles' },
  { id: 'extras',    label: 'Extras' },
];

const RICE_SUBGROUPS: { id: SubGroupId; label: string }[] = [
  { id: 'plain-rice',        label: 'Plain Rice' },
  { id: 'thai-fried-rice',   label: 'Thai Fried Rice' },
  { id: 'spicy-jollof-rice', label: 'Spicy Jollof Rice' },
];

// ─── Section header — editorial, full-width gold rule ─────────────────────────

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-6 mb-6">
      <h3 className="font-display italic text-gold text-2xl leading-none shrink-0">
        {label}
      </h3>
      <div className="flex-1 h-px bg-gold-700/40" />
    </div>
  );
}

// ─── Dish grid ────────────────────────────────────────────────────────────────

function DishGrid({ items }: { items: MenuItem[] }) {
  if (items.length === 0) {
    return (
      <p className="font-sans text-sm text-cream-200/40 py-10 text-center col-span-full">
        No dishes found.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink-600">
      {items.map((item) => (
        <DishCard key={item.id} item={item} />
      ))}
    </div>
  );
}

// ─── Rice tab — three editorial sections ─────────────────────────────────────

function RiceTabContent() {
  return (
    <div className="flex flex-col gap-14">
      {RICE_SUBGROUPS.map(({ id, label }) => {
        const items = menuItems.filter(
          (item) => item.category === 'rice' && item.subGroup === id
        );
        return (
          <section key={id}>
            <SectionHeader label={label} />
            <DishGrid items={items} />
          </section>
        );
      })}
    </div>
  );
}

// ─── Generic tab ─────────────────────────────────────────────────────────────

function GenericTabContent({ category }: { category: CategoryId }) {
  const items = menuItems.filter((item) => item.category === category);
  return <DishGrid items={items} />;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface MenuTabsProps {
  initialTab?: string;
}

export function MenuTabs({ initialTab = 'rice' }: MenuTabsProps) {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const paramTab = searchParams.get('tab') ?? initialTab;
  const validTab = TABS.find((t) => t.id === paramTab)?.id ?? 'rice';

  const [activeTab, setActiveTab] = useState<CategoryId>(validTab as CategoryId);

  function handleTabChange(id: CategoryId) {
    setActiveTab(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', id);
    router.replace(`/menu?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-0">
      {/* Tab bar */}
      <div className="flex items-end overflow-x-auto scrollbar-none border-b border-gold-700/40">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`
                relative px-5 py-3 font-sans text-sm font-medium tracking-wide uppercase
                transition-colors duration-200 whitespace-nowrap cursor-pointer
                ${isActive ? 'text-gold' : 'text-cream-200/50 hover:text-cream-200'}
              `}
              style={{ borderRadius: 0 }}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-px bg-gold"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="pt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
          >
            {activeTab === 'rice' ? (
              <RiceTabContent />
            ) : (
              <GenericTabContent category={activeTab} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
