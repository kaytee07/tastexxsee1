import { cn } from '@/lib/utils';

interface SectionMarkerProps {
  number: string;
  label: string;
  className?: string;
}

export function SectionMarker({ number, label, className }: SectionMarkerProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="font-display italic text-gold text-lg leading-none">
        {number}
      </span>
      <span
        className="font-sans text-xs text-cream-200 tracking-ultra uppercase font-medium"
        aria-hidden="true"
      >
        /
      </span>
      <span className="font-sans text-xs text-cream-200 tracking-ultra uppercase font-medium">
        {label}
      </span>
    </div>
  );
}
