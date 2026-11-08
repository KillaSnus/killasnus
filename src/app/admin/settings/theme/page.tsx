'use client';

import React, { useState } from 'react';
import { Palette, Check, Save } from 'lucide-react';

export default function AdminThemeSettingsPage() {
  const [announcementText, setAnnouncementText] = useState('FREE UK DELIVERY on all orders over £50');
  const [announcementLink, setAnnouncementLink] = useState('/products?onSale=true');
  const [primaryGold, setPrimaryGold] = useState('#d4af37');
  const [backgroundColor, setBackgroundColor] = useState('#09090b');
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
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400">Appearance</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-0.5">
            Theme & Brand Design
          </h1>
          <p className="text-xs text-zinc-400">
            Customize luxury dark accents, metallic gold highlights, and announcement ticker.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-extrabold uppercase tracking-wider transition shadow"
        >
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? 'Saved!' : 'Save Theme'}
        </button>
      </div>

      <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-6">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
          Announcement Bar Ticker
        </h2>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">
            Announcement Message
          </label>
          <input
            type="text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">Clickthrough URL</label>
          <input
            type="text"
            value={announcementLink}
            onChange={(e) => setAnnouncementLink(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white font-mono"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-6">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
          Colour System (Premium Dark Theme)
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Accent Metallic Gold
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryGold}
                onChange={(e) => setPrimaryGold(e.target.value)}
                className="h-10 w-12 rounded-lg bg-black border border-zinc-800 cursor-pointer"
              />
              <input
                type="text"
                value={primaryGold}
                onChange={(e) => setPrimaryGold(e.target.value)}
                className="flex-1 rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Deep Background Black
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="h-10 w-12 rounded-lg bg-black border border-zinc-800 cursor-pointer"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1 rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

