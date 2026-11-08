'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Timer, Zap, ArrowRight } from 'lucide-react';

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 24, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#17140b] via-[#1f1906] to-[#17140b] border-y border-gold-500/30 py-4 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/30">
            <Timer className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-extrabold text-gold-400 flex items-center gap-1">
                <Zap className="h-3 w-3 fill-gold-400" /> Flash Offer Ends In
              </span>
            </div>
            <p className="text-sm font-bold text-white">
              Buy 5 Cans, Get 1 FREE + Extra 10% Off With Code <span className="text-gold-400 font-mono">SAVE10</span>
            </p>
          </div>
        </div>

        {/* Timer Blocks */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center justify-center rounded-lg bg-black/80 border border-gold-500/40 px-3 py-1.5 min-w-[52px]">
            <span className="text-lg font-black text-gold-400 font-mono">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-zinc-400">Hours</span>
          </div>
          <span className="text-gold-400 font-black text-base">:</span>
          <div className="flex flex-col items-center justify-center rounded-lg bg-black/80 border border-gold-500/40 px-3 py-1.5 min-w-[52px]">
            <span className="text-lg font-black text-gold-400 font-mono">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-zinc-400">Mins</span>
          </div>
          <span className="text-gold-400 font-black text-base">:</span>
          <div className="flex flex-col items-center justify-center rounded-lg bg-black/80 border border-gold-500/40 px-3 py-1.5 min-w-[52px]">
            <span className="text-lg font-black text-gold-400 font-mono">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-zinc-400">Secs</span>
          </div>

          <Link
            href="/products?onSale=true"
            className="ml-2 hidden sm:flex items-center gap-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 px-4 py-2 text-xs font-bold text-black uppercase tracking-wider transition"
          >
            Shop Sale <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

