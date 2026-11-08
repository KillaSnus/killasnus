'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';
import { slugify } from '@/lib/utils';

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [price, setPrice] = useState('4.49');
  const [comparePrice, setComparePrice] = useState('');
  const [stock, setStock] = useState('100');
  const [weight, setWeight] = useState('30');
  const [featuredImage, setFeaturedImage] = useState(
    'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80'
  );
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [brandId, setBrandId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState('mint, nicotine pouches, slim');
  const [strength, setStrength] = useState('Strong');
  const [strengthMg, setStrengthMg] = useState('16');
  const [flavor, setFlavor] = useState('Mint & Ice');
  const [pouchesPerCan, setPouchesPerCan] = useState('20');
  const [format, setFormat] = useState('Slim');
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');

  // Variants
  const [variants, setVariants] = useState<any[]>([
    { name: '1 Can (Single)', sku: '', price: '4.49', comparePrice: '', stock: '100', packSize: 1 },
    { name: 'Roll of 10 Cans (10% OFF)', sku: '', price: '40.40', comparePrice: '44.90', stock: '50', packSize: 10 },
  ]);

  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/brands')
      .then((r) => r.json())
      .then((d) => setBrands(d.brands || []))
      .catch(() => {});

    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => {});
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(slugify(val));
    if (!sku) {
      setSku(`KNS-${val.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'products');

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setFeaturedImage(data.media.url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        name: 'Box of 30 Cans (15% OFF)',
        sku: '',
        price: '114.50',
        comparePrice: '134.70',
        stock: '30',
        packSize: 30,
      },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = {
        name,
        slug,
        sku,
        barcode,
        description,
        shortDescription,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        stock: parseInt(stock, 10),
        weight: parseFloat(weight),
        featuredImage,
        galleryImages,
        brandId: brandId || null,
        categoryId: categoryId || null,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        strength,
        strengthMg: strengthMg ? parseFloat(strengthMg) : null,
        flavor,
        pouchesPerCan: parseInt(pouchesPerCan, 10),
        format,
        isPublished,
        isFeatured,
        isPopular,
        seoTitle,
        seoDesc,
        variants: variants.map((v) => ({
          name: v.name,
          sku: v.sku || `${sku}-${slugify(v.name)}`,
          price: parseFloat(v.price),
          comparePrice: v.comparePrice ? parseFloat(v.comparePrice) : null,
          stock: parseInt(v.stock, 10) || 100,
          packSize: parseInt(v.packSize, 10) || 1,
        })),
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create product');
      }

      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message || 'Error creating product');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top action header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-extrabold uppercase tracking-wider transition shadow disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save & Publish Product'}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-400 text-xs">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Core Fields */}
        <div className="lg:col-span-8 space-y-6">
          {/* Basic Details */}
          <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Product Information
            </h2>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Product Title</label>
              <input
                type="text"
                required
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. Killa Cold Mint 16mg"
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-xs text-white focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">URL Handle / Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2 text-xs text-zinc-300 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">SKU (Stock Keeping Unit)</label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Short Summary</label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Crisp ice mint with an instant 16mg kick."
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Full Description</label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe flavor notes, moisture level, pouch format, and manufacturer details..."
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Pricing & Stock
            </h2>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Price (£)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Compare Price (£)</label>
                <input
                  type="number"
                  step="0.01"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(e.target.value)}
                  placeholder="e.g. 5.99"
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Stock Quantity</label>
                <input
                  type="number"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Nicotine Pouch Specific Specifications */}
          <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-gold-400">
              Pouch Attributes
            </h2>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Flavour Profile</label>
                <select
                  value={flavor}
                  onChange={(e) => setFlavor(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
                >
                  <option value="Mint & Ice">Mint & Ice</option>
                  <option value="Fruit & Berry">Fruit & Berry</option>
                  <option value="Cola & Energy">Cola & Energy</option>
                  <option value="Coffee & Dessert">Coffee & Dessert</option>
                  <option value="Citrus">Citrus</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Strength Tier</label>
                <select
                  value={strength}
                  onChange={(e) => setStrength(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
                >
                  <option value="Light">Light (4-8mg)</option>
                  <option value="Medium">Medium (9-14mg)</option>
                  <option value="Strong">Strong (15-20mg)</option>
                  <option value="X-Strong">X-Strong (21-35mg)</option>
                  <option value="Ultra">Ultra (50mg+)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Strength (mg/g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={strengthMg}
                  onChange={(e) => setStrengthMg(e.target.value)}
                  placeholder="16"
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Pouches Per Can</label>
                <input
                  type="number"
                  value={pouchesPerCan}
                  onChange={(e) => setPouchesPerCan(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
                >
                  <option value="Slim">Slim</option>
                  <option value="Mini">Mini</option>
                  <option value="Large">Large</option>
                </select>
              </div>
            </div>
          </div>

          {/* Variants Matrix */}
          <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
                Pack Variants (Rolls & Boxes)
              </h2>
              <button
                type="button"
                onClick={handleAddVariant}
                className="flex items-center gap-1 text-xs font-bold text-gold-400 hover:underline"
              >
                <Plus className="h-3.5 w-3.5" /> Add Variant
              </button>
            </div>

            <div className="space-y-3">
              {variants.map((v, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Variant Name"
                      value={v.name}
                      onChange={(e) => {
                        const copy = [...variants];
                        copy[idx].name = e.target.value;
                        setVariants(copy);
                      }}
                      className="w-full rounded-lg bg-black border border-zinc-800 px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={v.price}
                      onChange={(e) => {
                        const copy = [...variants];
                        copy[idx].price = e.target.value;
                        setVariants(copy);
                      }}
                      className="w-full rounded-lg bg-black border border-zinc-800 px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div className="w-20">
                    <input
                      type="number"
                      placeholder="Packs"
                      value={v.packSize}
                      onChange={(e) => {
                        const copy = [...variants];
                        copy[idx].packSize = e.target.value;
                        setVariants(copy);
                      }}
                      className="w-full rounded-lg bg-black border border-zinc-800 px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Media, Organization, SEO */}
        <div className="lg:col-span-4 space-y-6">
          {/* Featured Image & R2 Media */}
          <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Featured Image
            </h2>

            <div className="relative aspect-square w-full rounded-xl bg-black border border-zinc-800 flex items-center justify-center overflow-hidden p-4">
              {featuredImage ? (
                <img src={featuredImage} alt="Featured" className="h-full w-full object-contain" />
              ) : (
                <ImageIcon className="h-12 w-12 text-zinc-700" />
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Upload to Cloudflare R2
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="w-full text-xs text-zinc-400 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-gold-400 hover:file:bg-zinc-700"
              />
              {uploadingImage && <p className="text-[11px] text-gold-400 mt-1">Uploading to R2...</p>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Image URL</label>
              <input
                type="url"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs text-white font-mono"
              />
            </div>
          </div>

          {/* Organization: Brand & Category */}
          <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Organization
            </h2>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Brand</label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
              >
                <option value="">Select Brand...</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-gold-500"
                />
                <span>Published (Visible on storefront)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-gold-500"
                />
                <span>Featured as Bestseller / Popular</span>
              </label>
            </div>
          </div>

          {/* SEO Meta */}
          <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Search Engine Optimization
            </h2>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">SEO Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Product Name | KILLASNUS"
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">SEO Description</label>
              <textarea
                rows={3}
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                placeholder="Meta description for search engines..."
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

