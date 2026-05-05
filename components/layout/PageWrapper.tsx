import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div
      className={cn(
        'max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20',
        className
      )}
    >
      {children}
    </div>
  );
}
