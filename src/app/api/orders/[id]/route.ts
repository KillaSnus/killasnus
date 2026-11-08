import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { OrderStatus, PaymentStatus } from '@prisma/client';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // Search either by cuid ID or by orderNumber (e.g. KNS-10492)
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: {
          include: { product: true },
        },
        user: true,
        timeline: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const authRes = await requireAdmin(req);
  if (authRes instanceof NextResponse) return authRes;

  try {
    const { id } = await context.params;
    const body = await req.json();
    const {
      status,
      paymentStatus,
      trackingNumber,
      trackingCarrier,
      trackingUrl,
      timelineNote,
    } = body;

    const currentOrder = await prisma.order.findFirst({
      where: { OR: [{ id }, { orderNumber: id }] },
    });

    if (!currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updated = await prisma.order.update({
      where: { id: currentOrder.id },
      data: {
        status: status as OrderStatus | undefined,
        paymentStatus: paymentStatus as PaymentStatus | undefined,
        trackingNumber,
        trackingCarrier,
        trackingUrl,
      },
    });

    // Record timeline entry if status changed or note provided
    if (status && status !== currentOrder.status) {
      await prisma.orderTimeline.create({
        data: {
          orderId: currentOrder.id,
          status,
          title: `Status updated to ${status}`,
          message: timelineNote || `Order status updated to ${status}.`,
          createdBy: 'Admin',
        },
      });
    }

    if (trackingNumber && trackingNumber !== currentOrder.trackingNumber) {
      await prisma.orderTimeline.create({
        data: {
          orderId: currentOrder.id,
          status: 'SHIPPED',
          title: 'Tracking Info Added',
          message: `Carrier: ${trackingCarrier || 'Tracked Courier'} • Number: ${trackingNumber}`,
          createdBy: 'Admin',
        },
      });
    }

    return NextResponse.json({ order: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

