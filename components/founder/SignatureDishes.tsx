'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { menuItems } from '@/lib/menu-data';
import { fadeUp, viewportOnce } from '@/lib/motion';
import type { MenuItem } from '@/types';

const SIGNATURE_IDS = ['banku-tilapia', 'thai-rice-shrimps', 'jollof-beef-chicken'];

const signatureDishes: MenuItem[] = SIGNATURE_IDS.map(
  (id) => menuItems.find((item) => item.id === id)!
).filter(Boolean);

export function SignatureDishes() {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 lg:px-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {signatureDishes.map((dish, i) => (
          <motion.div
            key={dish.id}
            initial="initial"
            whileInView="animate"
            viewport={viewportOnce}
            variants={{
              initial: { opacity: 0, y: 30 },
              animate: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            <Link
              href={`/menu?tab=${dish.category}`}
              className="group block border border-gold-700/30 hover:border-gold-700/70 transition-colors duration-300"
            >
              {/* Dish image */}
              <div className="relative aspect-square overflow-hidden bg-ink-700">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                {/* Dark overlay on hover */}
                <div
                  className="absolute inset-0 bg-ink opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
                  aria-hidden="true"
                />
              </div>

              {/* Dish name */}
              <div className="p-4 border-t border-gold-700/30 group-hover:border-gold-700/70 transition-colors duration-300">
                <p className="font-display text-lg text-cream leading-snug">{dish.name}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
