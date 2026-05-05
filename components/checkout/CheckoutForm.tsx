'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

const labelClass = 'font-sans text-xs text-gold uppercase block mb-1.5';
const inputClass =
  'w-full bg-transparent border-0 border-b border-ink-600 py-2.5 px-0 font-sans text-sm text-cream placeholder:text-cream-200/40 rounded-none outline-none focus:border-gold transition-colors duration-200';
const errorClass = 'font-sans text-xs text-gold-200 mt-1';

export function CheckoutForm() {
  const cart = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!form.customerName.trim()) errors.customerName = 'Name is required';
  if (!PHONE_RE.test(form.phone.replace(/\s/g, '')))
    errors.phone = 'Enter a valid Ghana number (0XX… or +233XX…)';
  if (form.orderType === 'delivery' && !form.address.trim())
    errors.address = 'Delivery address is required';

  const isValid = Object.keys(errors).length === 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ customerName: true, phone: true, address: true });
    if (!isValid) return;

    setLoading(true);
    setServerError('');

    // Payment method is always cash — "Pay on Delivery" or "Pay on Pickup"
    const paymentMethod = 'cash';

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.customerName.trim(),
          phone: form.phone.trim(),
          orderType: form.orderType,
          address:
            form.orderType === 'delivery' ? form.address.trim() : undefined,
          paymentMethod,
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
      setServerError(
        'Could not place your order. Check your connection and try again.'
      );
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
          className={inputClass}
        />
        {touched.customerName && errors.customerName && (
          <p className={errorClass}>{errors.customerName}</p>
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
          className={inputClass}
        />
        {touched.phone && errors.phone && (
          <p className={errorClass}>{errors.phone}</p>
        )}
      </div>

      {/* Order type */}
      <fieldset className="flex flex-col gap-3">
        <legend className={labelClass}>
          Order Type <span aria-hidden="true">*</span>
        </legend>
        <div className="flex gap-6">
          {(
            [
              ['delivery', 'Delivery — Pay on Delivery'],
              ['pickup', 'Pickup — Pay on Pickup'],
            ] as [OrderType, string][]
          ).map(([val, label]) => (
            <label
              key={val}
              className="flex items-center gap-2.5 font-sans text-sm text-cream-200 cursor-pointer"
            >
              <input
                type="radio"
                name="orderType"
                value={val}
                checked={form.orderType === val}
                onChange={handleChange}
                className="accent-gold"
              />
              {label}
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
            className={inputClass}
          />
          {touched.address && errors.address && (
            <p className={errorClass}>{errors.address}</p>
          )}
        </div>
      )}

      {/* Notes */}
      <div>
        <label htmlFor="notes" className={labelClass}>
          Notes (optional)
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

      {serverError && (
        <p className="font-sans text-sm text-gold-200 border border-gold-700/40 px-4 py-3">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center font-sans text-sm font-medium tracking-wide uppercase bg-gold text-ink h-[52px] px-8 transition-opacity duration-200 disabled:opacity-50 hover:opacity-90"
      >
        {loading ? 'Placing order…' : 'Confirm Order'}
      </button>
    </form>
  );
}
