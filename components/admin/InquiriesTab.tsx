'use client';

import { useState } from 'react';
import type { CateringInquiry } from '@/types';
import { cn } from '@/lib/utils';

const TIER_LABELS: Record<string, string> = {
  'private-chef': 'Private Chef',
  'custom-diet': 'Custom Diet',
};

function InquiryRow({ inquiry }: { inquiry: CateringInquiry }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="border-b border-ink-600 cursor-pointer hover:bg-ink-700/40 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="py-3 pr-4 font-sans text-xs text-cream-200">
          {new Date(inquiry.createdAt).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}
        </td>
        <td className="py-3 pr-4 font-sans text-sm text-cream">{inquiry.fullName}</td>
        <td className="py-3 pr-4">
          <span className="font-sans text-xs text-gold border border-gold/40 px-2 py-0.5">
            {TIER_LABELS[inquiry.tier] ?? inquiry.tier}
          </span>
        </td>
        <td className="py-3 pr-4 font-sans text-xs text-cream-200">
          {inquiry.eventDate ? new Date(inquiry.eventDate).toLocaleDateString('en-GB') : '—'}
        </td>
        <td className="py-3 font-sans text-sm text-cream">{inquiry.guests}</td>
      </tr>

      {expanded && (
        <tr className="border-b border-ink-600 bg-ink-800">
          <td colSpan={5} className="px-4 py-5">
            <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 max-w-md font-sans text-sm">
              <span className="text-cream-200">Phone</span><span className="text-cream">{inquiry.phone}</span>
              <span className="text-cream-200">Email</span><span className="text-cream">{inquiry.email}</span>
              <span className="text-cream-200">Location</span><span className="text-cream">{inquiry.location}</span>
              {inquiry.diets?.length ? (
                <>
                  <span className="text-cream-200">Diets</span>
                  <span className="text-cream">{inquiry.diets.join(', ')}</span>
                </>
              ) : null}
              {inquiry.message && (
                <>
                  <span className="text-cream-200">Message</span>
                  <span className="text-cream">{inquiry.message}</span>
                </>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function InquiriesTab({ inquiries }: { inquiries: CateringInquiry[] }) {
  if (!inquiries.length) {
    return <p className="font-sans text-cream-200 text-sm">No catering inquiries yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-gold-700/40">
            {['Time', 'Name', 'Tier', 'Event Date', 'Guests'].map((h) => (
              <th key={h} className="pb-3 text-left font-sans text-xs text-gold uppercase pr-4" style={{ letterSpacing: '0.3em' }}>
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
  );
}
