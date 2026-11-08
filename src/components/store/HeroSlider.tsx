'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    tag: 'ULTRA STRENGTH COLLECTION',
    title: 'THE ULTIMATE KICK.',
    highlight: 'KILLA & PABLO EXTRA STRONG',
    description:
      'Engineered for maximum intensity. Discover authentic Scandinavian nicotine pouches delivered fresh to your door.',
    ctaText: 'Shop Extreme Pouches',
    ctaLink: '/products?strength=Ultra',
    secondaryCta: 'Explore Flavors',
    secondaryLink: '/products?flavor=Mint%20%26%20Ice',
    badge: '18-50mg/g High Voltage',
  },
  {
    tag: 'NEW ARRIVALS 2026',
    title: 'ARCTIC FROST & FRUIT.',
    highlight: 'VELO, ZYN & ICEBERG',
    description:
      'Crisp peppermint, iced spearmint, and exotic tropical blends with rapid nicotine absorption.',
    ctaText: 'Shop Best Sellers',
    ctaLink: '/products?isPopular=true',
    secondaryCta: 'Shop All Brands',
    secondaryLink: '/brands',
    badge: '100% Tobacco Free',
  },
  {
    tag: 'BULK SAVINGS & ROLLS',
    title: 'BUY MORE. SAVE BIG.',
    highlight: 'UP TO 30% OFF ROLLS OF 10',
    description:
      'Stock up on your daily essentials with our wholesale volume discounts and instant bulk savings.',
    ctaText: 'Claim Bulk Deals',
    ctaLink: '/products',
    secondaryCta: 'Wholesale B2B',
    secondaryLink: '/pages/wholesale',
    badge: 'Free UK Delivery Over £50',
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#09090b] via-[#0d0d10] to-[#09090b] border-b border-zinc-800/80 py-16 md:py-24">
      {/* Background Gold Ambient Glows */}
      <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-gold-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-gold-500/10 border border-gold-500/30 px-3.5 py-1 text-xs font-bold text-gold-400">
              <Zap className="h-3.5 w-3.5 fill-gold-400" />
              <span>{slide.tag}</span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-300 font-medium">{slide.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-[1.05]">
              {slide.title} <br />
              <span className="gold-gradient-text">{slide.highlight}</span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
              {slide.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={slide.ctaLink}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-gold-500 to-amber-600 px-8 py-4 text-sm font-extrabold text-black shadow-xl hover:brightness-110 active:scale-95 transition tracking-wider uppercase"
              >
                {slide.ctaText} <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={slide.secondaryLink}
                className="rounded-xl border border-zinc-700 bg-zinc-900/80 px-7 py-4 text-sm font-bold text-zinc-200 hover:bg-zinc-800 hover:text-white transition uppercase tracking-wider"
              >
                {slide.secondaryCta}
              </Link>
            </div>

            {/* Trust and Social Proof Badges */}
            <div className="pt-8 border-t border-zinc-800/80 grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <div className="flex items-center gap-1 text-gold-400">
                  <Star className="h-4 w-4 fill-gold-400" />
                  <span className="text-base font-black text-white">4.9 / 5</span>
                </div>
                <span className="text-[11px] text-zinc-500">Over 15,000+ Reviews</span>
              </div>

              <div>
                <span className="text-base font-black text-white block">18+ Brands</span>
                <span className="text-[11px] text-zinc-500">100% Genuine Stock</span>
              </div>

              <div>
                <span className="text-base font-black text-gold-400 block">Same-Day</span>
                <span className="text-[11px] text-zinc-500">UK Tracked Dispatch</span>
              </div>
            </div>
          </div>

          {/* Hero Feature Showcase Card */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="relative rounded-3xl bg-gradient-to-b from-[#18181d] to-[#0c0c0f] border border-gold-500/25 p-7 shadow-2xl gold-glow">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <span className="text-xs uppercase font-extrabold tracking-widest text-gold-400">
                  Featured Product
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/80 border border-rose-800 text-rose-400">
                  Ultra Strong
                </span>
              </div>

              <div className="py-6 flex flex-col items-center text-center">
                <div className="relative h-48 w-48 mb-4">
                  <div className="absolute inset-0 bg-gold-500/10 rounded-full blur-2xl" />
                  <img
                    src="https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=400&q=80"
                    alt="Killa Cold Mint"
                    className="h-full w-full object-contain relative z-10 drop-shadow-2xl"
                  />
                </div>

                <h3 className="text-xl font-black text-white uppercase">Killa Cold Mint</h3>
                <p className="text-xs text-zinc-400 mt-1">Ice Cold Menthol & Intense Rush</p>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-gold-400">£4.49</span>
                  <span className="text-xs text-zinc-500 line-through">£5.99</span>
                </div>

                <div className="mt-4 w-full grid grid-cols-2 gap-2 text-center text-[11px]">
                  <div className="p-2 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-300">
                    <span className="text-zinc-500 block">Strength</span>
                    <strong className="text-gold-400">16 mg/g</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-300">
                    <span className="text-zinc-500 block">Pouches</span>
                    <strong className="text-white">20 Slim</strong>
                  </div>
                </div>

                <Link
                  href="/products/killa-cold-mint"
                  className="mt-5 w-full rounded-xl bg-gold-500 hover:bg-gold-400 py-3 text-xs font-bold text-black uppercase tracking-wider transition text-center"
                >
                  View Product Spec
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="mt-10 flex items-center justify-between">
          <div className="flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === current ? 'w-8 bg-gold-400' : 'w-2 bg-zinc-800'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
              className="p-2 rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:border-gold-500/40 transition"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
              className="p-2 rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:border-gold-500/40 transition"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

