import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { MenuTabs } from '@/components/menu/MenuTabs';

export const metadata: Metadata = {
  title: 'Menu — TasteXXSee',
  description: 'Explore our Ghanaian local plates and Asian-influenced rice and noodle dishes.',
};

interface MenuPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const { tab } = await searchParams;

  return (
    <>
      {/* Hero band */}
      <div className="bg-ink-800 border-b border-gold-700/30">
        <PageWrapper className="py-16 md:py-20">
          <div className="flex flex-col gap-3">
            <span className="font-sans text-xs text-gold tracking-[0.4em] uppercase font-medium">
              TasteXXSee
            </span>
            <h1 className="font-display italic text-cream text-5xl md:text-7xl leading-none">
              Our Menu
            </h1>
            <p className="font-sans text-sm text-cream-200 mt-1">
              Everything made to order.
            </p>
          </div>
        </PageWrapper>
      </div>

      {/* Menu tabs */}
      <PageWrapper className="py-12">
        <Suspense fallback={<div className="h-64 animate-pulse bg-ink-700 rounded-none" />}>
          <MenuTabs initialTab={tab ?? 'rice'} />
        </Suspense>
      </PageWrapper>
    </>
  );
}
