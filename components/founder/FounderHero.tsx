'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Divider } from '@/components/ui/Divider';
import { fadeUp, viewportOnce } from '@/lib/motion';

export function FounderHero() {
  return (
    <section
      className="grain-overlay relative overflow-hidden min-h-screen flex flex-col md:flex-row bg-ink"
      aria-label="Founder introduction"
    >
      {/* ── Left half: text content ──────────────────────────────── */}
      <div className="relative z-10 flex flex-col justify-center flex-1 px-6 md:px-12 lg:px-20 py-24 md:py-0 bg-ink">
        <motion.div
          className="flex flex-col gap-6 max-w-[520px]"
          initial="initial"
          animate="animate"
          variants={{
            animate: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
          }}
        >
          <motion.div variants={fadeUp}>
            <Eyebrow>THE FOUNDER</Eyebrow>
          </motion.div>

          <motion.h1
            className="font-display text-cream leading-none"
            style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
            variants={fadeUp}
          >
            Richard Nana Yaw Oduro
          </motion.h1>

          <motion.p
            className="font-display italic text-gold-400 text-2xl md:text-3xl leading-tight"
            variants={fadeUp}
          >
            Chef · Owner · Host
          </motion.p>

          <motion.div variants={fadeUp}>
            <Divider short />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Right half: portrait image ────────────────────────────── */}
      <motion.div
        className="relative w-full md:w-1/2 aspect-[4/5] md:aspect-auto md:min-h-screen flex-shrink-0 order-first md:order-last"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src="/img/nana.jpeg"
          alt="Richard Nana Yaw Oduro — Head Chef and Founder of TastexxSee"
          fill
          priority
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Subtle inner shadow on left edge to blend with text panel */}
        <div
          className="absolute inset-y-0 left-0 w-24 pointer-events-none hidden md:block"
          style={{
            background: 'linear-gradient(to right, #0A0908, transparent)',
          }}
          aria-hidden="true"
        />
      </motion.div>
    </section>
  );
}
