'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionMarker } from '@/components/ui/SectionMarker';
import { Divider } from '@/components/ui/Divider';
import { Input } from '@/components/ui/Input';
import { formatPriceForCard } from '@/lib/format';
import type { Price } from '@/types';
import { PageWrapper } from '@/components/layout/PageWrapper';

const singlePrice: Price = { kind: 'single', amount: 30 };
const rangePrice: Price = { kind: 'range', min: 50, max: 80 };
const sizedPrice: Price = {
  kind: 'sized',
  sizes: { regular: 40, medium: 55, large: 70, family: 95 },
};

export default function StyleguidePage() {
  const [inputVal, setInputVal] = useState('');
  const [inputError, setInputError] = useState('');

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputVal(e.target.value);
    setInputError(e.target.value.length > 0 ? '' : 'This field is required.');
  }

  return (
    <PageWrapper className="py-24 flex flex-col gap-16">
      <div>
        <h1 className="font-display italic text-cream text-5xl mb-2">Styleguide</h1>
        <p className="font-sans text-sm text-cream-200/60">
          Dev-only — not linked from public navigation.
        </p>
      </div>

      {/* Buttons */}
      <section className="flex flex-col gap-6">
        <SectionMarker number="01" label="Buttons" />
        <Divider short />
        <div className="flex flex-wrap items-center gap-6 pt-4">
          <Button variant="primary">Reserve a Table</Button>
          <Button variant="secondary">View Menu</Button>
          <Button variant="ghost">Learn More</Button>
          <Button variant="primary" disabled>
            Sold Out
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <Button variant="primary" href="/menu">
            Primary Link
          </Button>
          <Button variant="secondary" href="/catering">
            Secondary Link
          </Button>
          <Button variant="ghost" href="/founder">
            Ghost Link
          </Button>
        </div>
      </section>

      <Divider />

      {/* Eyebrow */}
      <section className="flex flex-col gap-6">
        <SectionMarker number="02" label="Eyebrow" />
        <Divider short />
        <div className="pt-4 flex flex-col gap-3">
          <Eyebrow>Featured Dishes</Eyebrow>
          <Eyebrow>Boutique Catering</Eyebrow>
          <Eyebrow className="text-gold-400">Custom Class Override</Eyebrow>
        </div>
      </section>

      <Divider />

      {/* Section Markers */}
      <section className="flex flex-col gap-6">
        <SectionMarker number="03" label="Section Markers" />
        <Divider short />
        <div className="pt-4 flex flex-col gap-4">
          <SectionMarker number="01" label="Welcome" />
          <SectionMarker number="02" label="Our Story" />
          <SectionMarker number="03" label="The Menu" />
          <SectionMarker number="04" label="Catering" />
        </div>
      </section>

      <Divider />

      {/* Dividers */}
      <section className="flex flex-col gap-6">
        <SectionMarker number="04" label="Dividers" />
        <Divider short />
        <div className="pt-4 flex flex-col gap-8">
          <div>
            <p className="font-sans text-xs text-cream-200/50 mb-3">Full-width</p>
            <Divider />
          </div>
          <div>
            <p className="font-sans text-xs text-cream-200/50 mb-3">Short (50px)</p>
            <Divider short />
          </div>
        </div>
      </section>

      <Divider />

      {/* Input */}
      <section className="flex flex-col gap-6">
        <SectionMarker number="05" label="Input" />
        <Divider short />
        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-xl">
          <Input
            label="Full Name"
            name="full-name"
            value={inputVal}
            onChange={handleInputChange}
            onBlur={() => {
              if (!inputVal) setInputError('This field is required.');
            }}
            required
            placeholder="e.g. Kwame Mensah"
            error={inputError}
          />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value=""
            onChange={() => {}}
            placeholder="0XX XXX XXXX"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value=""
            onChange={() => {}}
            placeholder="you@example.com"
            error="Please enter a valid email address."
          />
        </div>
      </section>

      <Divider />

      {/* Price formatting */}
      <section className="flex flex-col gap-6">
        <SectionMarker number="06" label="Price Formatting" />
        <Divider short />
        <div className="pt-4 flex flex-col gap-4">
          <div className="flex items-center gap-6">
            <span className="font-sans text-xs text-cream-200/50 w-24">Single</span>
            <span className="font-display italic text-gold text-2xl">
              {formatPriceForCard(singlePrice)}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-sans text-xs text-cream-200/50 w-24">Range</span>
            <span className="font-display italic text-gold text-2xl">
              {formatPriceForCard(rangePrice)}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-sans text-xs text-cream-200/50 w-24">Sized</span>
            <span className="font-display italic text-gold text-2xl">
              {formatPriceForCard(sizedPrice)}
            </span>
          </div>
        </div>
      </section>

      <Divider />

      {/* Color palette */}
      <section className="flex flex-col gap-6">
        <SectionMarker number="07" label="Color Palette" />
        <Divider short />
        <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'ink', bg: 'bg-ink', border: true },
            { name: 'ink-800', bg: 'bg-ink-800', border: true },
            { name: 'ink-700', bg: 'bg-ink-700', border: true },
            { name: 'ink-600', bg: 'bg-ink-600', border: true },
            { name: 'gold', bg: 'bg-gold', border: false },
            { name: 'gold-400', bg: 'bg-gold-400', border: false },
            { name: 'gold-200', bg: 'bg-gold-200', border: false },
            { name: 'gold-700', bg: 'bg-gold-700', border: false },
            { name: 'cream', bg: 'bg-cream', border: false },
            { name: 'cream-200', bg: 'bg-cream-200', border: false },
          ].map((swatch) => (
            <div key={swatch.name} className="flex flex-col gap-2">
              <div
                className={`h-12 ${swatch.bg} ${swatch.border ? 'border border-gold-700/30' : ''}`}
              />
              <span className="font-sans text-xs text-cream-200/60">{swatch.name}</span>
            </div>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
