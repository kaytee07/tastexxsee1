'use client';

import { motion } from 'framer-motion';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';

const LINE1_WORDS = ['Restaurant-quality,'];
const LINE2_WORDS = ['brought', 'to', 'your', 'table.'];

export function CateringHero() {
  return (
    <section
      className="relative flex flex-col justify-end min-h-screen overflow-hidden bg-ink"
      aria-label="Boutique Catering"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80)',
        }}
        aria-hidden="true"
      />

      {/* Dark gradient overlay — heavy at bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(10,9,8,0.96) 0%, rgba(10,9,8,0.65) 45%, rgba(10,9,8,0.25) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 px-6 md:px-12 lg:px-20 pb-24 md:pb-32 max-w-[1440px] mx-auto w-full">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          <Eyebrow>Boutique Catering</Eyebrow>
        </motion.div>

        {/* Headline */}
        <h1
          className="font-display text-cream leading-none mb-6"
          style={{ fontSize: 'clamp(3.5rem, 8vw, 8rem)' }}
        >
          <span className="block">
            {LINE1_WORDS.map((word, i) => (
              <motion.span
                key={word}
                className="inline-block mr-[0.2em]"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </span>
          <span className="block italic text-gold">
            {LINE2_WORDS.map((word, i) => (
              <motion.span
                key={word}
                className="inline-block mr-[0.2em]"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.55 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          className="font-sans text-cream-200 text-lg md:text-xl mb-10 max-w-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          Private chef hire and custom diet catering for events of all sizes.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.25 }}
        >
          <Button variant="primary" href="#inquire">
            Inquire Now
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
