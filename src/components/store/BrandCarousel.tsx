import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const brands = [
  { name: 'Killa', slug: 'killa', origin: 'Denmark', tag: 'Extra Strong', color: '#ff2d55' },
  { name: 'Pablo', slug: 'pablo', origin: 'Denmark', tag: 'Dangerously Strong', color: '#ff3b30' },
  { name: 'Velo', slug: 'velo', origin: 'Sweden', tag: 'Smooth Scandinavian', color: '#007aff' },
  { name: 'ZYN', slug: 'zyn', origin: 'Sweden', tag: 'Market Leader', color: '#ff9500' },
  { name: 'Iceberg', slug: 'iceberg', origin: 'Poland', tag: 'Extreme Flavours', color: '#5856d6' },
  { name: 'White Fox', slug: 'white-fox', origin: 'Sweden', tag: 'Pure Essential Oils', color: '#34c759' },
  { name: 'Siberia', slug: 'siberia', origin: 'Sweden', tag: 'Extremely Strong', color: '#af52de' },
  { name: 'Kurwa', slug: 'kurwa', origin: 'EU', tag: 'Hyper Intense', color: '#ff2d55' },
  { name: 'Ace', slug: 'ace', origin: 'Denmark', tag: 'Super White', color: '#5ac8fa' },
  { name: 'Kelly White', slug: 'kelly-white', origin: 'Sweden', tag: 'Designer Flavours', color: '#ffcc00' },
  { name: 'Goat', slug: 'goat', origin: 'Sweden', tag: 'Fresh Formulations', color: '#30d158' },
  { name: 'Thor', slug: 'thor', origin: 'EU', tag: 'Nordic Thunder', color: '#0a84ff' },
  { name: 'Rush', slug: 'rush', origin: 'EU', tag: 'Fast Nicotine Rush', color: '#ffd60a' },
  { name: '77', slug: '77', origin: 'Poland', tag: 'Premium Slim', color: '#bf5af2' },
  { name: 'XQS', slug: 'xqs', origin: 'Sweden', tag: 'Unique Sweets', color: '#ff375f' },
  { name: 'Zone', slug: 'zone', origin: 'Sweden', tag: 'Comfort Soft Pouches', color: '#64d2ff' },
  { name: 'Jixx', slug: 'jixx', origin: 'EU', tag: 'Crisp Taste', color: '#32d74b' },
  { name: 'Greatest', slug: 'greatest', origin: 'Sweden', tag: 'Clean Kick', color: '#d4af37' },
];

export function BrandCarousel() {
  return (
    <section className="py-16 bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-gold-400">
              Official Stockist
            </span>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mt-1">
              Shop By Brand
            </h2>
          </div>
          <Link
            href="/brands"
            className="text-xs font-bold text-zinc-400 hover:text-gold-400 uppercase tracking-wider flex items-center gap-1 transition"
          >
            All 18+ Brands <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Brand Grid / Carousel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {brands.map((b) => (
            <Link
              key={b.slug}
              href={`/brands/${b.slug}`}
              className="group relative flex flex-col items-center justify-center rounded-2xl bg-[#111114] border border-zinc-800/90 p-5 text-center transition-all duration-300 hover:border-gold-500/50 hover:bg-[#16161b] hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-12 w-12 rounded-xl bg-black border border-zinc-800 flex items-center justify-center mb-3 shadow group-hover:border-gold-500/40 transition">
                <span className="text-lg font-black text-white uppercase tracking-tighter group-hover:text-gold-400 transition">
                  {b.name.slice(0, 2)}
                </span>
              </div>

              <h4 className="text-sm font-black text-zinc-100 uppercase tracking-wide group-hover:text-gold-400 transition">
                {b.name}
              </h4>
              <span className="text-[10px] text-zinc-500 mt-0.5">{b.origin}</span>

              <span className="mt-2.5 text-[9px] uppercase tracking-wider text-gold-400 font-semibold px-2 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/20">
                {b.tag}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

