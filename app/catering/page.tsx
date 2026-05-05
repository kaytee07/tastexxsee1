import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CateringHero } from '@/components/catering/CateringHero';
import { TierSection } from '@/components/catering/TierSection';
import { HowItWorksSection } from '@/components/catering/HowItWorksSection';
import { TrustBand } from '@/components/catering/TrustBand';
import { InquirySection } from '@/components/catering/InquirySection';

export const metadata: Metadata = {
  title: 'Boutique Catering — TasteXXSee',
  description:
    'Private chef hire and custom diet catering in Ghana. Restaurant-quality, brought to your table.',
};

export default function CateringPage() {
  return (
    <>
      <CateringHero />
      <TierSection />
      <HowItWorksSection />
      <TrustBand />
      <Suspense>
        <InquirySection />
      </Suspense>
    </>
  );
}
