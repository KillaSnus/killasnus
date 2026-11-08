import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET() {
  try {
    const pages = await prisma.cMSPage.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json({ pages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authRes = await requireAdmin(req);
  if (authRes instanceof NextResponse) return authRes;

  try {
    const body = await req.json();
    const { id, title, slug: customSlug, content, blocks } = body;

    const slug = customSlug ? slugify(customSlug) : slugify(title);

    const page = await prisma.cMSPage.upsert({
      where: id && id !== 'new' ? { id } : { slug },
      update: {
        title,
        content,
        blocks,
      },
      create: {
        title,
        slug,
        content,
        blocks,
        isPublished: true,
      },
    });

    return NextResponse.json({ page });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

