import React from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/store/ProductCard';
import prisma from '@/lib/prisma';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Sparkles, Check } from 'lucide-react';

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    brand?: string;
    flavor?: string;
    strength?: string;
    sort?: string;
    onSale?: string;
    isPopular?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}

export default async function ProductsCatalogPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const search = params.search || '';
  const selectedBrand = params.brand || '';
  const selectedFlavor = params.flavor || '';
  const selectedStrength = params.strength || '';
  const sort = params.sort || 'popular';
  const onSale = params.onSale === 'true';
  const isPopular = params.isPopular === 'true';
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;

  // Build Prisma where clause
  const where: any = {
    isPublished: true,
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { tags: { has: search } },
    ];
  }

  if (selectedBrand) {
    where.brand = {
      slug: { equals: selectedBrand.toLowerCase() },
    };
  }

  if (selectedFlavor) {
    where.flavor = { equals: selectedFlavor };
  }

  if (selectedStrength) {
    where.strength = { equals: selectedStrength };
  }

  if (isPopular) {
    where.isPopular = true;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  // Sorting
  let orderBy: any = { isPopular: 'desc' };
  if (sort === 'price-asc') orderBy = { price: 'asc' };
  if (sort === 'price-desc') orderBy = { price: 'desc' };
  if (sort === 'newest') orderBy = { createdAt: 'desc' };
  if (sort === 'name-asc') orderBy = { name: 'asc' };

  let products: any[] = [];
  let brands: any[] = [];

  try {
    [products, brands] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        include: { brand: true },
      }),
      prisma.brand.findMany({
        orderBy: { name: 'asc' },
      }),
    ]);
  } catch (e) {
    console.warn('Prisma error in ProductsPage:', e);
  }

  // Fallback products if DB empty
  if (products.length === 0 && !search && !selectedBrand && !selectedFlavor && !selectedStrength) {
    products = [
      {
        id: 'p-1',
        name: 'Killa Cold Mint 16mg',
        slug: 'killa-cold-mint-16mg',
        sku: 'KIL-CM-16',
        price: 4.49,
        comparePrice: 5.99,
        stock: 500,
        featuredImage: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
        brand: { name: 'Killa', slug: 'killa' },
        strength: 'Strong',
        strengthMg: 16,
        flavor: 'Mint & Ice',
        pouchesPerCan: 20,
        isPopular: true,
      },
      {
        id: 'p-2',
        name: 'Pablo Ice Cold 50mg',
        slug: 'pablo-ice-cold-50mg',
        sku: 'PAB-IC-50',
        price: 4.99,
        comparePrice: 6.49,
        stock: 350,
        featuredImage: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
        brand: { name: 'Pablo', slug: 'pablo' },
        strength: 'Ultra',
        strengthMg: 50,
        flavor: 'Mint & Ice',
        pouchesPerCan: 20,
        isPopular: true,
      },
      {
        id: 'p-3',
        name: 'Velo Freeze X-Strong',
        slug: 'velo-freeze-x-strong',
        sku: 'VEL-FRZ-16',
        price: 4.89,
        comparePrice: 5.5,
        stock: 600,
        featuredImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
        brand: { name: 'Velo', slug: 'velo' },
        strength: 'X-Strong',
        strengthMg: 16,
        flavor: 'Mint & Ice',
        pouchesPerCan: 20,
        isPopular: true,
      },
      {
        id: 'p-4',
        name: 'ZYN Cool Mint Slim',
        slug: 'zyn-cool-mint-slim',
        sku: 'ZYN-CM-11',
        price: 4.79,
        comparePrice: 5.25,
        stock: 450,
        featuredImage: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
        brand: { name: 'ZYN', slug: 'zyn' },
        strength: 'Medium',
        strengthMg: 11,
        flavor: 'Mint & Ice',
        pouchesPerCan: 20,
        isPopular: true,
      },
    ];
  }

  const allFlavors = ['Mint & Ice', 'Fruit & Berry', 'Cola & Energy'];
  const allStrengths = ['Light', 'Medium', 'Strong', 'X-Strong', 'Ultra'];

  const hasActiveFilters = Boolean(
    selectedBrand || selectedFlavor || selectedStrength || search || onSale
  );

  return (
    <div className="bg-[#09090b] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
            <Link href="/" className="hover:text-gold-400">Home</Link>
            <span>/</span>
            <span className="text-zinc-300">All Nicotine Pouches</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                {selectedBrand
                  ? `${selectedBrand.toUpperCase()} NICOTINE POUCHES`
                  : selectedFlavor
                  ? `${selectedFlavor.toUpperCase()} POUCHES`
                  : selectedStrength
                  ? `${selectedStrength.toUpperCase()} STRENGTH POUCHES`
                  : 'Shop All Nicotine Pouches'}
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Showing {products.length} premium tobacco-free nicotine pouches
              </p>
            </div>

            {/* Sorting links */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-500 flex items-center gap-1">
                <ArrowUpDown className="h-3 w-3" /> Sort:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Popular', val: 'popular' },
                  { label: 'Price: Low-High', val: 'price-asc' },
                  { label: 'Price: High-Low', val: 'price-desc' },
                  { label: 'Newest', val: 'newest' },
                ].map((s) => (
                  <Link
                    key={s.val}
                    href={`/products?${new URLSearchParams({
                      ...(selectedBrand ? { brand: selectedBrand } : {}),
                      ...(selectedFlavor ? { flavor: selectedFlavor } : {}),
                      ...(selectedStrength ? { strength: selectedStrength } : {}),
                      ...(search ? { search } : {}),
                      sort: s.val,
                    }).toString()}`}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                      sort === s.val
                        ? 'bg-gold-500 text-black border-gold-400'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Layout Grid with Sidebar Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="space-y-6">
            <div className="rounded-2xl bg-[#111114] border border-zinc-800/80 p-5 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5 text-gold-400" /> Filters
                </span>
                {hasActiveFilters && (
                  <Link
                    href="/products"
                    className="text-[11px] text-gold-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <X className="h-3 w-3" /> Clear All
                  </Link>
                )}
              </div>

              {/* Flavours Filter */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-300 mb-3">
                  Flavour Profile
                </h4>
                <div className="space-y-1.5">
                  {allFlavors.map((flavor) => {
                    const active = selectedFlavor === flavor;
                    return (
                      <Link
                        key={flavor}
                        href={`/products?${new URLSearchParams({
                          ...(selectedBrand ? { brand: selectedBrand } : {}),
                          ...(active ? {} : { flavor }),
                          ...(selectedStrength ? { strength: selectedStrength } : {}),
                          sort,
                        }).toString()}`}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition ${
                          active
                            ? 'bg-gold-500/15 border border-gold-500/40 text-gold-400 font-bold'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                        }`}
                      >
                        <span>{flavor}</span>
                        {active && <Check className="h-3.5 w-3.5 text-gold-400" />}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Strength Filter */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-300 mb-3">
                  Strength Level
                </h4>
                <div className="space-y-1.5">
                  {allStrengths.map((st) => {
                    const active = selectedStrength === st;
                    return (
                      <Link
                        key={st}
                        href={`/products?${new URLSearchParams({
                          ...(selectedBrand ? { brand: selectedBrand } : {}),
                          ...(selectedFlavor ? { flavor: selectedFlavor } : {}),
                          ...(active ? {} : { strength: st }),
                          sort,
                        }).toString()}`}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition ${
                          active
                            ? 'bg-gold-500/15 border border-gold-500/40 text-gold-400 font-bold'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                        }`}
                      >
                        <span>{st}</span>
                        {active && <Check className="h-3.5 w-3.5 text-gold-400" />}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Brands Filter */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-300 mb-3">
                  Brand
                </h4>
                <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                  {[
                    'Killa', 'Pablo', 'Velo', 'ZYN', 'Iceberg', 'White Fox', 'Siberia',
                    'Kurwa', 'Ace', 'Kelly White', 'Goat', 'Thor', 'Rush', '77', 'XQS', 'Zone'
                  ].map((brandName) => {
                    const slug = brandName.toLowerCase().replace(/\s+/g, '-');
                    const active = selectedBrand.toLowerCase() === slug;
                    return (
                      <Link
                        key={brandName}
                        href={`/products?${new URLSearchParams({
                          ...(active ? {} : { brand: slug }),
                          ...(selectedFlavor ? { flavor: selectedFlavor } : {}),
                          ...(selectedStrength ? { strength: selectedStrength } : {}),
                          sort,
                        }).toString()}`}
                        className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition ${
                          active
                            ? 'bg-gold-500/15 border border-gold-500/40 text-gold-400 font-bold'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                        }`}
                      >
                        <span>{brandName}</span>
                        {active && <Check className="h-3.5 w-3.5 text-gold-400" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-12 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-zinc-500">
                  <Filter className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No matching products found</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-6">
                  Try clearing your filters or searching for another flavor or strength.
                </p>
                <Link
                  href="/products"
                  className="inline-flex rounded-lg bg-gold-500 px-6 py-2.5 text-xs font-bold text-black uppercase tracking-wider"
                >
                  Reset All Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    sku={product.sku}
                    price={product.price}
                    comparePrice={product.comparePrice}
                    stock={product.stock}
                    featuredImage={product.featuredImage}
                    brand={product.brand}
                    strength={product.strength}
                    strengthMg={product.strengthMg}
                    flavor={product.flavor}
                    pouchesPerCan={product.pouchesPerCan}
                    isPopular={product.isPopular}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

