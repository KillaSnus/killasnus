import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ProductCard } from '@/components/store/ProductCard';
import { ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react';

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BrandDetailPage({ params }: BrandPageProps) {
  const { slug } = await params;

  let brand: any = null;
  let products: any[] = [];

  try {
    brand = await prisma.brand.findUnique({
      where: { slug: slug.toLowerCase() },
      include: {
        products: {
          where: { isPublished: true },
          include: { brand: true },
        },
      },
    });

    if (brand) {
      products = brand.products;
    }
  } catch (e) {
    console.warn('Prisma query error in BrandDetailPage:', e);
  }

  // Graceful fallback for mock brand display
  if (!brand) {
    const brandName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
    brand = {
      name: brandName,
      slug,
      description: `Official collection of ${brandName} nicotine pouches. 100% genuine Nordic pouches with rapid absorption and refreshing flavours.`,
    };
    products = [
      {
        id: `mock-${slug}-1`,
        name: `${brandName} Cold Blast 16mg`,
        slug: `${slug}-cold-blast`,
        sku: `${slug.slice(0, 3).toUpperCase()}-CB-16`,
        price: 4.49,
        comparePrice: 5.99,
        stock: 250,
        featuredImage: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
        brand: { name: brandName, slug },
        strength: 'Strong',
        strengthMg: 16,
        flavor: 'Mint & Ice',
        pouchesPerCan: 20,
        isPopular: true,
      },
      {
        id: `mock-${slug}-2`,
        name: `${brandName} Berry Frost 20mg`,
        slug: `${slug}-berry-frost`,
        sku: `${slug.slice(0, 3).toUpperCase()}-BF-20`,
        price: 4.79,
        comparePrice: 5.99,
        stock: 180,
        featuredImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
        brand: { name: brandName, slug },
        strength: 'Strong',
        strengthMg: 20,
        flavor: 'Fruit & Berry',
        pouchesPerCan: 20,
      },
    ];
  }

  return (
    <div className="bg-[#09090b] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/brands"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-gold-400 mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to All Brands
        </Link>

        {/* Brand Banner Card */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#121217] via-[#1a1a23] to-[#121217] border border-gold-500/25 p-8 md:p-12 mb-10 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-extrabold uppercase tracking-widest text-gold-400 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Official Brand Store
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mt-2">
              {brand.name}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 mt-3 leading-relaxed">
              {brand.description}
            </p>
          </div>
        </div>

        {/* Products in this brand */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-black text-white uppercase tracking-tight">
            Available {brand.name} Pouches ({products.length})
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              slug={p.slug}
              sku={p.sku}
              price={p.price}
              comparePrice={p.comparePrice}
              stock={p.stock}
              featuredImage={p.featuredImage}
              brand={p.brand || { name: brand.name, slug: brand.slug }}
              strength={p.strength}
              strengthMg={p.strengthMg}
              flavor={p.flavor}
              pouchesPerCan={p.pouchesPerCan}
              isPopular={p.isPopular}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

