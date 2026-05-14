import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { sendOrderCompletedSms } from '@/lib/sms';
import type { OrderStatus, OrderType } from '@/types';

const VALID_STATUSES: OrderStatus[] = ['received', 'preparing', 'ready', 'completed'];

// PATCH /api/orders/[id] — advance order status (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json() as { status: OrderStatus };
    const { status } = body;

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    // Fire completion SMS to customer — non-blocking, never fails the response
    if (status === 'completed') {
      sendOrderCompletedSms({
        ref:          order.ref,
        phone:        order.phone,
        customerName: order.customerName,
        orderType:    order.orderType as OrderType,
      });
    }

    return NextResponse.json(order);
  } catch (err) {
    console.error('[PATCH /api/orders/[id]]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
