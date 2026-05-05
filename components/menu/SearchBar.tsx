'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

export function SearchBar({ value, onChange, className }: SearchBarProps) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <Search
        size={14}
        className="absolute left-0 text-gold-700 pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search dishes..."
        aria-label="Search dishes"
        className={cn(
          'w-full pl-5 pr-2 py-1.5 bg-transparent font-sans text-sm text-cream-200',
          'border-b border-gold-700 focus:border-gold outline-none',
          'placeholder:text-gold-700/60 transition-colors duration-200'
        )}
      />
    </div>
  );
}
