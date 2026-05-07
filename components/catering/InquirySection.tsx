import { Suspense } from 'react';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Divider } from '@/components/ui/Divider';
import { InquiryForm } from '@/components/catering/InquiryForm';

export function InquirySection() {
  return (
    <section
      id="inquire"
      className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-ink"
      aria-labelledby="inquiry-heading"
    >
      <div className="max-w-[720px] mx-auto">
        <div className="mb-12">
          <Eyebrow>Start Your Inquiry</Eyebrow>
          <h2
            id="inquiry-heading"
            className="font-display text-cream mt-3 leading-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Book <em className="italic text-gold">your service.</em>
          </h2>
          <div className="mt-6">
            <Divider short />
          </div>
        </div>
        <Suspense>
          <InquiryForm />
        </Suspense>
      </div>
    </section>
  );
}
