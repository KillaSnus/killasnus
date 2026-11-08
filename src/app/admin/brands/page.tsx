'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Award, Plus, Trash2, Edit, Check, Globe } from 'lucide-react';
import { slugify } from '@/lib/utils';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/brands');
      if (res.ok) {
        const data = await res.json();
        setBrands(data.brands || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug: slug || slugify(name),
          description,
          website,
          isFeatured,
        }),
      });

      if (res.ok) {
        setName('');
        setSlug('');
        setDescription('');
        setWebsite('');
        fetchBrands();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-gold-400">Partnerships</span>
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-0.5">
          Brands ({brands.length})
        </h1>
        <p className="text-xs text-zinc-400">
          Official manufacturers: Killa, Pablo, Velo, ZYN, Iceberg, Kurwa, White Fox, etc.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Brand Creator */}
        <form onSubmit={handleCreate} className="lg:col-span-5 rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
            Add New Brand
          </h2>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Brand Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(slugify(e.target.value));
              }}
              placeholder="e.g. Pablo"
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Slug</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-zinc-300 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Manufacturer Website</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Brand Story & Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Extreme 50mg nicotine pouches manufactured in Denmark..."
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded border-zinc-700 bg-zinc-900 text-gold-500"
            />
            <span>Featured Brand (Show on Homepage Brand Carousel)</span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-gold-500 hover:bg-gold-400 py-2.5 text-xs font-extrabold text-black uppercase tracking-wider transition shadow"
          >
            {saving ? 'Saving...' : 'Save Brand'}
          </button>
        </form>

        {/* Brands Table */}
        <div className="lg:col-span-7 rounded-2xl bg-[#111114] border border-zinc-800 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#15151a] border-b border-zinc-800 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="p-4">Brand</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Products</th>
                <th className="p-4 text-right">Store Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-zinc-500">
                    Loading brands...
                  </td>
                </tr>
              ) : brands.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-zinc-500">
                    No brands created yet.
                  </td>
                </tr>
              ) : (
                brands.map((b) => (
                  <tr key={b.id} className="hover:bg-zinc-900/40 transition">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-black border border-zinc-800 flex items-center justify-center text-gold-400 font-extrabold">
                        {b.name.slice(0, 1)}
                      </div>
                      <span>{b.name}</span>
                    </td>
                    <td className="p-4 font-mono text-zinc-400">/brands/{b.slug}</td>
                    <td className="p-4 font-semibold text-zinc-300">
                      {b._count?.products || 0} products
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/brands/${b.slug}`}
                        target="_blank"
                        className="text-gold-400 hover:underline font-bold"
                      >
                        View Storefront →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

