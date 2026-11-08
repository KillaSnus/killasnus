'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  Tag,
  X,
  Lock,
} from 'lucide-react';
import { useCart } from '@/lib/store/cart-context';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    discountAmount,
    shippingFee,
    freeShippingThreshold,
    freeShippingProgress,
    total,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplying(true);
    setCouponError('');
    const res = await applyCoupon(couponCode);
    setIsApplying(false);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCode('');
    }
  };

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="bg-[#09090b] min-h-screen py-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-gold-400">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
            Your Bag is Empty
          </h1>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            You don't have any cans in your bag yet. Browse our selection of genuine Scandinavian nicotine pouches.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-gold-500 hover:bg-gold-400 px-6 py-3 text-xs font-bold text-black uppercase tracking-wider transition"
          >
            Start Shopping Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#09090b] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-8">
          Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free shipping progress card */}
            <div className="p-4 rounded-2xl bg-[#111114] border border-zinc-800">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="flex items-center gap-2 text-zinc-300 font-semibold">
                  <Truck className="h-4 w-4 text-gold-400" />
                  {remainingForFreeShipping > 0 ? (
                    <>
                      Add <strong className="text-gold-400">{formatPrice(remainingForFreeShipping)}</strong> more for FREE UK Shipping
                    </>
                  ) : (
                    <span className="text-emerald-400 font-bold">🎉 Congratulations! You unlocked FREE Shipping</span>
                  )}
                </span>
                <span className="text-xs text-zinc-400">{freeShippingProgress}%</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-gold-500 rounded-full transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Table */}
            <div className="rounded-2xl bg-[#111114] border border-zinc-800 divide-y divide-zinc-800 overflow-hidden">
              {items.map((item) => (
                <div key={item.id} className="p-5 flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 bg-black rounded-xl overflow-hidden border border-zinc-800">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                  </div>

                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h3 className="text-sm font-bold text-white truncate">{item.name}</h3>
                    {item.variantName && (
                      <span className="text-xs text-gold-400 block mt-0.5">{item.variantName}</span>
                    )}
                    <span className="text-[11px] text-zinc-500 font-mono">SKU: {item.sku}</span>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Quantity modifier */}
                    <div className="flex items-center border border-zinc-700 rounded-lg bg-black">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-zinc-400 hover:text-white transition"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-white min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-zinc-400 hover:text-white transition"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <span className="text-sm font-black text-gold-400">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <span className="text-[10px] text-zinc-500 block">
                        ({formatPrice(item.price)} each)
                      </span>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-zinc-500 hover:text-rose-400 transition"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-6">
            <h2 className="text-base font-extrabold uppercase tracking-wider text-white">
              Order Summary
            </h2>

            {/* Promo Code Input */}
            <div>
              {coupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-gold-500/10 border border-gold-500/30 text-xs">
                  <span className="text-gold-400 font-bold flex items-center gap-1.5">
                    <Tag className="h-4 w-4" /> Coupon {coupon.code} Applied
                  </span>
                  <button onClick={removeCoupon} className="text-zinc-400 hover:text-rose-400">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo / Voucher Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2.5 text-xs text-white uppercase placeholder-zinc-500 focus:border-gold-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition disabled:opacity-50"
                    >
                      {isApplying ? '...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-rose-400">{couponError}</p>}
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-xs text-zinc-400 border-t border-zinc-800 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-zinc-200 font-semibold">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-gold-400">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-zinc-200">
                  {shippingFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-3 border-t border-zinc-800">
                <span>Total Due</span>
                <span className="text-gold-400 text-xl">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-gold-500 to-amber-600 py-4 text-sm font-extrabold text-black uppercase tracking-wider shadow-xl hover:brightness-110 active:scale-[0.99] transition"
            >
              Proceed To Checkout <ArrowRight className="h-4 w-4" />
            </button>

            <div className="pt-2 text-[11px] text-zinc-500 space-y-2 text-center">
              <div className="flex items-center justify-center gap-2">
                <Lock className="h-3.5 w-3.5 text-gold-400" />
                <span>SSL Encrypted Checkout</span>
              </div>
              <p>We accept Visa, Mastercard, Apple Pay, PayPal & Crypto.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

