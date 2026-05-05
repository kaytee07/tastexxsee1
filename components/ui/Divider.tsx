import { cn } from '@/lib/utils';

interface DividerProps {
  short?: boolean;
  className?: string;
}

export function Divider({ short = false, className }: DividerProps) {
  return (
    <hr
      className={cn(
        'border-none h-px bg-gold-700 opacity-60',
        short ? 'w-[50px]' : 'w-full',
        className
      )}
    />
  );
}
