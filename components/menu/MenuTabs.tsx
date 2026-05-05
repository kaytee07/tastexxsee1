'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { menuItems } from '@/lib/menu-data';
import { DishCard } from '@/components/menu/DishCard';
import { SearchBar } from '@/components/menu/SearchBar';
import type { CategoryId, SubGroupId, MenuItem } from '@/types';

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS: { id: CategoryId; label: string }[] = [
  { id: 'rice', label: 'Rice' },
  { id: 'banku', label: 'Banku' },
  { id: 'yam-chips', label: 'Yam Chips' },
  { id: 'noodles', label: 'Noodles' },
  { id: 'extras', label: 'Extras' },
];

const RICE_SUBGROUPS: { id: SubGroupId; label: string }[] = [
  { id: 'plain-rice', label: 'Plain Rice' },
  { id: 'thai-fried-rice', label: 'Thai Fried Rice' },
  { id: 'spicy-jollof-rice', label: 'Spicy Jollof Rice' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function DishGrid({ items }: { items: MenuItem[] }) {
  if (items.length === 0) {
    return (
      <p className="font-sans text-sm text-cream-200/50 py-12 text-center col-span-full">
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

function RiceTabContent({ search }: { search: string }) {
  const lower = search.toLowerCase();

  return (
    <div className="flex flex-col gap-10">
      {RICE_SUBGROUPS.map(({ id, label }) => {
        const items = menuItems.filter(
          (item) =>
            item.category === 'rice' &&
            item.subGroup === id &&
            (lower === '' || item.name.toLowerCase().includes(lower))
        );
        if (items.length === 0 && lower !== '') return null;
        return (
          <section key={id}>
            <h3 className="font-display italic text-gold text-2xl mb-6 pb-2 border-b border-gold-700/40">
              {label}
            </h3>
            <DishGrid items={items} />
          </section>
        );
      })}
    </div>
  );
}

function GenericTabContent({
  category,
  search,
}: {
  category: CategoryId;
  search: string;
}) {
  const lower = search.toLowerCase();
  const items = menuItems.filter(
    (item) =>
      item.category === category &&
      (lower === '' || item.name.toLowerCase().includes(lower))
  );

  return <DishGrid items={items} />;
}

// ─── Main component ───────────────────────────────────────────────────────────

interface MenuTabsProps {
  initialTab?: string;
}

export function MenuTabs({ initialTab = 'rice' }: MenuTabsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paramTab = searchParams.get('tab') ?? initialTab;
  const validTab = TABS.find((t) => t.id === paramTab)?.id ?? 'rice';

  const [activeTab, setActiveTab] = useState<CategoryId>(validTab as CategoryId);
  const [search, setSearch] = useState('');

  function handleTabChange(id: CategoryId) {
    setActiveTab(id);
    setSearch('');
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', id);
    router.replace(`/menu?${params.toString()}`, { scroll: false });
  }

  const contentKey = useMemo(() => activeTab, [activeTab]);

  return (
    <div className="flex flex-col gap-0">
      {/* Tab bar + search */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8 border-b border-gold-700/40 pb-0">
        {/* Tabs */}
        <div className="flex items-end gap-0 overflow-x-auto scrollbar-none">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`
                  relative px-4 py-3 font-sans text-sm font-medium tracking-wide uppercase
                  transition-colors duration-200 whitespace-nowrap cursor-pointer
                  ${isActive ? 'text-gold' : 'text-cream-200/60 hover:text-cream-200'}
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

        {/* Search bar */}
        <SearchBar
          value={search}
          onChange={setSearch}
          className="sm:ml-auto sm:w-52 pb-3"
        />
      </div>

      {/* Tab content with cross-fade */}
      <div className="pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={contentKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {activeTab === 'rice' ? (
              <RiceTabContent search={search} />
            ) : (
              <GenericTabContent category={activeTab} search={search} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
