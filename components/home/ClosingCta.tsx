'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { fadeUp, stagger, viewportOnce } from '@/lib/motion';

export function ClosingCta() {
  return (
    <section
      className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-ink-800"
      aria-label="Call to action"
    >
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="flex flex-col items-start gap-8"
        >
          <motion.div variants={fadeUp}>
            <Divider short />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="font-display text-cream leading-tight max-w-2xl"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            Reserve your seat{' '}
            <em className="italic text-gold">at the table.</em>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="font-sans text-cream-200 text-lg max-w-md"
          >
            Order now or plan your event. Either way, we&apos;ll take care of the rest.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-4"
          >
            <Button variant="primary" href="/menu">
              Order Now
            </Button>
            <Button variant="secondary" href="/catering">
              Plan an Event
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
