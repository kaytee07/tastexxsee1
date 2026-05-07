'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface TouchedState {
  name: boolean;
  email: boolean;
  message: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getErrors(form: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!form.name.trim()) errors.name = 'Your name is required.';
  if (!form.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_RE.test(form.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (!form.message.trim()) errors.message = 'Please write a message.';
  return errors;
}

const labelClass =
  'font-sans text-xs text-gold uppercase block mb-1.5' as const;
const inputClass =
  'w-full bg-transparent border-0 border-b border-ink-600 py-2.5 px-0 font-sans text-sm text-cream placeholder:text-cream-200/40 rounded-none outline-none focus:border-gold transition-colors duration-200' as const;

export function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState<TouchedState>({ name: false, email: false, message: false });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const errors = getErrors(form);
  const isValid = Object.keys(errors).length === 0;
  const errorEntries = Object.entries(errors) as [keyof FormState, string][];

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const handleBlur = useCallback((field: keyof TouchedState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);
    setTouched({ name: true, email: true, message: true });
    if (!isValid) return;

    // Phase 2: swap for server-side form-to-email
    window.location.href = `mailto:hello@tastexxsee.com?subject=Message from ${encodeURIComponent(form.name)}&body=${encodeURIComponent(form.message)}%0A%0A${encodeURIComponent(form.email)}`;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4"
      >
        <span className="font-display italic text-gold text-4xl leading-none">✦</span>
        <p className="font-display text-cream text-2xl">Message sent.</p>
        <p className="font-sans text-cream-200 text-sm leading-relaxed">
          Thanks for reaching out. We&apos;ll get back to you as soon as possible.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
      {/* Name */}
      <div className="flex flex-col gap-1">
        <label htmlFor="c-name" className={labelClass} style={{ letterSpacing: '0.4em' }}>
          Name <span aria-hidden="true">*</span>
        </label>
        <input
          id="c-name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          onBlur={() => handleBlur('name')}
          placeholder="Your name"
          aria-invalid={touched.name && !!errors.name}
          className={inputClass}
        />
        {touched.name && errors.name && (
          <p className="font-sans text-xs text-gold mt-1" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label htmlFor="c-email" className={labelClass} style={{ letterSpacing: '0.4em' }}>
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id="c-email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          onBlur={() => handleBlur('email')}
          placeholder="your@email.com"
          aria-invalid={touched.email && !!errors.email}
          className={inputClass}
        />
        {touched.email && errors.email && (
          <p className="font-sans text-xs text-gold mt-1" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1">
        <label htmlFor="c-message" className={labelClass} style={{ letterSpacing: '0.4em' }}>
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="c-message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          onBlur={() => handleBlur('message')}
          placeholder="How can we help?"
          aria-invalid={touched.message && !!errors.message}
          className={`${inputClass} resize-none`}
        />
        {touched.message && errors.message && (
          <p className="font-sans text-xs text-gold mt-1" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {/* Error summary banner */}
      <AnimatePresence>
        {submitAttempted && !isValid && (
          <motion.div
            key="error-banner"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            role="alert"
            aria-live="polite"
            className="flex items-start gap-3 border border-gold/40 bg-gold/5 px-4 py-4"
          >
            <AlertCircle size={16} className="text-gold flex-shrink-0 mt-0.5" strokeWidth={1.5} />
            <div>
              <p className="font-sans text-sm text-gold font-medium">
                Please complete the following:
              </p>
              <ul className="mt-2 flex flex-col gap-1">
                {errorEntries.map(([field, msg]) => (
                  <li key={field} className="font-sans text-xs text-cream-200 flex items-start gap-2">
                    <span className="text-gold mt-0.5 leading-none flex-shrink-0">—</span>
                    {msg}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <Button variant="primary">
          Send Message
        </Button>
      </div>
    </form>
  );
}
