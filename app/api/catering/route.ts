import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendCateringSms } from '@/lib/sms';
import { auth } from '@/lib/auth';
import type { CateringTier, DietPreference } from '@/types';

// POST /api/catering — create a new catering inquiry
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      fullName: string;
      phone: string;
      email: string;
      tier: CateringTier;
      eventDate: string;
      guests: number;
      diets?: DietPreference[];
      location: string;
      message?: string;
    };

    const { fullName, phone, email, tier, eventDate, guests, diets, location, message } = body;

    if (!fullName || !phone || !email || !tier || !eventDate || !guests || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const inquiry = await prisma.cateringInquiry.create({
      data: {
        fullName,
        phone,
        email,
        tier,
        eventDate: new Date(eventDate),
        guests,
        diets: diets ?? undefined,
        location,
        message: message ?? null,
      },
    });

    // Fire SMS to admin — non-blocking, never fails the inquiry save
    sendCateringSms({
      fullName,
      phone,
      tier,
      eventDate,
      guests,
      location,
      diets,
      message,
    });

    return NextResponse.json({ id: inquiry.id }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/catering]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/catering — list inquiries (admin only)
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const inquiries = await prisma.cateringInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(inquiries);
  } catch (err) {
    console.error('[GET /api/catering]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
