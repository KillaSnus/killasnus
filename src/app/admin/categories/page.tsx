'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layers, Plus, Trash2, Edit, Check, Sparkles } from 'lucide-react';
import { slugify } from '@/lib/utils';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('FLAVOUR');
  const [parentId, setParentId] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug: slug || slugify(name),
          description,
          type,
          parentId: parentId || null,
        }),
      });

      if (res.ok) {
        setName('');
        setSlug('');
        setDescription('');
        fetchCategories();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-gold-400">Taxonomy</span>
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-0.5">
          Categories ({categories.length})
        </h1>
        <p className="text-xs text-zinc-400">
          Manage Flavours (Mint, Berry, Cola), Strengths (Light, Ultra), and nested categories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Category Creation Form */}
        <form onSubmit={handleCreate} className="lg:col-span-5 rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
            Add New Category
          </h2>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Category Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(slugify(e.target.value));
              }}
              placeholder="e.g. Mint & Ice"
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">URL Slug</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-zinc-300 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Classification Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
            >
              <option value="FLAVOUR">Flavour (Shop by Flavour)</option>
              <option value="STRENGTH">Strength (Shop by Strength)</option>
              <option value="GENERAL">General / Department</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Cool menthol and spearmint blends..."
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
            />
          </div>

          <button
            type="submit"
            disabled={creating}
            className="w-full rounded-xl bg-gold-500 hover:bg-gold-400 py-2.5 text-xs font-extrabold text-black uppercase tracking-wider transition shadow"
          >
            {creating ? 'Creating...' : 'Create Category'}
          </button>
        </form>

        {/* Categories List Table */}
        <div className="lg:col-span-7 rounded-2xl bg-[#111114] border border-zinc-800 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#15151a] border-b border-zinc-800 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Products</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-zinc-500">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-zinc-500">
                    No categories found. Create your first category.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-zinc-900/40 transition">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <Layers className="h-4 w-4 text-gold-400" />
                      <span>{cat.name}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-900 border border-zinc-800 text-gold-400">
                        {cat.type}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-zinc-400">/category/{cat.slug}</td>
                    <td className="p-4 font-semibold text-zinc-300">
                      {cat._count?.products || 0} products
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

