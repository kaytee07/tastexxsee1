import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { FeaturedDishes } from '@/components/home/FeaturedDishes';
import { CateringHighlight } from '@/components/home/CateringHighlight';
import { FounderTeaser } from '@/components/home/FounderTeaser';
import { ClosingCta } from '@/components/home/ClosingCta';

export const metadata: Metadata = {
  title: 'TastexxSee — Local roots, global plates · Ghana',
  description:
    'TastexxSee serves Ghanaian local plates alongside Asian-influenced rice and noodle dishes, and offers boutique catering for private events.',
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedDishes />
      <CateringHighlight />
      <FounderTeaser />
      <ClosingCta />
    </>
  );
}
