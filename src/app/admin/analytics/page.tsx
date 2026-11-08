'use client';

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Award,
  ArrowUpRight,
  Package,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminAnalyticsPage() {
  const topBrands = [
    { name: 'Killa', sales: 4250.0, share: '32%', cans: '945 cans' },
    { name: 'Pablo', sales: 3890.5, share: '29%', cans: '780 cans' },
    { name: 'Velo', sales: 2410.0, share: '18%', cans: '490 cans' },
    { name: 'ZYN', sales: 1840.0, share: '14%', cans: '385 cans' },
    { name: 'Iceberg', sales: 940.0, share: '7%', cans: '170 cans' },
  ];

  const salesByFlavor = [
    { flavor: 'Mint & Ice', percentage: 58, color: 'bg-cyan-500' },
    { flavor: 'Fruit & Berry', percentage: 26, color: 'bg-rose-500' },
    { flavor: 'Cola & Energy', percentage: 16, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-gold-400">Intelligence</span>
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-0.5">
          Store Analytics & Insights
        </h1>
        <p className="text-xs text-zinc-400">
          Conversion metrics, brand market share, and revenue velocity.
        </p>
      </div>

      {/* 3 Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Conversion Rate
          </span>
          <div className="text-3xl font-black text-white mt-3">3.84%</div>
          <span className="text-xs text-emerald-400 font-semibold mt-1 block">
            +0.42% vs industry avg (3.1%)
          </span>
        </div>

        <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Avg Lifetime Value (LTV)
          </span>
          <div className="text-3xl font-black text-gold-400 mt-3">{formatPrice(184.5)}</div>
          <span className="text-xs text-zinc-400 mt-1 block">Based on 3.9 repeat orders/customer</span>
        </div>

        <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Cart Abandonment
          </span>
          <div className="text-3xl font-black text-white mt-3">22.4%</div>
          <span className="text-xs text-emerald-400 font-semibold mt-1 block">
            Lower than 30% European average
          </span>
        </div>
      </div>

      {/* Flavor Share Breakdown */}
      <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
          Revenue by Flavour Profile
        </h2>

        <div className="space-y-4 pt-2">
          {salesByFlavor.map((item) => (
            <div key={item.flavor} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-white">{item.flavor}</span>
                <span className="text-gold-400 font-bold">{item.percentage}% of sales</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Brands Table */}
      <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
          Top Performing Brands
        </h2>

        <div className="divide-y divide-zinc-800">
          {topBrands.map((b) => (
            <div key={b.name} className="py-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-black border border-zinc-800 flex items-center justify-center font-bold text-gold-400">
                  {b.name.slice(0, 1)}
                </div>
                <div>
                  <h4 className="font-bold text-white">{b.name}</h4>
                  <span className="text-[10px] text-zinc-500">{b.cans}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono font-bold text-white">{formatPrice(b.sales)}</span>
                <span className="text-[10px] text-gold-400 block">{b.share} market share</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

