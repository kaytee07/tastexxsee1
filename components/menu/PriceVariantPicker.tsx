'use client';

import { cn } from '@/lib/utils';
import { formatGhs } from '@/lib/format';
import type { Price, VariantKey } from '@/types';

interface PriceVariantPickerProps {
  price: Price;
  selected: VariantKey | null;
  onChange: (key: VariantKey) => void;
}

interface ChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function Chip({ label, active, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-9 px-3 font-sans text-xs font-medium transition-colors duration-150 cursor-pointer',
        'border focus-visible:outline-2 focus-visible:outline-gold',
        active
          ? 'bg-gold border-gold text-ink'
          : 'bg-transparent border-gold-700 text-gold hover:border-gold'
      )}
      style={{ borderRadius: 0 }}
    >
      {label}
    </button>
  );
}

export function PriceVariantPicker({
  price,
  selected,
  onChange,
}: PriceVariantPickerProps) {
  if (price.kind === 'single') {
    return null;
  }

  if (price.kind === 'range') {
    return (
      <div className="flex flex-wrap gap-2">
        <Chip
          label={`Small — ${formatGhs(price.min)}`}
          active={selected === 'min'}
          onClick={() => onChange('min')}
        />
        <Chip
          label={`Large — ${formatGhs(price.max)}`}
          active={selected === 'max'}
          onClick={() => onChange('max')}
        />
      </div>
    );
  }

  // sized
  const sizes: { key: VariantKey; label: string }[] = [
    { key: 'regular', label: `Regular — ${formatGhs(price.sizes.regular)}` },
    { key: 'medium', label: `Medium — ${formatGhs(price.sizes.medium)}` },
    { key: 'large', label: `Large — ${formatGhs(price.sizes.large)}` },
    { key: 'family', label: `Family — ${formatGhs(price.sizes.family)}` },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map(({ key, label }) => (
        <Chip
          key={key}
          label={label}
          active={selected === key}
          onClick={() => onChange(key)}
        />
      ))}
    </div>
  );
}
