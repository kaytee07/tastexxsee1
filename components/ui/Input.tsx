'use client';

import { cn } from '@/lib/utils';

interface InputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder,
  className,
}: InputProps) {
  const inputId = `input-${name}`;
  const errorId = `error-${name}`;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={inputId}
        className="font-sans text-xs text-gold tracking-ultra uppercase font-medium"
      >
        {label}
        {required && (
          <span className="ml-1 text-gold-400" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        placeholder={placeholder}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? 'true' : undefined}
        className={cn(
          'w-full bg-transparent border-0 border-b border-ink-600 py-2.5 px-0',
          'font-sans text-sm text-cream placeholder:text-cream/30',
          'rounded-none outline-none',
          'focus:border-gold transition-colors duration-200',
          error && 'border-gold-400'
        )}
      />
      {error && (
        <p id={errorId} role="alert" className="font-sans text-xs text-gold-200 mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
}
