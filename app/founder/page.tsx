import type { Metadata } from 'next';
import { FounderHero } from '@/components/founder/FounderHero';
import { StoryArticle } from '@/components/founder/StoryArticle';
import { SignatureDishes } from '@/components/founder/SignatureDishes';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';

export const metadata: Metadata = {
  title: 'The Founder — TasteXXSee',
  description:
    'Meet the chef and founder of TasteXXSee. His story, his philosophy, his kitchen.',
};

export default function FounderPage() {
  return (
    <>
      <FounderHero />
      <StoryArticle />

      {/* Signature Dishes */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-ink-800" aria-labelledby="sig-heading">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-12">
            <Eyebrow>From His Kitchen</Eyebrow>
            <h2
              id="sig-heading"
              className="font-display text-cream mt-3 leading-tight"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
            >
              Signature <em className="italic text-gold">Dishes.</em>
            </h2>
          </div>
          <SignatureDishes />
        </div>
      </section>

      {/* Closing block */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-ink text-center" aria-label="Founder closing">
        <p className="font-display italic text-cream-200 text-xl mb-10">
          Eat his food, hire him for your event, or just say hi.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          <Button variant="ghost" href="/menu">Order Now</Button>
          <Button variant="ghost" href="/catering">Hire him</Button>
          <Button variant="ghost" href="/contact">Visit us</Button>
        </div>
      </section>
    </>
  );
}
