'use client';

import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '@/lib/motion';
import { PullQuote } from './PullQuote';

export function StoryArticle() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20">
      <article className="max-w-[65ch] mx-auto font-sans text-lg md:text-xl leading-relaxed text-cream-200 space-y-8">
        <motion.p
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          Richard Nana Yaw Oduro was not always a chef. He arrived at the University of Ghana
          with a sharp mind trained on numbers — reading Economics and Mathematics, learning to
          see patterns in things most people overlook. What he did not expect was that the most
          compelling pattern he would ever find was on a plate.
        </motion.p>

        <motion.p
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          The shift from economics to culinary was not a departure — it was a translation. The
          same discipline that dissects markets and equations now governs how flavour is built,
          how a kitchen runs, and how a dish earns its place on the menu. Every recipe is a
          problem with a solution. Every service is a system that either works or doesn&apos;t.
          Richard understood this instinctively, and it gave him an edge that no culinary school
          can teach.
        </motion.p>

        <PullQuote
          quote="I left the lecture hall, but I never stopped studying. The kitchen just became my classroom."
          attribution="— Richard Nana Yaw Oduro, Head Chef & Founder, TasteXXSee"
        />

        <motion.p
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          His passion for food grew into something he could no longer contain alongside
          spreadsheets and theory. So he chose the kitchen — fully, deliberately, without
          looking back. He immersed himself in Ghanaian culinary tradition: the slow patience
          of banku, the smoky ceremony of jollof, the bold confidence of pepper sauces that
          take hours to become what they are. Then he looked outward — to the wok techniques
          of East Asia, the aromatics of Thai cooking, the precision of noodle craft — and
          brought those worlds into conversation with the one he already knew.
        </motion.p>

        <motion.p
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          TasteXXSee is the result of that conversation. As head chef, Richard oversees every
          dish that leaves the kitchen — not as a manager, but as a craftsman. The menu is
          not a compromise between two cuisines; it is a coherent vision from a single mind
          that refuses to be limited by borders. Whether you are eating his Thai Fried Rice
          with Shrimps or a bowl of Banku with Tilapia, you are eating something Richard has
          thought about carefully, cooked with intention, and sent out with pride.
        </motion.p>
      </article>
    </section>
  );
}
