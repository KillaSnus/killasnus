'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Eye, Check, Flame, Zap } from 'lucide-react';
import { useCart } from '@/lib/store/cart-context';
import { formatPrice, getStrengthBadgeColor } from '@/lib/utils';

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  comparePrice?: number | null;
  stock: number;
  featuredImage: string;
  brand?: { name: string; slug: string } | null;
  strength?: string | null;
  strengthMg?: number | null;
  flavor?: string | null;
  pouchesPerCan?: number | null;
  isPopular?: boolean;
}

export function ProductCard({
  id,
  name,
  slug,
  sku,
  price,
  comparePrice,
  stock,
  featuredImage,
  brand,
  strength,
  strengthMg,
  flavor,
  pouchesPerCan = 20,
  isPopular,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const discountPercent =
    comparePrice && comparePrice > price
      ? Math.round(((comparePrice - price) / comparePrice) * 100)
      : null;

  const strengthBadge = getStrengthBadgeColor(strength);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem({
      productId: id,
      name,
      price,
      comparePrice: comparePrice || undefined,
      quantity: 1,
      image: featuredImage,
      sku,
      maxStock: stock,
    });
    setIsAdding(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-[#111114] border border-zinc-800/80 p-3.5 transition-all duration-300 hover:border-gold-500/40 hover:shadow-xl hover:shadow-gold-500/5">
      {/* Top Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1 items-start">
        {discountPercent && (
          <span className="rounded-full bg-gradient-to-r from-red-600 to-rose-500 px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow">
            -{discountPercent}% OFF
          </span>
        )}
        {isPopular && (
          <span className="rounded-full bg-gradient-to-r from-amber-500 to-gold-500 px-2.5 py-0.5 text-[10px] font-bold text-black flex items-center gap-1 shadow">
            <Zap className="h-3 w-3 fill-black" /> BESTSELLER
          </span>
        )}
      </div>

      {strength && (
        <div className="absolute right-3 top-3 z-10">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${strengthBadge.bg} ${strengthBadge.text} ${strengthBadge.border}`}
          >
            {strength} {strengthMg ? `(${strengthMg}mg)` : ''}
          </span>
        </div>
      )}

      {/* Product Image Container */}
      <Link
        href={`/products/${slug}`}
        className="relative aspect-square w-full overflow-hidden rounded-xl bg-black/60 p-4 flex items-center justify-center"
      >
        <Image
          src={
            featuredImage ||
            'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80'
          }
          alt={name}
          fill
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between pt-3">
        <div>
          {/* Brand & Flavor info */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
            {brand ? (
              <Link
                href={`/brands/${brand.slug}`}
                className="font-semibold text-gold-400/90 hover:underline tracking-wide uppercase"
              >
                {brand.name}
              </Link>
            ) : (
              <span className="text-zinc-500 uppercase">Premium</span>
            )}
            {flavor && <span className="text-zinc-400 truncate max-w-[120px]">{flavor}</span>}
          </div>

          {/* Title */}
          <Link href={`/products/${slug}`}>
            <h3 className="text-sm font-bold text-zinc-100 group-hover:text-gold-400 transition line-clamp-1">
              {name}
            </h3>
          </Link>

          {/* Nicotine pouch spec summary */}
          <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-400">
            <span>{pouchesPerCan} Pouches</span>
            <span>•</span>
            <span>Slim Format</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-3.5 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-gold-400">
                {formatPrice(price)}
              </span>
              {comparePrice && comparePrice > price && (
                <span className="text-xs text-zinc-500 line-through">
                  {formatPrice(comparePrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-zinc-500 block">Inc. VAT</span>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={stock <= 0 || isAdding}
            className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
              justAdded
                ? 'bg-emerald-500 text-black'
                : stock <= 0
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-zinc-800 text-gold-400 hover:bg-gold-500 hover:text-black active:scale-95'
            }`}
            title="Quick add to bag"
          >
            {justAdded ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>{stock <= 0 ? 'Out of Stock' : 'Add'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

