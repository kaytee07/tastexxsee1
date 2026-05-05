'use client';

import { cn } from '@/lib/utils';
import type { DietPreference } from '@/types';

interface DietOption {
  value: DietPreference;
  label: string;
}

const DIET_OPTIONS: DietOption[] = [
  { value: 'keto',               label: 'Keto' },
  { value: 'halal',              label: 'Halal' },
  { value: 'vegan',              label: 'Vegan' },
  { value: 'vegetarian',         label: 'Vegetarian' },
  { value: 'gluten-free',        label: 'Gluten-Free' },
  { value: 'diabetic-friendly',  label: 'Diabetic-Friendly' },
  { value: 'low-sodium',         label: 'Low-Sodium' },
  { value: 'pescatarian',        label: 'Pescatarian' },
  { value: 'other',              label: 'Other' },
];

interface DietChipsProps {
  selected: DietPreference[];
  onChange: (diets: DietPreference[]) => void;
  interactive?: boolean;
}

export function DietChips({ selected, onChange, interactive = false }: DietChipsProps) {
  function toggle(value: DietPreference) {
    if (!interactive) return;
    if (selected.includes(value)) {
      onChange(selected.filter((d) => d !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2" role={interactive ? 'group' : undefined}>
      {DIET_OPTIONS.map(({ value, label }) => {
        const isSelected = selected.includes(value);

        if (!interactive) {
          return (
            <span
              key={value}
              className="h-8 px-3 inline-flex items-center border border-gold-700 text-gold font-sans text-xs tracking-wider uppercase rounded-none"
            >
              {label}
            </span>
          );
        }

        return (
          <button
            key={value}
            type="button"
            onClick={() => toggle(value)}
            aria-pressed={isSelected}
            className={cn(
              'h-8 px-3 inline-flex items-center border font-sans text-xs tracking-wider uppercase rounded-none transition-colors duration-150 cursor-pointer',
              isSelected
                ? 'bg-gold border-gold text-ink'
                : 'bg-transparent border-gold-700 text-gold hover:border-gold'
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
