import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { parseCSV, generateCSV, mapShopifyProductCSV, mapShopifyCustomerCSV } from '@/lib/csv';
import { slugify } from '@/lib/utils';
import { Role } from '@prisma/client';

export async function GET(req: NextRequest) {
  const authRes = await requireAdmin(req);
  if (authRes instanceof NextResponse) return authRes;

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'products';

    let csvContent = '';
    let filename = `${type}_export_${Date.now()}.csv`;

    switch (type) {
      case 'products': {
        const products = await prisma.product.findMany({
          include: { brand: true, category: true, variants: true },
        });
        const rows = products.map((p) => ({
          Handle: p.slug,
          Title: p.name,
          'Body (HTML)': p.description,
          Vendor: p.brand?.name || '',
          Type: p.category?.name || '',
          Tags: p.tags.join(', '),
          Published: p.isPublished ? 'TRUE' : 'FALSE',
          'Variant SKU': p.sku,
          'Variant Price': p.price,
          'Variant Compare At Price': p.comparePrice || '',
          'Variant Inventory Qty': p.stock,
          'Image Src': p.featuredImage,
          Strength: p.strength || '',
          StrengthMg: p.strengthMg || '',
          Flavor: p.flavor || '',
          PouchesPerCan: p.pouchesPerCan || 20,
        }));
        csvContent = generateCSV(rows);
        break;
      }

      case 'customers': {
        const customers = await prisma.user.findMany({
          include: { orders: true },
        });
        const rows = customers.map((c) => ({
          'First Name': c.name?.split(' ')[0] || '',
          'Last Name': c.name?.split(' ').slice(1).join(' ') || '',
          Email: c.email,
          Phone: c.phone || '',
          Tags: c.tags.join(', '),
          Notes: c.notes || '',
          'Orders Count': c.orders.length,
          'Total Spent': c.orders.reduce((sum, o) => sum + o.total, 0).toFixed(2),
        }));
        csvContent = generateCSV(rows);
        break;
      }

      case 'orders': {
        const orders = await prisma.order.findMany({
          include: { items: true },
        });
        const rows = orders.map((o) => ({
          Name: o.orderNumber,
          Email: o.guestEmail || '',
          'Financial Status': o.paymentStatus,
          'Fulfillment Status': o.status,
          'Payment Method': o.paymentMethod,
          Subtotal: o.subtotal,
          Shipping: o.shippingFee,
          Discount: o.discount,
          Total: o.total,
          'Lineitem count': o.items.length,
          'Created at': o.createdAt.toISOString(),
        }));
        csvContent = generateCSV(rows);
        break;
      }

      case 'categories': {
        const categories = await prisma.category.findMany();
        const rows = categories.map((cat) => ({
          Name: cat.name,
          Slug: cat.slug,
          Description: cat.description || '',
          Type: cat.type,
          ParentId: cat.parentId || '',
        }));
        csvContent = generateCSV(rows);
        break;
      }

      case 'brands': {
        const brands = await prisma.brand.findMany();
        const rows = brands.map((b) => ({
          Name: b.name,
          Slug: b.slug,
          Description: b.description || '',
          Website: b.website || '',
          IsFeatured: b.isFeatured ? 'TRUE' : 'FALSE',
        }));
        csvContent = generateCSV(rows);
        break;
      }

      case 'blogs': {
        const posts = await prisma.blogPost.findMany();
        const rows = posts.map((p) => ({
          Title: p.title,
          Slug: p.slug,
          Excerpt: p.excerpt,
          Content: p.content,
          Author: p.authorName,
          Tags: p.tags.join(', '),
          Published: p.isPublished ? 'TRUE' : 'FALSE',
        }));
        csvContent = generateCSV(rows);
        break;
      }

      case 'pages': {
        const pages = await prisma.cMSPage.findMany();
        const rows = pages.map((p) => ({
          Title: p.title,
          Slug: p.slug,
          Content: p.content || '',
          Published: p.isPublished ? 'TRUE' : 'FALSE',
        }));
        csvContent = generateCSV(rows);
        break;
      }

      default:
        return NextResponse.json({ error: 'Unknown export type' }, { status: 400 });
    }

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authRes = await requireAdmin(req);
  if (authRes instanceof NextResponse) return authRes;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'products';

    if (!file) {
      return NextResponse.json({ error: 'No CSV file provided' }, { status: 400 });
    }

    const csvText = await file.text();
    const rows = await parseCSV(csvText);

    let importedCount = 0;

    if (type === 'products') {
      const mapped = mapShopifyProductCSV(rows);

      for (const item of mapped) {
        // Upsert Brand if provided
        let brandId: string | null = null;
        if (item.brandName) {
          const brandSlug = slugify(item.brandName);
          const brand = await prisma.brand.upsert({
            where: { slug: brandSlug },
            update: {},
            create: {
              name: item.brandName,
              slug: brandSlug,
              description: `Authentic ${item.brandName} nicotine pouches.`,
            },
          });
          brandId = brand.id;
        }

        const slug = item.slug ? slugify(item.slug) : slugify(item.name);

        await prisma.product.upsert({
          where: { sku: item.sku },
          update: {
            name: item.name,
            description: item.description,
            shortDescription: item.shortDescription,
            price: item.price,
            comparePrice: item.comparePrice || null,
            stock: item.stock,
            featuredImage: item.featuredImage,
            galleryImages: item.galleryImages,
            brandId,
            tags: item.tags,
            strength: item.strength,
            flavor: item.flavor,
            pouchesPerCan: item.pouchesPerCan || 20,
          },
          create: {
            name: item.name,
            slug,
            sku: item.sku,
            description: item.description,
            shortDescription: item.shortDescription,
            price: item.price,
            comparePrice: item.comparePrice || null,
            stock: item.stock,
            featuredImage: item.featuredImage,
            galleryImages: item.galleryImages,
            brandId,
            tags: item.tags,
            strength: item.strength,
            flavor: item.flavor,
            pouchesPerCan: item.pouchesPerCan || 20,
          },
        });
        importedCount++;
      }
    } else if (type === 'customers') {
      const mapped = mapShopifyCustomerCSV(rows);
      for (const item of mapped) {
        await prisma.user.upsert({
          where: { email: item.email },
          update: {
            name: `${item.firstName} ${item.lastName}`.trim() || undefined,
            phone: item.phone || undefined,
            tags: item.tags,
            notes: item.notes,
          },
          create: {
            firebaseUid: `imported-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            email: item.email,
            name: `${item.firstName} ${item.lastName}`.trim() || 'Customer',
            phone: item.phone || null,
            tags: item.tags,
            notes: item.notes,
            role: Role.CUSTOMER,
          },
        });
        importedCount++;
      }
    } else if (type === 'brands') {
      for (const row of rows) {
        const name = row['Name'] || row['name'];
        if (!name) continue;
        const slug = row['Slug'] || row['slug'] || slugify(name);
        await prisma.brand.upsert({
          where: { slug },
          update: {
            description: row['Description'] || row['description'] || undefined,
            website: row['Website'] || row['website'] || undefined,
          },
          create: {
            name,
            slug,
            description: row['Description'] || row['description'] || `${name} nicotine pouches.`,
            website: row['Website'] || row['website'] || null,
          },
        });
        importedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      importedCount,
      message: `Successfully imported ${importedCount} records.`,
    });
  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json({ error: error.message || 'Import failed' }, { status: 500 });
  }
}

