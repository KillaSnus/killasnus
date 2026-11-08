import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'All Brands | KILLASNUS',
  description: 'Shop genuine nicotine pouches by brand: Killa, Pablo, Velo, ZYN, Iceberg, Kurwa, White Fox, and 18+ Scandinavian manufacturers.',
};

export default async function BrandsPage() {
  let dbBrands: any[] = [];
  try {
    dbBrands = await prisma.brand.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  } catch (e) {
    console.warn('Prisma error in BrandsPage:', e);
  }

  const defaultBrands = [
    { name: 'Killa', slug: 'killa', origin: 'Denmark', desc: 'World famous extra strong mint and fruit pouches.' },
    { name: 'Pablo', slug: 'pablo', origin: 'Denmark', desc: 'Maximum adrenaline 50mg nicotine punch for seasoned veterans.' },
    { name: 'Velo', slug: 'velo', origin: 'Sweden', desc: 'Pure Scandinavian quality and crisp balanced formulations.' },
    { name: 'ZYN', slug: 'zyn', origin: 'Sweden', desc: 'The global market benchmark in all-white discreet pouches.' },
    { name: 'Iceberg', slug: 'iceberg', origin: 'Poland', desc: 'Wild flavour combinations with extreme nicotine strengths.' },
    { name: 'White Fox', slug: 'white-fox', origin: 'Sweden', desc: 'Crafted with essential peppermint oils and fleece pouches.' },
    { name: 'Siberia', slug: 'siberia', origin: 'Sweden', desc: 'Legendary intensity known across the snus world.' },
    { name: 'Kurwa', slug: 'kurwa', origin: 'EU', desc: 'Explosive fruit candies and brutal energy blends.' },
    { name: 'Ace', slug: 'ace', origin: 'Denmark', desc: 'Ultra clean mint profile with high quality soft pouches.' },
    { name: 'Kelly White', slug: 'kelly-white', origin: 'Sweden', desc: 'Chic, designer flavors like sweet melon and raspberry.' },
    { name: 'Goat', slug: 'goat', origin: 'Sweden', desc: 'Modern slim pouches with rapid nicotine release.' },
    { name: 'Thor', slug: 'thor', origin: 'EU', desc: 'Nordic thunder strength with icy chill.' },
    { name: 'Rush', slug: 'rush', origin: 'EU', desc: 'Fast onset and long lasting fresh satisfaction.' },
    { name: '77', slug: '77', origin: 'Poland', desc: 'Sleek slim nicotine pouches with rich aromatic profiles.' },
    { name: 'XQS', slug: 'xqs', origin: 'Sweden', desc: 'Famous for fizzy cola, blueberry mint, and cactus sour.' },
    { name: 'Zone', slug: 'zone', origin: 'Sweden', desc: 'Soft-feel pouch technology designed for all-day comfort.' },
    { name: 'Jixx', slug: 'jixx', origin: 'EU', desc: 'Crisp fruit & cool menthol blends.' },
    { name: 'Greatest', slug: 'greatest', origin: 'Sweden', desc: 'High purity nicotine pouches manufactured in Sweden.' },
  ];

  const brandList = dbBrands.length > 0 ? dbBrands : defaultBrands;

  return (
    <div className="bg-[#09090b] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-gold-400">
            Certified Scandinavian Brands
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mt-2">
            Explore All 18+ Brands
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Every can in our catalog is 100% genuine, directly imported from licensed manufacturers in Sweden, Denmark, and Europe.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandList.map((brand: any) => (
            <Link
              key={brand.slug}
              href={`/brands/${brand.slug}`}
              className="group rounded-2xl bg-[#111114] border border-zinc-800 p-6 flex flex-col justify-between hover:border-gold-500/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center group-hover:border-gold-500/40 transition">
                    <span className="text-xl font-black text-white uppercase tracking-tighter group-hover:text-gold-400 transition">
                      {brand.name.slice(0, 2)}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-400 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                    {brand.origin || 'Nordic'}
                  </span>
                </div>

                <h3 className="text-xl font-black text-white uppercase group-hover:text-gold-400 transition">
                  {brand.name}
                </h3>

                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  {brand.description || brand.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-bold uppercase text-gold-400">
                <span>Shop Collection</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

