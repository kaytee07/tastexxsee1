'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CateringInquiry } from '@/types';

const TIER_LABELS: Record<string, string> = {
  'private-chef': 'Private Chef',
  'custom-diet': 'Custom Diet',
};

// ─── Expanded detail — shared between card and table row ─────────────────────

function InquiryDetail({ inquiry }: { inquiry: CateringInquiry }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 font-sans text-sm p-4 md:px-6 md:py-5 bg-ink-800">
      <span className="text-cream-200">Phone</span>
      <span className="text-cream">{inquiry.phone}</span>
      <span className="text-cream-200">Email</span>
      <span className="text-cream break-all">{inquiry.email}</span>
      <span className="text-cream-200">Location</span>
      <span className="text-cream">{inquiry.location}</span>
      {inquiry.diets?.length ? (
        <>
          <span className="text-cream-200">Diets</span>
          <span className="text-cream">{inquiry.diets.join(', ')}</span>
        </>
      ) : null}
      {inquiry.message && (
        <>
          <span className="text-cream-200 col-span-2 mt-2 border-t border-gold-700/20 pt-3">Message</span>
          <span className="text-cream col-span-2 leading-relaxed">{inquiry.message}</span>
        </>
      )}
    </div>
  );
}

// ─── Mobile card ──────────────────────────────────────────────────────────────

function InquiryCard({ inquiry }: { inquiry: CateringInquiry }) {
  const [expanded, setExpanded] = useState(false);

  const eventDateStr = inquiry.eventDate
    ? new Date(inquiry.eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

  return (
    <div className="border border-gold-700/20 bg-ink-700">
      <button
        className="w-full text-left px-4 py-4 flex items-start justify-between gap-3"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-sans text-base text-cream font-medium truncate">
            {inquiry.fullName}
          </span>
          <span className="font-sans text-xs text-cream-200">
            {eventDateStr} · {inquiry.guests} guests
          </span>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className="font-sans text-xs text-gold border border-gold/40 px-2 py-0.5">
            {TIER_LABELS[inquiry.tier] ?? inquiry.tier}
          </span>
          <span className="font-sans text-xs text-cream-200/50 capitalize">{inquiry.status}</span>
        </div>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={cn('text-gold-700 flex-shrink-0 mt-1 transition-transform duration-200', expanded && 'rotate-180')}
        />
      </button>

      {expanded && <InquiryDetail inquiry={inquiry} />}
    </div>
  );
}

// ─── Desktop table row ────────────────────────────────────────────────────────

function InquiryRow({ inquiry }: { inquiry: CateringInquiry }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="border-b border-ink-600 cursor-pointer hover:bg-ink-700/40 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="py-3 pr-4 font-sans text-xs text-cream-200">
          {new Date(inquiry.createdAt).toLocaleString('en-GB', {
            dateStyle: 'short',
            timeStyle: 'short',
          })}
        </td>
        <td className="py-3 pr-4 font-sans text-sm text-cream">{inquiry.fullName}</td>
        <td className="py-3 pr-4">
          <span className="font-sans text-xs text-gold border border-gold/40 px-2 py-0.5">
            {TIER_LABELS[inquiry.tier] ?? inquiry.tier}
          </span>
        </td>
        <td className="py-3 pr-4 font-sans text-xs text-cream-200">
          {inquiry.eventDate
            ? new Date(inquiry.eventDate).toLocaleDateString('en-GB')
            : '—'}
        </td>
        <td className="py-3 font-sans text-sm text-cream">{inquiry.guests}</td>
      </tr>
      {expanded && (
        <tr className="border-b border-ink-600">
          <td colSpan={5} className="p-0">
            <InquiryDetail inquiry={inquiry} />
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Tab export ───────────────────────────────────────────────────────────────

export function InquiriesTab({ inquiries }: { inquiries: CateringInquiry[] }) {
  if (!inquiries.length) {
    return (
      <div className="py-16 text-center">
        <p className="font-display italic text-cream-200 text-2xl">No inquiries yet.</p>
        <p className="font-sans text-xs text-cream-200/40 mt-2">Catering inquiries will appear here.</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile: card list */}
      <div className="flex flex-col gap-2 md:hidden">
        {inquiries.map((inq) => (
          <InquiryCard key={inq.id} inquiry={inq} />
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-gold-700/40">
              {['Time', 'Name', 'Tier', 'Event Date', 'Guests'].map((h) => (
                <th
                  key={h}
                  className="pb-3 text-left font-sans text-xs text-gold uppercase pr-4"
                  style={{ letterSpacing: '0.3em' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <InquiryRow key={inq.id} inquiry={inq} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
