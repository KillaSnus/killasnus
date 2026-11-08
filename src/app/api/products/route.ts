import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const brand = searchParams.get('brand');
    const category = searchParams.get('category');
    const flavor = searchParams.get('flavor');
    const strength = searchParams.get('strength');
    const isPopular = searchParams.get('isPopular') === 'true';
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '24', 10);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    if (brand) {
      where.brand = { slug: brand.toLowerCase() };
    }
    if (category) {
      where.category = { slug: category.toLowerCase() };
    }
    if (flavor) {
      where.flavor = flavor;
    }
    if (strength) {
      where.strength = strength;
    }
    if (isPopular) {
      where.isPopular = true;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-asc') orderBy = { price: 'asc' };
    if (sort === 'price-desc') orderBy = { price: 'desc' };
    if (sort === 'popular') orderBy = { isPopular: 'desc' };
    if (sort === 'name') orderBy = { name: 'asc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          brand: true,
          category: true,
          variants: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('API Products GET error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch products' }, { status: 500 });
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
      sku,
      barcode,
      description,
      shortDescription,
      price,
      comparePrice,
      stock = 100,
      weight = 30,
      featuredImage,
      galleryImages = [],
      brandId,
      categoryId,
      tags = [],
      strength,
      strengthMg,
      flavor,
      pouchesPerCan = 20,
      format = 'Slim',
      isPublished = true,
      isFeatured = false,
      isPopular = false,
      seoTitle,
      seoDesc,
      variants = [],
    } = body;

    if (!name || !sku || price === undefined || !featuredImage) {
      return NextResponse.json(
        { error: 'Name, SKU, Price, and Featured Image are required fields.' },
        { status: 400 }
      );
    }

    const slug = customSlug ? slugify(customSlug) : slugify(name);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        barcode,
        description: description || name,
        shortDescription,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        stock: parseInt(stock, 10),
        weight: weight ? parseFloat(weight) : 30,
        featuredImage,
        galleryImages,
        brandId: brandId || null,
        categoryId: categoryId || null,
        tags: Array.isArray(tags) ? tags : [],
        strength,
        strengthMg: strengthMg ? parseFloat(strengthMg) : null,
        flavor,
        pouchesPerCan: parseInt(pouchesPerCan, 10) || 20,
        format,
        isPublished,
        isFeatured,
        isPopular,
        seoTitle,
        seoDesc,
        variants: {
          create: variants.map((v: any) => ({
            name: v.name,
            sku: v.sku || `${sku}-${slugify(v.name)}`,
            price: parseFloat(v.price),
            comparePrice: v.comparePrice ? parseFloat(v.comparePrice) : null,
            stock: parseInt(v.stock, 10) || 100,
            packSize: parseInt(v.packSize, 10) || 1,
          })),
        },
      },
      include: {
        variants: true,
        brand: true,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error('API Products POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}

