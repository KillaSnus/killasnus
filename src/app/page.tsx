import React from 'react';
import Link from 'next/link';
import { HeroSlider } from '@/components/store/HeroSlider';
import { CountdownTimer } from '@/components/store/CountdownTimer';
import { FlavorGrid } from '@/components/store/FlavorGrid';
import { StrengthGrid } from '@/components/store/StrengthGrid';
import { BrandCarousel } from '@/components/store/BrandCarousel';
import { ProductCard } from '@/components/store/ProductCard';
import prisma from '@/lib/prisma';
import { ArrowRight, Flame, Zap, ShieldCheck, Truck, Sparkles, BookOpen } from 'lucide-react';
import { formatDate } from '@/lib/utils';

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
  let popularProducts: any[] = [];
  let latestProducts: any[] = [];
  let blogPosts: any[] = [];

  try {
    [popularProducts, latestProducts, blogPosts] = await Promise.all([
      prisma.product.findMany({
        where: { isPublished: true, isPopular: true },
        include: { brand: true },
        take: 8,
      }),
      prisma.product.findMany({
        where: { isPublished: true },
        include: { brand: true },
        orderBy: { createdAt: 'desc' },
        take: 8,
      }),
      prisma.blogPost.findMany({
        where: { isPublished: true },
        take: 3,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
  } catch (e) {
    console.warn('Prisma query fallback in HomePage:', e);
  }

  // Fallback initial products if database hasn't been seeded yet
  if (popularProducts.length === 0) {
    popularProducts = [
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
      {
        id: 'p-5',
        name: 'Killa Watermelon Extra',
        slug: 'killa-watermelon-extra',
        sku: 'KIL-WM-16',
        price: 4.49,
        comparePrice: 5.99,
        stock: 280,
        featuredImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
        brand: { name: 'Killa', slug: 'killa' },
        strength: 'Strong',
        strengthMg: 16,
        flavor: 'Fruit & Berry',
        pouchesPerCan: 20,
        isPopular: true,
      },
      {
        id: 'p-6',
        name: 'Iceberg Energy Cola 150mg',
        slug: 'iceberg-energy-cola-150mg',
        sku: 'ICE-COL-150',
        price: 5.49,
        comparePrice: 6.99,
        stock: 200,
        featuredImage: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=600&q=80',
        brand: { name: 'Iceberg', slug: 'iceberg' },
        strength: 'Ultra',
        strengthMg: 150,
        flavor: 'Cola & Energy',
        pouchesPerCan: 20,
        isPopular: true,
      },
      {
        id: 'p-7',
        name: 'White Fox Full Charge',
        slug: 'white-fox-full-charge',
        sku: 'WF-FC-16',
        price: 4.69,
        comparePrice: 5.49,
        stock: 310,
        featuredImage: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
        brand: { name: 'White Fox', slug: 'white-fox' },
        strength: 'Strong',
        strengthMg: 16,
        flavor: 'Mint & Ice',
        pouchesPerCan: 20,
        isPopular: true,
      },
      {
        id: 'p-8',
        name: 'Kurwa Fatality Brutal Energy',
        slug: 'kurwa-fatality-brutal-energy',
        sku: 'KUR-FAT-50',
        price: 5.29,
        comparePrice: 6.8,
        stock: 190,
        featuredImage: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
        brand: { name: 'Kurwa', slug: 'kurwa' },
        strength: 'Ultra',
        strengthMg: 50,
        flavor: 'Cola & Energy',
        pouchesPerCan: 20,
        isPopular: true,
      },
    ];
  }

  if (latestProducts.length === 0) {
    latestProducts = popularProducts;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Slider */}
      <HeroSlider />

      {/* 2. Flash Countdown Deals Banner */}
      <CountdownTimer />

      {/* 3. Most Popular Products (Bestsellers) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-gold-400 fill-gold-400" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-gold-400">
                Trending Now
              </span>
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mt-1">
              Most Popular Products
            </h2>
          </div>
          <Link
            href="/products?isPopular=true"
            className="text-xs font-bold text-zinc-400 hover:text-gold-400 uppercase tracking-wider flex items-center gap-1 transition"
          >
            View All Bestsellers <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {popularProducts.slice(0, 8).map((product) => (
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
      </section>

      {/* 4. Shop by Flavour */}
      <FlavorGrid />

      {/* 5. Shop by Strength */}
      <StrengthGrid />

      {/* 6. Featured Brands & Logos */}
      <BrandCarousel />

      {/* 7. Latest Products Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-gold-400">
              Fresh Inventory
            </span>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mt-1">
              New Arrivals & Restocks
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-zinc-400 hover:text-gold-400 uppercase tracking-wider flex items-center gap-1 transition"
          >
            Explore Catalog <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {latestProducts.slice(0, 8).map((product) => (
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
            />
          ))}
        </div>
      </section>

      {/* 8. Promotional Value Props Bar */}
      <section className="py-12 bg-gradient-to-r from-[#0d0d10] via-[#15151c] to-[#0d0d10] border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-black/40 border border-zinc-800">
              <div className="h-10 w-10 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white uppercase">Free UK Shipping</h4>
                <p className="text-[11px] text-zinc-400">On all orders over £50</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-black/40 border border-zinc-800">
              <div className="h-10 w-10 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white uppercase">100% Genuine</h4>
                <p className="text-[11px] text-zinc-400">Direct from Scandinavian labs</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-black/40 border border-zinc-800">
              <div className="h-10 w-10 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white uppercase">Fresh Batch</h4>
                <p className="text-[11px] text-zinc-400">Maximum moisture & flavour</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-black/40 border border-zinc-800">
              <div className="h-10 w-10 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white uppercase">Same-Day Dispatch</h4>
                <p className="text-[11px] text-zinc-400">Order before 2 PM Mon-Fri</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Blog Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-gold-400 flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" /> Guides & News
            </span>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mt-1">
              From The Snus Journal
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-xs font-bold text-zinc-400 hover:text-gold-400 uppercase tracking-wider flex items-center gap-1 transition"
          >
            Read All Articles <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(blogPosts.length > 0
            ? blogPosts
            : [
                {
                  id: 'b-1',
                  title: 'The Ultimate Guide to Nicotine Pouch Strengths: How to Choose',
                  slug: 'guide-to-nicotine-pouch-strengths',
                  excerpt:
                    'Confused by mg/g vs mg per pouch? Learn how to calculate the real strength and pick the right level for your needs.',
                  readTime: 4,
                  createdAt: new Date(),
                  featuredImage:
                    'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
                },
                {
                  id: 'b-2',
                  title: 'Top 5 Mint Flavours Ranked: From Arctic Freeze to Sweet Spearmint',
                  slug: 'top-5-mint-flavours-ranked',
                  excerpt:
                    'We put Velo, Killa, Pablo and White Fox mint pouches head to head in our comprehensive taste and burn test.',
                  readTime: 5,
                  createdAt: new Date(),
                  featuredImage:
                    'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80',
                },
                {
                  id: 'b-3',
                  title: 'Tobacco-Free vs Traditional Snus: What You Need to Know',
                  slug: 'tobacco-free-vs-traditional-snus',
                  excerpt:
                    'Why modern white nicotine pouches have taken over the market without yellowing teeth or producing smoke.',
                  readTime: 6,
                  createdAt: new Date(),
                  featuredImage:
                    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
                },
              ]
          ).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl bg-[#111114] border border-zinc-800 overflow-hidden hover:border-gold-500/40 transition hover:-translate-y-1"
            >
              <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500 mb-2">
                    <span>{formatDate(post.createdAt)}</span>
                    <span>•</span>
                    <span className="text-gold-400 font-medium">{post.readTime} min read</span>
                  </div>
                  <h3 className="text-base font-bold text-zinc-100 group-hover:text-gold-400 transition line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center text-xs font-bold uppercase text-gold-400">
                  Read Article <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

