import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { CategoryType } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') as CategoryType | null;

    const categories = await prisma.category.findMany({
      where: {
        ...(type ? { type } : {}),
      },
      include: {
        children: true,
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ categories });
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
      description,
      image,
      icon,
      type = 'GENERAL',
      parentId,
      sortOrder = 0,
      isPublished = true,
      seoTitle,
      seoDesc,
    } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const slug = customSlug ? slugify(customSlug) : slugify(name);

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
        icon,
        type: type as CategoryType,
        parentId: parentId || null,
        sortOrder: parseInt(sortOrder, 10) || 0,
        isPublished,
        seoTitle,
        seoDesc,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

