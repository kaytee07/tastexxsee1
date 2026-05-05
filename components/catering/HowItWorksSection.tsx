import { HowItWorks } from '@/components/catering/HowItWorks';
import { Eyebrow } from '@/components/ui/Eyebrow';

export function HowItWorksSection() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-ink" aria-labelledby="how-heading">
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-16">
          <Eyebrow>The Process</Eyebrow>
          <h2
            id="how-heading"
            className="font-display text-cream mt-3 leading-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            How it <em className="italic text-gold">works.</em>
          </h2>
        </div>
        <HowItWorks />
      </div>
    </section>
  );
}
