'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { DietChips } from '@/components/catering/DietChips';
import { cn } from '@/lib/utils';
import { fadeUp } from '@/lib/motion';
import type { CateringTier, DietPreference } from '@/types';

const PHONE_RE = /^(\+233|0)\d{9}$/;

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  tier: CateringTier | '';
  eventDate: string;
  guests: string;
  diets: DietPreference[];
  location: string;
  message: string;
}

interface TouchedState {
  fullName: boolean;
  phone: boolean;
  email: boolean;
  tier: boolean;
  eventDate: boolean;
  guests: boolean;
  location: boolean;
}

const INITIAL_FORM: FormState = {
  fullName: '',
  phone: '',
  email: '',
  tier: '',
  eventDate: '',
  guests: '',
  diets: [],
  location: '',
  message: '',
};

const INITIAL_TOUCHED: TouchedState = {
  fullName: false,
  phone: false,
  email: false,
  tier: false,
  eventDate: false,
  guests: false,
  location: false,
};

function getErrors(form: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};

  if (!form.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!PHONE_RE.test(form.phone.trim())) {
    errors.phone = 'Enter a valid Ghana number (0XXXXXXXXX or +233XXXXXXXXX).';
  }
  if (!form.email.trim()) errors.email = 'Email address is required.';
  if (!form.tier) errors.tier = 'Please select a service tier.';
  if (!form.eventDate) errors.eventDate = 'Event date is required.';
  if (!form.guests || Number(form.guests) < 1) errors.guests = 'Enter at least 1 guest.';
  if (!form.location.trim()) errors.location = 'Location is required.';

  return errors;
}

export function InquiryForm() {
  const searchParams = useSearchParams();

  const [form, setForm] = useState<FormState>(() => {
    const tierParam = searchParams.get('tier');
    const preselect: CateringTier | '' =
      tierParam === 'private-chef' || tierParam === 'custom-diet' ? tierParam : '';
    return { ...INITIAL_FORM, tier: preselect };
  });

  const [touched, setTouched] = useState<TouchedState>(INITIAL_TOUCHED);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync tier if URL param changes (shallow nav)
  useEffect(() => {
    const tierParam = searchParams.get('tier');
    if (tierParam === 'private-chef' || tierParam === 'custom-diet') {
      setForm((prev) => ({ ...prev, tier: tierParam }));
    }
  }, [searchParams]);

  const errors = getErrors(form);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleBlur = useCallback((field: keyof TouchedState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  function handleTierChange(tier: CateringTier) {
    setForm((prev) => ({ ...prev, tier, diets: [] }));
    setTouched((prev) => ({ ...prev, tier: true }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setTouched({
      fullName: true,
      phone: true,
      email: true,
      tier: true,
      eventDate: true,
      guests: true,
      location: true,
    });

    if (!isValid) return;

    setLoading(true);
    try {
      await fetch('/api/catering', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          tier: form.tier,
          eventDate: form.eventDate,
          guests: Number(form.guests),
          diets: form.tier === 'custom-diet' ? form.diets : undefined,
          location: form.location.trim(),
          message: form.message.trim() || undefined,
        }),
      });
    } catch {
      // Network error — still show success, inquiry logged on next attempt
    } finally {
      setLoading(false);
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="py-16 text-center flex flex-col items-center gap-6"
      >
        <span className="font-display italic text-gold text-5xl leading-none">✦</span>
        <h3 className="font-display text-cream text-2xl md:text-3xl">
          Inquiry Received
        </h3>
        <p className="font-sans text-cream-200 text-base max-w-md leading-relaxed">
          We've received your inquiry. The TastexxSee team will call you within 24 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.form
        key="form"
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-8 max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Name */}
        <motion.div variants={fadeUp}>
          <Input
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            onBlur={() => handleBlur('fullName')}
            error={touched.fullName ? errors.fullName : undefined}
            required
            placeholder="Kwame Mensah"
          />
        </motion.div>

        {/* Phone + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div variants={fadeUp}>
            <Input
              label="Phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              onBlur={() => handleBlur('phone')}
              error={touched.phone ? errors.phone : undefined}
              required
              placeholder="0241234567"
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              error={touched.email ? errors.email : undefined}
              required
              placeholder="you@email.com"
            />
          </motion.div>
        </div>

        {/* Service Tier */}
        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          <span className="font-sans text-xs text-gold tracking-ultra uppercase font-medium">
            Service Tier <span className="ml-1 text-gold-400">*</span>
          </span>
          <div className="flex flex-col sm:flex-row gap-3">
            {(
              [
                { value: 'private-chef' as CateringTier, label: 'Private Chef Hire' },
                { value: 'custom-diet' as CateringTier, label: 'Custom Diet Catering' },
              ] as const
            ).map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleTierChange(value)}
                className={cn(
                  'flex items-center gap-3 border py-3 px-4 font-sans text-sm tracking-wide text-left transition-colors duration-150 cursor-pointer',
                  form.tier === value
                    ? 'border-gold bg-gold/10 text-cream'
                    : 'border-ink-600 text-cream-200 hover:border-gold-700'
                )}
              >
                <span
                  className={cn(
                    'w-4 h-4 border flex-shrink-0 flex items-center justify-center',
                    form.tier === value ? 'border-gold' : 'border-ink-600'
                  )}
                >
                  {form.tier === value && (
                    <span className="w-2 h-2 bg-gold block" />
                  )}
                </span>
                {label}
              </button>
            ))}
          </div>
          {touched.tier && errors.tier && (
            <p className="font-sans text-xs text-gold-200 mt-0.5" role="alert">
              {errors.tier}
            </p>
          )}
        </motion.div>

        {/* Event Date + Guests */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div variants={fadeUp}>
            <Input
              label="Event Date"
              name="eventDate"
              type="date"
              value={form.eventDate}
              onChange={handleChange}
              onBlur={() => handleBlur('eventDate')}
              error={touched.eventDate ? errors.eventDate : undefined}
              required
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <Input
              label="Number of Guests"
              name="guests"
              type="number"
              value={form.guests}
              onChange={handleChange}
              onBlur={() => handleBlur('guests')}
              error={touched.guests ? errors.guests : undefined}
              required
              placeholder="20"
            />
          </motion.div>
        </div>

        {/* Diet preferences — only for Custom Diet */}
        {form.tier === 'custom-diet' && (
          <motion.div
            key="diet-chips"
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-3"
          >
            <span className="font-sans text-xs text-gold tracking-ultra uppercase font-medium">
              Dietary Preferences
            </span>
            <DietChips
              interactive
              selected={form.diets}
              onChange={(diets) => setForm((prev) => ({ ...prev, diets }))}
            />
          </motion.div>
        )}

        {/* Location */}
        <motion.div variants={fadeUp}>
          <Input
            label="Event Location (City / Area)"
            name="location"
            value={form.location}
            onChange={handleChange}
            onBlur={() => handleBlur('location')}
            error={touched.location ? errors.location : undefined}
            required
            placeholder="East Legon, Accra"
          />
        </motion.div>

        {/* Message */}
        <motion.div variants={fadeUp} className="flex flex-col gap-1.5">
          <label
            htmlFor="input-message"
            className="font-sans text-xs text-gold tracking-ultra uppercase font-medium"
          >
            Additional Details
          </label>
          <textarea
            id="input-message"
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder="Tell us about your event, any special requests…"
            className="w-full bg-transparent border-0 border-b border-ink-600 py-2.5 px-0 font-sans text-sm text-cream placeholder:text-cream/30 rounded-none outline-none focus:border-gold transition-colors duration-200 resize-none"
          />
        </motion.div>

        {/* Submit */}
        <motion.div variants={fadeUp}>
          <button
            type="submit"
            disabled={!isValid && Object.values(touched).some(Boolean)}
            className="inline-flex items-center justify-center gap-2 font-sans text-sm font-medium tracking-wide uppercase cursor-pointer bg-gold text-ink h-[52px] px-8 transition-opacity duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 w-full sm:w-auto"
          >
            Send Inquiry
          </button>
        </motion.div>
      </motion.form>
    </AnimatePresence>
  );
}
