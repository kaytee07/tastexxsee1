'use client';

import { motion } from 'framer-motion';
import { fadeUp, stagger, viewportOnce } from '@/lib/motion';

interface Step {
  numeral: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    numeral: '01',
    title: 'Send Inquiry',
    description: 'Fill out the form below with your event details',
  },
  {
    numeral: '02',
    title: 'We Call You Back',
    description: 'Our team designs the perfect menu with you',
  },
  {
    numeral: '03',
    title: 'Confirm & Deposit',
    description: 'Finalise details and secure your booking',
  },
  {
    numeral: '04',
    title: 'Enjoy the Experience',
    description: 'Sit back while we handle everything',
  },
];

export function HowItWorks() {
  return (
    <motion.div
      variants={stagger}
      initial="initial"
      whileInView="animate"
      viewport={viewportOnce}
      className="relative"
    >
      {/* Horizontal connector line — desktop only */}
      <div
        className="hidden md:block absolute top-[22px] left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-px bg-gold-700 opacity-50"
        aria-hidden="true"
      />

      <div className="flex flex-col md:flex-row gap-10 md:gap-0">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.numeral}
            variants={fadeUp}
            className="flex-1 flex flex-col md:items-center md:text-center gap-4 relative"
            style={{ transitionDelay: `${i * 0.08}s` }}
          >
            {/* Numeral */}
            <span className="font-display italic text-gold text-3xl md:text-4xl leading-none relative z-10 bg-ink md:mx-auto md:px-3">
              {step.numeral}
            </span>

            {/* Vertical connector — mobile only */}
            {i < STEPS.length - 1 && (
              <div
                className="md:hidden absolute left-[18px] top-10 bottom-[-30px] w-px bg-gold-700 opacity-40"
                aria-hidden="true"
              />
            )}

            {/* Text */}
            <div className="flex flex-col gap-1.5 pl-8 md:pl-0">
              <h3 className="font-display text-cream text-xl leading-snug">{step.title}</h3>
              <p className="font-sans text-sm text-cream-200 leading-relaxed max-w-[200px] md:mx-auto">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
