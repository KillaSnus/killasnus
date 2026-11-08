import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
    return NextResponse.json({ posts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authRes = await requireAdmin(req);
  if (authRes instanceof NextResponse) return authRes;

  try {
    const body = await req.json();
    const { title, slug: customSlug, excerpt, content, featuredImage, authorName } = body;

    const slug = customSlug ? slugify(customSlug) : slugify(title);

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || title,
        content: content || '',
        featuredImage,
        authorName: authorName || 'Editorial Team',
        isPublished: true,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

