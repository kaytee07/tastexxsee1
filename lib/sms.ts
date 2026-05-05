import { formatGhs } from '@/lib/format';
import type { ResolvedCartLine, OrderType } from '@/types';

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

/**
 * Send an SMS via the Arkesel API v2.
 * https://developers.arkesel.com
 *
 * Required env vars:
 *   ARKESEL_API_KEY   — from arkesel.com dashboard
 *   ARKESEL_SENDER_ID — your registered sender name (e.g. "TasteXXSee"), max 11 chars
 *   ADMIN_PHONE       — phone number to receive alerts, Ghana format e.g. +233244123456
 *
 * Fire-and-forget — never throws so a failed SMS never blocks an order save.
 */
export async function sendOrderSms(order: OrderSmsPayload): Promise<void> {
  const apiKey    = process.env.ARKESEL_API_KEY;
  const adminPhone = process.env.ADMIN_PHONE;
  const senderId  = process.env.ARKESEL_SENDER_ID ?? 'TasteXXSee';

  if (!apiKey || !adminPhone) {
    console.warn('[SMS] ARKESEL_API_KEY or ADMIN_PHONE not set — skipping SMS');
    return;
  }

  const message = buildOrderSms(order);

  try {
    const res = await fetch('https://sms.arkesel.com/api/v2/sms/send', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: senderId,
        message,
        recipients: [adminPhone],
        sandbox: process.env.NODE_ENV !== 'production',
      }),
    });

    if (res.status === 200) {
      console.log('[SMS] Order notification sent for', order.ref);
    } else {
      const data = await res.text();
      console.error('[SMS] Arkesel error for', order.ref, '— status:', res.status, data);
    }
  } catch (err) {
    console.error('[SMS] Failed to send notification:', err);
  }
}
