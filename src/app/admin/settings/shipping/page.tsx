'use client';

import React, { useState } from 'react';
import { Truck, Plus, Save, Check } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminShippingSettingsPage() {
  const [freeThreshold, setFreeThreshold] = useState('50.00');
  const [standardRate, setStandardRate] = useState('4.99');
  const [expressRate, setExpressRate] = useState('7.99');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400">Logistics</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-0.5">
            Shipping Zones & Rates
          </h1>
          <p className="text-xs text-zinc-400">
            Define dispatch rates, couriers, and free shipping thresholds.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-extrabold uppercase tracking-wider transition shadow"
        >
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? 'Saved!' : 'Save Rates'}
        </button>
      </div>

      <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-6">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
          Domestic UK Shipping Rates
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Free Shipping Threshold (£)
            </label>
            <input
              type="number"
              step="0.01"
              value={freeThreshold}
              onChange={(e) => setFreeThreshold(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
            />
            <span className="text-[10px] text-zinc-500 mt-1 block">
              Cart subtotals at or above this get free shipping.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Standard Tracked Rate (£)
            </label>
            <input
              type="number"
              step="0.01"
              value={standardRate}
              onChange={(e) => setStandardRate(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
            />
            <span className="text-[10px] text-zinc-500 mt-1 block">
              Royal Mail 48 Tracked (2-3 days)
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Express Next-Day Rate (£)
            </label>
            <input
              type="number"
              step="0.01"
              value={expressRate}
              onChange={(e) => setExpressRate(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
            />
            <span className="text-[10px] text-zinc-500 mt-1 block">
              DPD / Special Delivery by 12PM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

