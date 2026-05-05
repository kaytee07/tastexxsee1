'use client';

import { motion } from 'framer-motion';
import { SectionMarker } from '@/components/ui/SectionMarker';
import { Button } from '@/components/ui/Button';

const WORDS = ['Local', 'roots.'];
const WORDS2 = ['Global', 'plates.'];

export function Hero() {
  return (
    <section
      className="relative flex flex-col justify-end min-h-screen overflow-hidden bg-ink"
      aria-label="Welcome"
    >
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1547592180-85f173990554?w=1920&q=80')",
        }}
        aria-hidden="true"
      />
      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(10,9,8,0.92) 0%, rgba(10,9,8,0.55) 50%, rgba(10,9,8,0.3) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Section marker — top left */}
      <motion.div
        className="absolute top-32 left-6 md:left-12 lg:left-20 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <SectionMarker number="01" label="WELCOME" />
      </motion.div>

      {/* Content — bottom */}
      <div className="relative z-10 px-6 md:px-12 lg:px-20 pb-20 md:pb-28 max-w-[1440px] mx-auto w-full">
        {/* Headline */}
        <h1 className="font-display text-cream leading-none mb-6" style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)' }}>
          <span className="block">
            {WORDS.map((word, i) => (
              <motion.span
                key={word}
                className="inline-block mr-[0.25em]"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.4 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}
              </motion.span>
            ))}
          </span>
          <span className="block italic text-gold">
            {WORDS2.map((word, i) => (
              <motion.span
                key={word}
                className="inline-block mr-[0.25em]"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.7 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Tagline */}
        <motion.p
          className="font-sans text-cream-200 text-lg md:text-xl mb-10 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          Ghanaian comfort food done with care, where local meets international.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <Button variant="primary" href="/menu">
            Order Now
          </Button>
          <Button variant="ghost" href="/catering">
            Explore Catering
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
