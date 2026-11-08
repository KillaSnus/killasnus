'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, Sparkles, ShieldCheck } from 'lucide-react';

export function AnnouncementBar() {
  return (
    <div className="bg-[#0c0c0e] border-b border-gold-500/20 text-xs py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-zinc-300">
        <div className="flex items-center gap-2">
          <Truck className="h-3.5 w-3.5 text-gold-400" />
          <span>
            <strong className="text-white">FREE UK DELIVERY</strong> on all orders over{' '}
            <span className="text-gold-400 font-semibold">£50</span>
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-6 text-[11px] uppercase tracking-wider text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-gold-400" /> 100% Tobacco Free Pouches
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3 text-gold-400" /> Fresh Batch Guaranteed
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/products?onSale=true"
            className="text-gold-400 hover:text-gold-300 font-semibold underline underline-offset-4 transition"
          >
            Flash Deals ⚡ 20% OFF
          </Link>
          <span className="text-zinc-600">|</span>
          <Link href="/pages/wholesale" className="hover:text-white transition">
            Wholesale B2B
          </Link>
        </div>
      </div>
    </div>
  );
}

