import { cn } from '@/lib/utils';

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        'font-sans text-xs text-gold tracking-ultra uppercase font-medium',
        className
      )}
    >
      {children}
    </span>
  );
}
