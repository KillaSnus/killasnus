import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Snowflake, Cherry, Coffee } from 'lucide-react';

const flavors = [
  {
    name: 'Mint & Ice',
    slug: 'mint-ice',
    query: 'Mint & Ice',
    description: 'Crisp spearmint, peppermint frost, and arctic menthol bursts.',
    icon: Snowflake,
    accent: 'from-cyan-500/20 via-sky-500/10 to-transparent',
    border: 'hover:border-cyan-500/50',
    badge: 'Popular',
    bgImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80',
    itemCount: '45+ Blends',
  },
  {
    name: 'Fruit & Berry',
    slug: 'fruit-berry',
    query: 'Fruit & Berry',
    description: 'Wild berries, juicy watermelon, passion fruit, and citrus splash.',
    icon: Cherry,
    accent: 'from-rose-500/20 via-pink-500/10 to-transparent',
    border: 'hover:border-rose-500/50',
    badge: 'Trending',
    bgImage: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=600&q=80',
    itemCount: '38+ Blends',
  },
  {
    name: 'Cola & Energy',
    slug: 'cola-energy',
    query: 'Cola & Energy',
    description: 'Fizzy cola kick, iced energy drink, and sweet vanilla fizz.',
    icon: Coffee,
    accent: 'from-amber-500/20 via-orange-500/10 to-transparent',
    border: 'hover:border-amber-500/50',
    badge: 'Exclusive',
    bgImage: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    itemCount: '24+ Blends',
  },
];

export function FlavorGrid() {
  return (
    <section className="py-16 bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-gold-400">
              Taste The Difference
            </span>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mt-1">
              Shop By Flavour
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-zinc-400 hover:text-gold-400 uppercase tracking-wider flex items-center gap-1 transition"
          >
            Explore All Profiles <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {flavors.map((flavor) => {
            const Icon = flavor.icon;
            return (
              <Link
                key={flavor.slug}
                href={`/products?flavor=${encodeURIComponent(flavor.query)}`}
                className={`group relative overflow-hidden rounded-3xl bg-[#111114] border border-zinc-800 p-8 transition-all duration-300 ${flavor.border} hover:-translate-y-1 hover:shadow-2xl`}
              >
                {/* Ambient background accent */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${flavor.accent} opacity-60 group-hover:opacity-100 transition-opacity`}
                />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/60 border border-zinc-700 text-gold-400 shadow">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 bg-black/50 px-3 py-1 rounded-full border border-zinc-800">
                        {flavor.itemCount}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-gold-400 transition">
                      {flavor.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      {flavor.description}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gold-400 pt-4 border-t border-zinc-800/80">
                    <span>Shop Flavour</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

