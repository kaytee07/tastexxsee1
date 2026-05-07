'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import type { OrderType } from '@/types';

const PHONE_RE = /^(\+233|0)\d{9}$/;

interface FormState {
  customerName: string;
  phone: string;
  orderType: OrderType;
  address: string;
  notes: string;
}

const labelClass = 'font-sans text-xs text-gold uppercase block mb-1.5' as const;
const inputClass =
  'w-full bg-transparent border-0 border-b border-ink-600 py-2.5 px-0 font-sans text-sm text-cream placeholder:text-cream-200/40 rounded-none outline-none focus:border-gold transition-colors duration-200' as const;
const errorClass = 'font-sans text-xs text-gold mt-1' as const;

export function CheckoutForm() {
  const cart = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});

  const [form, setForm] = useState<FormState>({
    customerName: '',
    phone: '',
    orderType: 'delivery',
    address: '',
    notes: '',
  });

  function touch(field: keyof FormState) {
    setTouched((p) => ({ ...p, [field]: true }));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!form.customerName.trim()) errors.customerName = 'Full name is required.';
  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!PHONE_RE.test(form.phone.replace(/\s/g, ''))) {
    errors.phone = 'Enter a valid Ghana number (0XX… or +233XX…).';
  }
  if (form.orderType === 'delivery' && !form.address.trim()) {
    errors.address = 'Delivery address is required.';
  }

  const isValid = Object.keys(errors).length === 0;
  const errorEntries = Object.entries(errors) as [keyof FormState, string][];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);
    setTouched({ customerName: true, phone: true, address: true });
    if (!isValid) return;

    setLoading(true);
    setServerError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.customerName.trim(),
          phone: form.phone.trim(),
          orderType: form.orderType,
          address: form.orderType === 'delivery' ? form.address.trim() : undefined,
          paymentMethod: 'cash',
          notes: form.notes.trim() || undefined,
          lines: cart.resolvedLines,
          total: cart.subtotal,
        }),
      });

      if (!res.ok) {
        const { error } = (await res.json()) as { error: string };
        setServerError(error ?? 'Something went wrong. Please try again.');
        return;
      }

      const { ref } = (await res.json()) as { ref: string };
      cart.clear();
      router.push(`/order-confirmation/${ref}`);
    } catch {
      setServerError('Could not place your order. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      {/* Name */}
      <div>
        <label htmlFor="customerName" className={labelClass}>
          Full Name <span aria-hidden="true">*</span>
        </label>
        <input
          id="customerName"
          name="customerName"
          type="text"
          required
          value={form.customerName}
          onChange={handleChange}
          onBlur={() => touch('customerName')}
          placeholder="Your full name"
          aria-invalid={touched.customerName && !!errors.customerName}
          className={inputClass}
        />
        {touched.customerName && errors.customerName && (
          <p className={errorClass} role="alert">{errors.customerName}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className={labelClass}>
          Phone <span aria-hidden="true">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          value={form.phone}
          onChange={handleChange}
          onBlur={() => touch('phone')}
          placeholder="0XX XXX XXXX or +233…"
          aria-invalid={touched.phone && !!errors.phone}
          className={inputClass}
        />
        {touched.phone && errors.phone && (
          <p className={errorClass} role="alert">{errors.phone}</p>
        )}
      </div>

      {/* Order type */}
      <fieldset className="flex flex-col gap-3">
        <legend className={labelClass}>
          Order Type <span aria-hidden="true">*</span>
        </legend>
        <div className="flex flex-col sm:flex-row gap-4">
          {(
            [
              ['delivery', 'Delivery', 'Pay on Delivery'],
              ['pickup', 'Pickup', 'Pay on Pickup'],
            ] as [OrderType, string, string][]
          ).map(([val, title, sub]) => (
            <label
              key={val}
              className={`flex items-start gap-3 border py-3 px-4 cursor-pointer transition-colors duration-150 flex-1 ${
                form.orderType === val ? 'border-gold bg-gold/5' : 'border-ink-600 hover:border-gold-700'
              }`}
            >
              <input
                type="radio"
                name="orderType"
                value={val}
                checked={form.orderType === val}
                onChange={handleChange}
                className="accent-gold mt-0.5"
              />
              <span className="flex flex-col">
                <span className="font-sans text-sm text-cream">{title}</span>
                <span className="font-sans text-xs text-cream-200/60">{sub}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Address — delivery only */}
      {form.orderType === 'delivery' && (
        <div>
          <label htmlFor="address" className={labelClass}>
            Delivery Address <span aria-hidden="true">*</span>
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={form.address}
            onChange={handleChange}
            onBlur={() => touch('address')}
            placeholder="Street, area, landmark"
            aria-invalid={touched.address && !!errors.address}
            className={inputClass}
          />
          {touched.address && errors.address && (
            <p className={errorClass} role="alert">{errors.address}</p>
          )}
        </div>
      )}

      {/* Notes */}
      <div>
        <label htmlFor="notes" className={labelClass}>
          Notes <span className="text-cream-200/40 normal-case">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={form.notes}
          onChange={handleChange}
          placeholder="Ring the bell, no chili, extra sauce…"
          className={`${inputClass} resize-none`}
        />
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
                Please fix the following before placing your order:
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

      {/* Server error */}
      {serverError && (
        <div
          className="flex items-start gap-3 border border-gold/40 bg-gold/5 px-4 py-4"
          role="alert"
        >
          <AlertCircle size={16} className="text-gold flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="font-sans text-sm text-cream-200">{serverError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center font-sans text-sm font-medium tracking-widest uppercase bg-gold text-ink h-[52px] px-8 transition-opacity duration-200 disabled:opacity-50 hover:opacity-90"
      >
        {loading ? 'Placing order…' : 'Confirm Order'}
      </button>
    </form>
  );
}
