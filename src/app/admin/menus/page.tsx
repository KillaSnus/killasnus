'use client';

import React, { useState } from 'react';
import { Menu as MenuIcon, Plus, Trash2, Save, Check } from 'lucide-react';

export default function AdminMenusPage() {
  const [headerLinks, setHeaderLinks] = useState([
    { label: 'Shop All', href: '/products' },
    { label: 'Flavours', href: '/products?flavor=Mint%20%26%20Ice' },
    { label: 'Strengths', href: '/products?strength=Strong' },
    { label: 'Brands', href: '/brands' },
    { label: 'Blog', href: '/blog' },
    { label: 'Wholesale B2B', href: '/pages/wholesale' },
    { label: 'VIP Rewards', href: '/pages/rewards' },
  ]);

  const [newLabel, setNewLabel] = useState('');
  const [newHref, setNewHref] = useState('');
  const [saved, setSaved] = useState(false);

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newHref) return;
    setHeaderLinks([...headerLinks, { label: newLabel, href: newHref }]);
    setNewLabel('');
    setNewHref('');
  };

  const handleRemove = (index: number) => {
    setHeaderLinks(headerLinks.filter((_, idx) => idx !== index));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400">Navigation</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-0.5">
            Menus & Links Manager
          </h1>
          <p className="text-xs text-zinc-400">
            Configure header primary navigation and footer link categories.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-extrabold uppercase tracking-wider transition shadow"
        >
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? 'Saved!' : 'Save Menus'}
        </button>
      </div>

      <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
          Header Main Navigation Links
        </h2>

        <div className="space-y-2">
          {headerLinks.map((link, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <MenuIcon className="h-4 w-4 text-gold-400" />
                <span className="font-bold text-white">{link.label}</span>
                <span className="font-mono text-zinc-500">{link.href}</span>
              </div>

              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="text-zinc-500 hover:text-rose-400 p-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddLink} className="pt-4 border-t border-zinc-800 flex gap-2">
          <input
            type="text"
            required
            placeholder="Label (e.g. Flash Sale)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="flex-1 rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
          />
          <input
            type="text"
            required
            placeholder="Path (e.g. /products?sale=true)"
            value={newHref}
            onChange={(e) => setNewHref(e.target.value)}
            className="flex-1 rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white font-mono"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs uppercase"
          >
            Add Link
          </button>
        </form>
      </div>
    </div>
  );
}

