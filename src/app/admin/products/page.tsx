'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  ArrowUpDown,
  Download,
  Upload,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import { formatPrice, getStrengthBadgeColor } from '@/lib/utils';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(search)}&limit=100`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error('Failed to load products:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(products.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) return;
    setIsDeleting(true);
    try {
      for (const id of selectedIds) {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
      }
      setSelectedIds([]);
      fetchProducts();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });
      fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400">Catalog</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-0.5">
            Products ({products.length})
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete ({selectedIds.length})
            </button>
          )}

          <Link
            href="/admin/import-export"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white text-xs font-semibold transition"
          >
            <Upload className="h-3.5 w-3.5" /> Import CSV
          </Link>

          <a
            href="/api/import-export?type=products"
            download
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white text-xs font-semibold transition"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </a>

          <Link
            href="/admin/products/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-extrabold uppercase tracking-wider transition shadow"
          >
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search by title, SKU, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2 pl-9 text-xs text-white placeholder-zinc-500 focus:border-gold-500 focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span>Showing {products.length} products</span>
        </div>
      </div>

      {/* Product Table */}
      <div className="rounded-2xl bg-[#111114] border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#15151a] border-b border-zinc-800 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === products.length && products.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-zinc-700 bg-zinc-900 text-gold-500"
                  />
                </th>
                <th className="p-4">Product</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Flavour / Strength</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-zinc-500">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-zinc-500">
                    No products found. Add a product or import via CSV.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const strengthBadge = getStrengthBadgeColor(p.strength);
                  const isSelected = selectedIds.includes(p.id);
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-zinc-900/40 transition ${isSelected ? 'bg-gold-500/5' : ''}`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(p.id)}
                          className="rounded border-zinc-700 bg-zinc-900 text-gold-500"
                        />
                      </td>

                      {/* Title & Image */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 flex-shrink-0 bg-black rounded-lg border border-zinc-800 overflow-hidden">
                            <Image
                              src={p.featuredImage}
                              alt={p.name}
                              fill
                              className="object-contain p-1"
                              sizes="48px"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/admin/products/${p.id}`}
                              className="font-bold text-white hover:text-gold-400 block max-w-xs truncate"
                            >
                              {p.name}
                            </Link>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              {p.variants?.length ? `${p.variants.length} pack variants` : 'Single pack'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-mono text-zinc-400">{p.sku}</td>

                      <td className="p-4">
                        <span className="font-semibold text-zinc-300 uppercase">
                          {p.brand?.name || '—'}
                        </span>
                      </td>

                      <td className="p-4">
                        <div>
                          <span className="text-zinc-300 block">{p.flavor || '—'}</span>
                          {p.strength && (
                            <span
                              className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${strengthBadge.bg} ${strengthBadge.text} ${strengthBadge.border}`}
                            >
                              {p.strength} {p.strengthMg ? `(${p.strengthMg}mg)` : ''}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-gold-400">{formatPrice(p.price)}</div>
                        {p.comparePrice && (
                          <div className="text-[10px] text-zinc-500 line-through">
                            {formatPrice(p.comparePrice)}
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <span
                          className={`font-bold ${
                            p.stock <= 15 ? 'text-rose-400 font-extrabold' : 'text-zinc-300'
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleTogglePublish(p.id, p.isPublished)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                            p.isPublished
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                              : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                          }`}
                        >
                          {p.isPublished ? 'Published' : 'Draft'}
                        </button>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition"
                            title="View on store"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-gold-400 hover:bg-zinc-800 transition"
                            title="Edit Product"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

