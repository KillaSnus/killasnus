import React from 'react';
import Link from 'next/link';
import { Flame, ArrowRight, Gauge } from 'lucide-react';

const strengths = [
  {
    level: 'Light',
    mg: '4 - 8 mg/g',
    description: 'Smooth, subtle nicotine experience for beginners or casual use.',
    indicator: '1/5 Bars',
    color: 'from-emerald-500/20 text-emerald-400 border-emerald-500/30',
    barColor: 'bg-emerald-400',
    dotCount: 1,
  },
  {
    level: 'Medium',
    mg: '9 - 14 mg/g',
    description: 'Balanced daily kick with sustained satisfaction.',
    indicator: '2/5 Bars',
    color: 'from-blue-500/20 text-blue-400 border-blue-500/30',
    barColor: 'bg-blue-400',
    dotCount: 2,
  },
  {
    level: 'Strong',
    mg: '15 - 20 mg/g',
    description: 'Traditional Swedish strength with deep, noticeable release.',
    indicator: '3/5 Bars',
    color: 'from-amber-500/20 text-amber-400 border-amber-500/30',
    barColor: 'bg-amber-400',
    dotCount: 3,
  },
  {
    level: 'X-Strong',
    mg: '21 - 35 mg/g',
    description: 'High intensity hit formulated for experienced pouch users.',
    indicator: '4/5 Bars',
    color: 'from-orange-500/20 text-orange-400 border-orange-500/30',
    barColor: 'bg-orange-500',
    dotCount: 4,
  },
  {
    level: 'Ultra',
    mg: '50+ mg/g',
    description: 'Extreme maximum voltage. Raw power not for the faint of heart.',
    indicator: '5/5 Bars',
    color: 'from-rose-500/25 text-rose-400 border-rose-500/40',
    barColor: 'bg-rose-500',
    dotCount: 5,
    isExtreme: true,
  },
];

export function StrengthGrid() {
  return (
    <section className="py-16 bg-[#0c0c0f] border-y border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-gold-400 flex items-center gap-1.5">
              <Gauge className="h-4 w-4" /> Power Indicator
            </span>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mt-1">
              Shop By Strength
            </h2>
          </div>
          <p className="text-xs text-zinc-400 max-w-md">
            Find the precise nicotine intensity that matches your tolerance and preference.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {strengths.map((item) => (
            <Link
              key={item.level}
              href={`/products?strength=${encodeURIComponent(item.level)}`}
              className={`group relative rounded-2xl bg-[#111114] border border-zinc-800/80 p-5 flex flex-col justify-between transition-all duration-300 hover:border-gold-500/50 hover:-translate-y-1 hover:shadow-xl ${
                item.isExtreme ? 'border-rose-900/40 bg-gradient-to-b from-[#191012] to-[#111114]' : ''
              }`}
            >
              <div>
                {/* Strength Meter Dots */}
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((idx) => (
                    <div
                      key={idx}
                      className={`h-2 flex-1 rounded-full transition-all ${
                        idx <= item.dotCount ? item.barColor : 'bg-zinc-800'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white uppercase group-hover:text-gold-400 transition">
                    {item.level}
                  </h3>
                  {item.isExtreme && <Flame className="h-4 w-4 text-rose-500 animate-pulse" />}
                </div>

                <span className="text-xs font-bold text-gold-400 block mt-1">{item.mg}</span>

                <p className="text-[11px] text-zinc-400 mt-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-bold uppercase text-zinc-300 group-hover:text-gold-400 transition">
                <span>View Pouches</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

