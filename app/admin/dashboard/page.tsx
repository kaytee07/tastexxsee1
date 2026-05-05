import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import type { Order, CateringInquiry, ResolvedCartLine } from '@/types';

export const metadata: Metadata = {
  title: 'Dashboard — TasteXXSee Admin',
  robots: 'noindex',
};

export default async function DashboardPage() {
  let orders: Order[] = [];
  let inquiries: CateringInquiry[] = [];

  try {
    const [rawOrders, rawInquiries] = await Promise.all([
      prisma.order.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.cateringInquiry.findMany({ orderBy: { createdAt: 'desc' } }),
    ]);

    orders = rawOrders.map((o) => ({
      id: o.id,
      ref: o.ref,
      createdAt: o.createdAt.toISOString(),
      status: o.status as Order['status'],
      customerName: o.customerName,
      phone: o.phone,
      orderType: o.orderType as Order['orderType'],
      address: o.address ?? undefined,
      paymentMethod: o.paymentMethod as Order['paymentMethod'],
      momoProvider: o.momoProvider as Order['momoProvider'],
      momoNumber: o.momoNumber ?? undefined,
      notes: o.notes ?? undefined,
      lines: o.lines as unknown as ResolvedCartLine[],
      total: o.total,
    }));

    inquiries = rawInquiries.map((i) => ({
      id: i.id,
      createdAt: i.createdAt.toISOString(),
      fullName: i.fullName,
      phone: i.phone,
      email: i.email,
      tier: i.tier as CateringInquiry['tier'],
      eventDate: i.eventDate.toISOString(),
      guests: i.guests,
      diets: i.diets as CateringInquiry['diets'],
      location: i.location,
      message: i.message ?? undefined,
      status: i.status as CateringInquiry['status'],
    }));
  } catch {
    // DB not yet connected — show empty state
  }

  return <AdminDashboard orders={orders} inquiries={inquiries} />;
}
