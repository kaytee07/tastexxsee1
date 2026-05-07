'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const baseStyles =
  'inline-flex items-center justify-center gap-2 font-sans text-sm font-medium tracking-widest uppercase cursor-pointer transition-opacity duration-200 disabled:opacity-40 disabled:cursor-not-allowed';

const variantStyles = {
  primary:
    'bg-gold text-ink h-[52px] px-8 hover:opacity-90',
  secondary:
    'bg-transparent border border-gold text-gold h-[52px] px-8 hover:opacity-80',
  ghost:
    'bg-transparent border-none text-cream-200 px-0 h-auto hover:text-cream',
};

export function Button({
  variant = 'primary',
  href,
  onClick,
  children,
  className,
  disabled = false,
}: ButtonProps) {
  const classes = cn(baseStyles, variantStyles[variant], className);

  if (variant === 'ghost') {
    const content = (
      <>
        <span>{children}</span>
        <motion.span
          initial={{ x: 0 }}
          whileHover={{ x: 6 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex"
        >
          <ArrowRight size={16} aria-hidden="true" />
        </motion.span>
      </>
    );

    if (href) {
      return (
        <a href={href} className={classes}>
          {content}
        </a>
      );
    }

    return (
      <button onClick={onClick} disabled={disabled} className={classes}>
        {content}
      </button>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
