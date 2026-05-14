import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateRef } from '@/lib/format';
import { sendOrderSms, sendCustomerOrderSms } from '@/lib/sms';
import { auth } from '@/lib/auth';
import { menuItems } from '@/lib/menu-data';
import { getVariantPrice } from '@/lib/menu-helpers';
import type { ResolvedCartLine, OrderType, PaymentMethod, MomoProvider } from '@/types';

// POST /api/orders — create a new order
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      customerName: string;
      phone: string;
      orderType: OrderType;
      address?: string;
      paymentMethod: PaymentMethod;
      momoProvider?: MomoProvider;
      momoNumber?: string;
      notes?: string;
      lines: ResolvedCartLine[];
      total: number;
    };

    const {
      customerName, phone, orderType, address,
      paymentMethod, momoProvider, momoNumber, notes, lines, total,
    } = body;

    if (!customerName || !phone || !orderType || !paymentMethod || !lines?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (orderType === 'delivery' && !address) {
      return NextResponse.json({ error: 'Address required for delivery' }, { status: 400 });
    }

    // ── Server-side price verification ────────────────────────────────────────
    // Never trust the client-sent total or unit prices.
    // Recalculate every line from the authoritative menu data.
    let serverTotal = 0;
    const verifiedLines: ResolvedCartLine[] = [];

    for (const line of lines) {
      const item = menuItems.find((m) => m.id === line.itemId);
      if (!item) {
        return NextResponse.json(
          { error: `Unknown menu item: ${line.itemId}` },
          { status: 400 }
        );
      }
      const unitPrice = getVariantPrice(item, line.variantKey);
      const lineTotal = unitPrice * line.qty;
      serverTotal   += lineTotal;
      verifiedLines.push({ ...line, unitPrice, lineTotal });
    }
    // ─────────────────────────────────────────────────────────────────────────

    const ref = generateRef();

    const order = await prisma.order.create({
      data: {
        ref,
        customerName,
        phone,
        orderType,
        address: address ?? null,
        paymentMethod,
        momoProvider: momoProvider ?? null,
        momoNumber: momoNumber ?? null,
        notes: notes ?? null,
        lines: verifiedLines as object[],  // server-verified lines
        total: serverTotal,                // server-calculated total
      },
    });

    // Build the shared payload once, fire both SMSes in parallel — non-blocking
    const smsPayload = {
      ref: order.ref,
      customerName: order.customerName,
      phone: order.phone,
      orderType: order.orderType as OrderType,
      address: order.address ?? undefined,
      paymentMethod: 'cash' as const,
      lines: verifiedLines,
      total: order.total,
      notes: order.notes ?? undefined,
    };

    sendOrderSms(smsPayload);         // → admin phone
    sendCustomerOrderSms(smsPayload); // → customer phone

    return NextResponse.json({ ref: order.ref, id: order.id }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/orders]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/orders — list orders (admin only)
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return NextResponse.json(orders);
  } catch (err) {
    console.error('[GET /api/orders]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
