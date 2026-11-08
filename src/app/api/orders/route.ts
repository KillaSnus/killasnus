import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession, requireAdmin } from '@/lib/auth';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  const authRes = await requireAdmin(req);
  if (authRes instanceof NextResponse) return authRes;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as OrderStatus | null;
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '25', 10);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { guestEmail: { contains: search, mode: 'insensitive' } },
        { guestName: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          items: true,
          user: true,
          timeline: { orderBy: { createdAt: 'desc' } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    const body = await req.json();

    const {
      email,
      firstName,
      lastName,
      phone,
      shippingAddress,
      billingAddress,
      items,
      paymentMethod = 'STRIPE',
      subtotal,
      discount = 0,
      shippingFee = 0,
      total,
      couponCode,
      notes,
    } = body;

    if (!email || !items || !items.length || !shippingAddress) {
      return NextResponse.json(
        { error: 'Missing required order fields (email, items, shippingAddress)' },
        { status: 400 }
      );
    }

    // Generate readable order reference
    const timestamp = Date.now().toString().slice(-5);
    const randomSuffix = Math.floor(10 + Math.random() * 90);
    const orderNumber = `KNS-${timestamp}${randomSuffix}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.dbUserId || null,
        guestEmail: email,
        guestName: `${firstName} ${lastName}`.trim(),
        guestPhone: phone,
        status: OrderStatus.PENDING,
        paymentStatus: paymentMethod === 'COD' ? PaymentStatus.UNPAID : PaymentStatus.PAID,
        paymentMethod,
        subtotal: parseFloat(subtotal),
        discount: parseFloat(discount),
        shippingFee: parseFloat(shippingFee),
        total: parseFloat(total),
        couponCode,
        notes,
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId || null,
            variantId: item.variantId || null,
            variantName: item.variantName || null,
            name: item.name,
            sku: item.sku || 'SKU-UNKNOWN',
            price: parseFloat(item.price),
            quantity: parseInt(item.quantity, 10),
            total: parseFloat(item.price) * parseInt(item.quantity, 10),
            image: item.image || null,
          })),
        },
        timeline: {
          create: [
            {
              status: 'CONFIRMED',
              title: 'Order Placed',
              message: `Order ${orderNumber} placed via ${paymentMethod}.`,
              createdBy: 'Customer',
            },
          ],
        },
      },
      include: {
        items: true,
        timeline: true,
      },
    });

    // Update coupon usage count if used
    if (couponCode) {
      await prisma.coupon
        .update({
          where: { code: couponCode.toUpperCase() },
          data: { usedCount: { increment: 1 } },
        })
        .catch(() => {});
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: any) {
    console.error('API Orders POST error:', error);
    return NextResponse.json({ error: error.message || 'Order creation failed' }, { status: 500 });
  }
}

