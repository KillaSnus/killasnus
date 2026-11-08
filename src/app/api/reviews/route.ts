import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin, getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const isAdminView = searchParams.get('admin') === 'true';

    const where: any = {};
    if (productId) where.productId = productId;
    if (!isAdminView) where.isApproved = true;

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { product: true },
    });

    return NextResponse.json({ reviews });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    const body = await req.json();
    const { productId, authorName, authorEmail, rating = 5, title, content } = body;

    if (!productId || !authorName || !authorEmail || !content) {
      return NextResponse.json({ error: 'Missing required review fields' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: session?.dbUserId || null,
        authorName,
        authorEmail,
        rating: parseInt(rating, 10),
        title,
        content,
        isVerifiedPurchase: true,
        isApproved: false, // Moderated by default
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

