'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { SectionMarker } from '@/components/ui/SectionMarker';
import { Divider } from '@/components/ui/Divider';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { fadeUp, stagger, viewportOnce } from '@/lib/motion';
import { formatPriceForCard } from '@/lib/format';
import { featuredItems } from '@/lib/menu-data';

const CATEGORY_LABELS: Record<string, string> = {
  rice: 'Rice',
  banku: 'Banku',
  'yam-chips': 'Yam Chips',
  noodles: 'Noodles',
  extras: 'Extras',
};

export function FeaturedDishes() {
  return (
    <section
      className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-ink"
      aria-labelledby="featured-heading"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Header row */}
        <motion.div
          className="mb-16"
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
        >
          <motion.div variants={fadeUp}>
            <SectionMarker number="02" label="FROM THE KITCHEN" />
          </motion.div>
          <motion.h2
            id="featured-heading"
            variants={fadeUp}
            className="font-display text-cream mt-4 leading-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            Three plates we&apos;d put{' '}
            <em className="italic text-gold">our name on.</em>
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-6">
            <Divider short />
          </motion.div>
        </motion.div>

        {/* Dish cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ink-600"
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
        >
          {featuredItems.map((item) => (
            <motion.a
              key={item.id}
              href={`/menu?tab=${item.category}`}
              variants={fadeUp}
              className="group relative flex flex-col bg-ink-800 overflow-hidden cursor-pointer"
              style={{ outline: 'none' }}
            >
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Bottom gradient */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(10,9,8,0.5) 0%, transparent 50%)',
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Gold border on hover */}
              <div
                className="absolute inset-0 border border-transparent group-hover:border-gold transition-all duration-300 pointer-events-none"
                aria-hidden="true"
              />

              {/* Text content */}
              <div className="p-6 flex flex-col gap-2 flex-1">
                <Eyebrow>{CATEGORY_LABELS[item.category]}</Eyebrow>
                <h3 className="font-display text-cream text-2xl leading-snug">
                  {item.name}
                </h3>
                {item.description && (
                  <p className="font-sans text-cream-200 text-sm leading-relaxed">
                    {item.description}
                  </p>
                )}
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="font-sans text-cream text-sm">
                    <span className="text-gold-400 text-xs mr-1">GHS</span>
                    <span className="font-medium">
                      {formatPriceForCard(item.price).replace('GHS ', '').replace('From GHS ', '')}
                    </span>
                    {item.price.kind !== 'single' && (
                      <span className="text-cream-200 text-xs ml-1">from</span>
                    )}
                  </span>
                  <span className="font-sans text-xs text-gold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Add to order →
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
