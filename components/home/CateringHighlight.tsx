'use client';

import { motion } from 'framer-motion';
import { SectionMarker } from '@/components/ui/SectionMarker';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { fadeUp, stagger, drawLine, viewportOnce } from '@/lib/motion';

const TIERS = [
  {
    title: 'Private Chef Hire',
    description:
      'A chef from TasteXXSee comes to your home or venue to prepare and serve the meal on-site. Everything from ingredients to plating is handled.',
    details: ['Chef + sous if needed', 'All cookware & ingredients', 'Full plating and service'],
    icon: '✦',
  },
  {
    title: 'Custom Diet Catering',
    description:
      'A bespoke menu built around your dietary needs and preferences, delivered to your location at an agreed time.',
    details: ['Keto · Halal · Vegan · Vegetarian', 'Gluten-free · Diabetic-friendly', 'Pescatarian · Low-sodium · Other'],
    icon: '◈',
  },
];

export function CateringHighlight() {
  return (
    <section
      className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-ink-800"
      aria-labelledby="catering-heading"
    >
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
        >
          {/* Header */}
          <motion.div variants={fadeUp}>
            <SectionMarker number="03" label="NOW OFFERING" />
          </motion.div>

          <motion.h2
            id="catering-heading"
            variants={fadeUp}
            className="font-display text-cream mt-4 leading-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            Boutique <em className="italic text-gold">Catering.</em>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="font-sans text-cream-200 text-lg mt-4 max-w-xl"
          >
            Restaurant-quality, brought to your table.
          </motion.p>

          {/* Gold rule */}
          <motion.div
            className="mt-8 mb-12 h-px bg-gold-700 origin-left"
            variants={drawLine}
            aria-hidden="true"
          />

          {/* Tier cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink-600">
            {TIERS.map((tier, i) => (
              <motion.div
                key={tier.title}
                variants={fadeUp}
                className="bg-ink-800 p-8 md:p-10 flex flex-col gap-5 group"
              >
                <span
                  className="font-display text-gold text-4xl leading-none"
                  aria-hidden="true"
                >
                  {tier.icon}
                </span>
                <h3 className="font-display text-cream text-2xl md:text-3xl">
                  {tier.title}
                </h3>
                <p className="font-sans text-cream-200 leading-relaxed">
                  {tier.description}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {tier.details.map((d) => (
                    <li
                      key={d}
                      className="font-sans text-sm text-cream-200 flex items-start gap-2"
                    >
                      <span className="text-gold mt-0.5 leading-none">—</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div variants={fadeUp} className="mt-12 flex justify-start">
            <Button variant="ghost" href="/catering">
              Inquire about catering
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
