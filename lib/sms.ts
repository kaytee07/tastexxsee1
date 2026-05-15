import { formatGhs } from '@/lib/format';
import type { ResolvedCartLine, OrderType, CateringTier, DietPreference } from '@/types';

interface OrderSmsPayload {
  ref: string;
  customerName: string;
  phone: string;
  orderType: OrderType;
  address?: string;
  paymentMethod: 'cash' | 'momo';
  lines: ResolvedCartLine[];
  total: number;
  notes?: string;
}

/**
 * Build the SMS message text for a new order.
 * Kept concise — each 160-char segment costs one SMS credit.
 */
export function buildOrderSms(order: OrderSmsPayload): string {
  const typeLabel   = order.orderType === 'delivery' ? 'Delivery' : 'Pickup';
  const payLabel    = order.orderType === 'delivery' ? 'Pay on Delivery' : 'Pay on Pickup';
  const itemsSummary = order.lines.map((l) => `${l.name} x${l.qty}`).join(', ');
  const addressLine  = order.orderType === 'delivery' && order.address
    ? `\nAddress: ${order.address}`
    : '';
  const notesLine    = order.notes ? `\nNote: ${order.notes}` : '';

  return (
    `NEW ORDER ${order.ref}\n` +
    `Customer: ${order.customerName} (${order.phone})\n` +
    `Type: ${typeLabel} | ${payLabel}\n` +
    `Items: ${itemsSummary}\n` +
    `Total: ${formatGhs(order.total)}` +
    addressLine +
    notesLine
  );
}

// ─── Catering inquiry SMS ────────────────────────────────────────────────────

interface CateringSmsPayload {
  fullName: string;
  phone: string;
  tier: CateringTier;
  eventDate: string;   // ISO date string
  guests: number;
  location: string;
  diets?: DietPreference[];
  message?: string;
}

const TIER_LABELS: Record<CateringTier, string> = {
  'private-chef': 'Private Chef Hire',
  'custom-diet': 'Custom Diet Catering',
};

export function buildCateringSms(inquiry: CateringSmsPayload): string {
  const date = new Date(inquiry.eventDate).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  const dietsLine = inquiry.diets?.length
    ? `\nDiets: ${inquiry.diets.join(', ')}`
    : '';
  const msgLine = inquiry.message ? `\nNote: ${inquiry.message}` : '';

  return (
    `NEW CATERING INQUIRY\n` +
    `Client: ${inquiry.fullName} (${inquiry.phone})\n` +
    `Tier: ${TIER_LABELS[inquiry.tier]}\n` +
    `Event: ${date} | ${inquiry.guests} guests\n` +
    `Location: ${inquiry.location}` +
    dietsLine +
    msgLine
  );
}

export async function sendCateringSms(inquiry: CateringSmsPayload): Promise<void> {
  const apiKey     = process.env.ARKESEL_API_KEY;
  const adminPhone = process.env.ADMIN_PHONE;
  const senderId   = process.env.ARKESEL_SENDER_ID ?? 'TastexxSee';

  if (!apiKey || !adminPhone) {
    console.warn('[SMS] ARKESEL_API_KEY or ADMIN_PHONE not set — skipping catering SMS');
    return;
  }

  const message = buildCateringSms(inquiry);

  try {
    const res = await fetch('https://sms.arkesel.com/api/v2/sms/send', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: senderId,
        message,
        recipients: [adminPhone],
      }),
    });

    if (res.status === 200) {
      console.log('[SMS] Catering inquiry notification sent for', inquiry.fullName);
    } else {
      const data = await res.text();
      console.error('[SMS] Arkesel error (catering):', res.status, data);
    }
  } catch (err) {
    console.error('[SMS] Failed to send catering notification:', err);
  }
}

// ─── Shared Arkesel sender ────────────────────────────────────────────────────

async function arkeselSend(recipients: string[], message: string): Promise<boolean> {
  const apiKey   = process.env.ARKESEL_API_KEY;
  const senderId = process.env.ARKESEL_SENDER_ID ?? 'TastexxSee';

  if (!apiKey) return false;

  const res = await fetch('https://sms.arkesel.com/api/v2/sms/send', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: senderId,
      message,
      recipients,
    }),
  });

  return res.status === 200;
}

// ─── Admin order notification SMS ─────────────────────────────────────────────

/**
 * Send new-order alert to the restaurant owner.
 * Fire-and-forget — never throws so a failed SMS never blocks an order save.
 *
 * Required env vars:
 *   ARKESEL_API_KEY   — from arkesel.com dashboard
 *   ARKESEL_SENDER_ID — registered sender name, max 11 chars (e.g. "TastexxSee")
 *   ADMIN_PHONE       — owner's number, Ghana format e.g. +233244123456
 */
export async function sendOrderSms(order: OrderSmsPayload): Promise<void> {
  const adminPhone = process.env.ADMIN_PHONE;

  if (!process.env.ARKESEL_API_KEY || !adminPhone) {
    console.warn('[SMS] ARKESEL_API_KEY or ADMIN_PHONE not set — skipping admin SMS');
    return;
  }

  const message = buildOrderSms(order);

  try {
    const ok = await arkeselSend([adminPhone], message);
    if (ok) {
      console.log('[SMS] Admin notification sent for', order.ref);
    } else {
      console.error('[SMS] Arkesel rejected admin SMS for', order.ref);
    }
  } catch (err) {
    console.error('[SMS] Failed to send admin notification:', err);
  }
}

// ─── Customer order confirmation SMS ──────────────────────────────────────────

/**
 * Build a customer-facing order confirmation.
 * Includes order ref, items summary, total, and payment method.
 * Kept tight — aim for ≤160 chars (1 SMS credit). Items are truncated if needed.
 *
 * Example output:
 *   TastexxSee: Order confirmed! Ref: TXS-20250507-1234
 *   Jollof Rice x1, Fried Chicken x1
 *   Total: GHS 85.00 | Pay on Delivery
 */
export function buildCustomerOrderSms(order: OrderSmsPayload): string {
  const payLabel    = order.orderType === 'delivery' ? 'Pay on Delivery' : 'Pay on Pickup';
  const itemsSummary = order.lines.map((l) => `${l.name} x${l.qty}`).join(', ');

  return (
    `TastexxSee: Order confirmed! Ref: ${order.ref}\n` +
    `${itemsSummary}\n` +
    `Total: ${formatGhs(order.total)} | ${payLabel}`
  );
}

/**
 * Send order confirmation SMS to the customer.
 * Fire-and-forget — never throws.
 */
export async function sendCustomerOrderSms(order: OrderSmsPayload): Promise<void> {
  if (!process.env.ARKESEL_API_KEY) {
    console.warn('[SMS] ARKESEL_API_KEY not set — skipping customer confirmation SMS');
    return;
  }

  const message = buildCustomerOrderSms(order);

  try {
    const ok = await arkeselSend([order.phone], message);
    if (ok) {
      console.log('[SMS] Customer confirmation sent to', order.phone, 'for', order.ref);
    } else {
      console.error('[SMS] Arkesel rejected customer SMS for', order.ref);
    }
  } catch (err) {
    console.error('[SMS] Failed to send customer confirmation:', err);
  }
}

// ─── Customer order completion SMS ────────────────────────────────────────────

interface OrderCompletedPayload {
  ref: string;
  phone: string;
  customerName: string;
  orderType: OrderType;
}

/**
 * Build the completion SMS sent when admin marks an order as Completed.
 * Delivery → "has been delivered". Pickup → "is ready for collection".
 * Target: ≤160 chars (1 credit).
 */
export function buildOrderCompletedSms(order: OrderCompletedPayload): string {
  const action =
    order.orderType === 'delivery'
      ? 'has been delivered'
      : 'is ready for collection';
  return (
    `TastexxSee: Hi ${order.customerName}, your order ${order.ref} ${action}.\n` +
    `Thank you for dining with us!`
  );
}

/**
 * Send order-completed SMS to the customer.
 * Called by PATCH /api/orders/[id] when status advances to "completed".
 * Fire-and-forget — never throws.
 */
export async function sendOrderCompletedSms(order: OrderCompletedPayload): Promise<void> {
  if (!process.env.ARKESEL_API_KEY) {
    console.warn('[SMS] ARKESEL_API_KEY not set — skipping completion SMS');
    return;
  }

  const message = buildOrderCompletedSms(order);

  try {
    const ok = await arkeselSend([order.phone], message);
    if (ok) {
      console.log('[SMS] Completion SMS sent to', order.phone, 'for', order.ref);
    } else {
      console.error('[SMS] Arkesel rejected completion SMS for', order.ref);
    }
  } catch (err) {
    console.error('[SMS] Failed to send completion SMS:', err);
  }
}
