'use client';

import { motion } from 'framer-motion';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { viewportOnce } from '@/lib/motion';

interface PullQuoteProps {
  quote: string;
  attribution?: string;
}

export function PullQuote({ quote, attribution }: PullQuoteProps) {
  return (
    <blockquote className="my-16 md:my-20 max-w-[65ch] mx-auto">
      <div className="flex items-start gap-4">
        {/* Left em-dash — draws in from center */}
        <motion.span
          className="font-display italic text-gold text-4xl md:text-5xl leading-none select-none flex-shrink-0 origin-right"
          aria-hidden="true"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          —
        </motion.span>

        <div className="flex-1">
          <motion.p
            className="font-display italic text-cream text-3xl md:text-4xl leading-snug"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {quote}
          </motion.p>

          {attribution && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Eyebrow>{attribution}</Eyebrow>
            </motion.div>
          )}
        </div>

        {/* Right em-dash — draws in from center */}
        <motion.span
          className="font-display italic text-gold text-4xl md:text-5xl leading-none select-none flex-shrink-0 origin-left"
          aria-hidden="true"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          —
        </motion.span>
      </div>
    </blockquote>
  );
}
