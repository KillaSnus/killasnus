'use client';

import React, { useState } from 'react';
import { Globe, Save, Check } from 'lucide-react';

export default function AdminSEOSettingsPage() {
  const [siteTitle, setSiteTitle] = useState('KILLASNUS | Premium Nicotine Pouches Store');
  const [siteDescription, setSiteDescription] = useState(
    'Authentic Scandinavian nicotine pouches. Velo, Pablo, Killa, ZYN, Iceberg and more. Fast tracked UK & international delivery.'
  );
  const [canonicalUrl, setCanonicalUrl] = useState('https://killasnus.com');
  const [sitemapEnabled, setSitemapEnabled] = useState(true);
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
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400">SEO & Metadata</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-0.5">
            Search Engine Optimization
          </h1>
          <p className="text-xs text-zinc-400">
            Configure default titles, OpenGraph previews, and automated sitemap.xml.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-extrabold uppercase tracking-wider transition shadow"
        >
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? 'Saved!' : 'Save SEO'}
        </button>
      </div>

      <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
          Default Metadata
        </h2>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">Store Site Title</label>
          <input
            type="text"
            value={siteTitle}
            onChange={(e) => setSiteTitle(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">Default Meta Description</label>
          <textarea
            rows={3}
            value={siteDescription}
            onChange={(e) => setSiteDescription(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">Canonical Domain</label>
          <input
            type="url"
            value={canonicalUrl}
            onChange={(e) => setCanonicalUrl(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white font-mono"
          />
        </div>

        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-300">
          <div>
            <span className="font-bold text-white block">Dynamic XML Sitemap</span>
            <span className="text-[11px] text-zinc-500">Live generated at /sitemap.xml</span>
          </div>
          <span className="text-emerald-400 font-bold">Active & Auto-Updating</span>
        </div>
      </div>
    </div>
  );
}

