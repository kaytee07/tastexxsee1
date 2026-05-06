'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { DietChips } from '@/components/catering/DietChips';
import { fadeUp, stagger, viewportOnce } from '@/lib/motion';

const PRIVATE_CHEF_INCLUSIONS = [
  'Chef + sous chef if needed',
  'All cookware and ingredients',
  'Full plating and service',
];

export function TierSection() {
  return (
    <div className="bg-ink">
      {/* ── Tier 1: Private Chef Hire ─────────────────────────────── */}
      <section
        className="py-24 md:py-32 overflow-hidden"
        aria-labelledby="tier-1-heading"
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0 items-center">

            {/* Image — left, breaks out on desktop */}
            <motion.div
              className="relative md:-ml-6 lg:-ml-16"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative w-full" style={{ aspectRatio: '3/4' }}>
                <Image
                  src="/img/chef.png"
                  alt="Chef preparing a private dining experience"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                {/* Gold frame accent */}
                <div
                  className="absolute -bottom-4 -right-4 w-full h-full border border-gold-700 opacity-30 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </motion.div>

            {/* Text — right */}
            <motion.div
              className="flex flex-col gap-6 md:pl-16 lg:pl-24"
              variants={stagger}
              initial="initial"
              whileInView="animate"
              viewport={viewportOnce}
            >
              <motion.div variants={fadeUp}>
                <Eyebrow>Tier One</Eyebrow>
              </motion.div>

              <motion.h2
                id="tier-1-heading"
                variants={fadeUp}
                className="font-display text-cream leading-tight"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 4rem)' }}
              >
                Private Chef{' '}
                <em className="italic text-gold">Hire</em>
              </motion.h2>

              <motion.div variants={fadeUp} className="w-12">
                <Divider short />
              </motion.div>

              <motion.p variants={fadeUp} className="font-sans text-cream-200 leading-relaxed">
                Your chef comes to you. Whether you're hosting an intimate dinner at home or a
                private gathering at your venue, our chef arrives fully equipped to prepare and
                serve a restaurant-quality meal on-site.
              </motion.p>

              <motion.p variants={fadeUp} className="font-sans text-cream-200 leading-relaxed">
                Every detail is handled — from sourcing the finest local and imported ingredients
                to the final flourish of plating. You simply enjoy the occasion.
              </motion.p>

              <motion.ul variants={fadeUp} className="flex flex-col gap-2.5 mt-2">
                {PRIVATE_CHEF_INCLUSIONS.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-sans text-sm text-cream-200">
                    <span className="text-gold mt-0.5 leading-none flex-shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </motion.ul>

              <motion.div variants={fadeUp} className="mt-2">
                <Button variant="ghost" href="#inquire?tier=private-chef">
                  Inquire About This Tier
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hairline divider */}
      <div className="px-6 md:px-12 lg:px-20 max-w-[1440px] mx-auto">
        <Divider />
      </div>

      {/* ── Tier 2: Custom Diet Catering ─────────────────────────── */}
      <section
        className="py-24 md:py-32 overflow-hidden"
        aria-labelledby="tier-2-heading"
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0 items-center">

            {/* Text — left */}
            <motion.div
              className="flex flex-col gap-6 md:pr-16 lg:pr-24 order-2 md:order-1"
              variants={stagger}
              initial="initial"
              whileInView="animate"
              viewport={viewportOnce}
            >
              <motion.div variants={fadeUp}>
                <Eyebrow>Tier Two</Eyebrow>
              </motion.div>

              <motion.h2
                id="tier-2-heading"
                variants={fadeUp}
                className="font-display text-cream leading-tight"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 4rem)' }}
              >
                Custom Diet{' '}
                <em className="italic text-gold">Catering</em>
              </motion.h2>

              <motion.div variants={fadeUp} className="w-12">
                <Divider short />
              </motion.div>

              <motion.p variants={fadeUp} className="font-sans text-cream-200 leading-relaxed">
                Dietary restrictions should never mean compromising on taste or experience. We craft
                bespoke menus built entirely around your guests' nutritional needs and personal
                preferences.
              </motion.p>

              <motion.p variants={fadeUp} className="font-sans text-cream-200 leading-relaxed">
                Tell us what your guests require and we'll design a menu that feels indulgent,
                not restricted — delivered fresh to your location at an agreed time.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col gap-3">
                <span className="font-sans text-xs text-gold tracking-ultra uppercase font-medium">
                  Dietary Options We Accommodate
                </span>
                <DietChips interactive={false} selected={[]} onChange={() => {}} />
              </motion.div>

              <motion.div variants={fadeUp} className="mt-2">
                <Button variant="ghost" href="#inquire?tier=custom-diet">
                  Inquire About This Tier
                </Button>
              </motion.div>
            </motion.div>

            {/* Image — right, breaks out on desktop */}
            <motion.div
              className="relative md:-mr-6 lg:-mr-16 order-1 md:order-2"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative w-full" style={{ aspectRatio: '3/4' }}>
                <Image
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?w=900&q=80"
                  alt="Beautifully plated custom diet meal"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                {/* Gold frame accent */}
                <div
                  className="absolute -bottom-4 -left-4 w-full h-full border border-gold-700 opacity-30 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
