'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { SectionMarker } from '@/components/ui/SectionMarker';
import { Divider } from '@/components/ui/Divider';
import { Button } from '@/components/ui/Button';
import { fadeUp, stagger, viewportOnce } from '@/lib/motion';

const FOUNDER_IMAGE = '/img/nana1.png';

export function FounderTeaser() {
  return (
    <section
      className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-ink"
      aria-labelledby="founder-heading"
    >
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center"
        >
          {/* Portrait — left */}
          <motion.div
            variants={fadeUp}
            className="relative aspect-[4/5] overflow-hidden bg-ink-800"
          >
            <Image
              src={FOUNDER_IMAGE}
              alt="Richard Nana Yaw Oduro — head chef and founder of TastexxSee"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Bottom gradient */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(10,9,8,0.4) 0%, transparent 60%)',
              }}
              aria-hidden="true"
            />
          </motion.div>

          {/* Text — right */}
          <div className="flex flex-col gap-6">
            <motion.div variants={fadeUp}>
              <SectionMarker number="04" label="THE FOUNDER" />
            </motion.div>

            <motion.blockquote
              variants={fadeUp}
              className="font-display italic text-cream"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', lineHeight: 1.3 }}
            >
              <span className="text-gold mr-2" aria-hidden="true">—</span>
              Every plate that leaves my kitchen is one I&apos;d serve at my own table.
              <span className="text-gold ml-2" aria-hidden="true">—</span>
            </motion.blockquote>

            <motion.div variants={fadeUp}>
              <Divider short />
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="font-sans text-cream-200 leading-relaxed"
            >
              Richard Nana Yaw Oduro read Economics and Mathematics at the University
              of Ghana before following a deeper calling into the kitchen. As head chef
              of TastexxSee, he brings the same rigour he applied to numbers to every
              dish he creates — rooted in Ghanaian tradition, open to the world.
            </motion.p>

            <motion.div variants={fadeUp}>
              <Button variant="ghost" href="/founder">
                Meet the founder
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
