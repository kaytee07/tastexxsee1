'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface FormState {
  name: string;
  email: string;
  message: string;
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO Phase 2: swap mailto for server-side form-to-email
    window.location.href = `mailto:hello@tastexxsee.com?subject=Message from ${encodeURIComponent(form.name)}&body=${encodeURIComponent(form.message)}%0A%0A${encodeURIComponent(form.email)}`;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="font-sans text-cream-200 text-lg">
        Thanks for your message. We&apos;ll be in touch soon.
      </p>
    );
  }

  const fieldClass =
    'w-full bg-transparent border-0 border-b border-ink-600 py-2.5 px-0 font-sans text-sm text-cream placeholder:text-cream-200/40 rounded-none outline-none focus:border-gold transition-colors duration-200';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
      <div className="flex flex-col gap-1">
        <label htmlFor="c-name" className="font-sans text-xs text-gold uppercase" style={{ letterSpacing: '0.4em' }}>
          Name <span aria-hidden="true">*</span>
        </label>
        <input
          id="c-name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="c-email" className="font-sans text-xs text-gold uppercase" style={{ letterSpacing: '0.4em' }}>
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id="c-email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="c-message" className="font-sans text-xs text-gold uppercase" style={{ letterSpacing: '0.4em' }}>
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="c-message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="How can we help?"
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div>
        <Button
          variant="primary"
          onClick={() => {}}
          disabled={!form.name || !form.email || !form.message}
        >
          Send Message
        </Button>
      </div>
    </form>
  );
}
