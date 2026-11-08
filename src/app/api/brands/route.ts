import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ brands });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authRes = await requireAdmin(req);
  if (authRes instanceof NextResponse) return authRes;

  try {
    const body = await req.json();
    const {
      name,
      slug: customSlug,
      logo,
      banner,
      description,
      website,
      isFeatured = false,
      sortOrder = 0,
      seoTitle,
      seoDesc,
    } = body;

    if (!name) {
      return NextResponse.json({ error: 'Brand name is required' }, { status: 400 });
    }

    const slug = customSlug ? slugify(customSlug) : slugify(name);

    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
        logo,
        banner,
        description,
        website,
        isFeatured,
        sortOrder: parseInt(sortOrder, 10) || 0,
        seoTitle,
        seoDesc,
      },
    });

    return NextResponse.json({ brand }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

