import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        variants: true,
        reviews: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
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
      name,
      slug,
      sku,
      barcode,
      description,
      shortDescription,
      price,
      comparePrice,
      stock,
      weight,
      featuredImage,
      galleryImages,
      brandId,
      categoryId,
      tags,
      strength,
      strengthMg,
      flavor,
      pouchesPerCan,
      format,
      isPublished,
      isFeatured,
      isPopular,
      seoTitle,
      seoDesc,
      variants,
    } = body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        sku,
        barcode,
        description,
        shortDescription,
        price: price !== undefined ? parseFloat(price) : undefined,
        comparePrice: comparePrice !== undefined ? (comparePrice ? parseFloat(comparePrice) : null) : undefined,
        stock: stock !== undefined ? parseInt(stock, 10) : undefined,
        weight: weight !== undefined ? parseFloat(weight) : undefined,
        featuredImage,
        galleryImages,
        brandId: brandId || null,
        categoryId: categoryId || null,
        tags: Array.isArray(tags) ? tags : undefined,
        strength,
        strengthMg: strengthMg !== undefined ? (strengthMg ? parseFloat(strengthMg) : null) : undefined,
        flavor,
        pouchesPerCan: pouchesPerCan !== undefined ? parseInt(pouchesPerCan, 10) : undefined,
        format,
        isPublished,
        isFeatured,
        isPopular,
        seoTitle,
        seoDesc,
      },
      include: {
        variants: true,
        brand: true,
      },
    });

    return NextResponse.json({ product: updated });
  } catch (error: any) {
    console.error('API Products PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const authRes = await requireAdmin(req);
  if (authRes instanceof NextResponse) return authRes;

  try {
    const { id } = await context.params;
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

