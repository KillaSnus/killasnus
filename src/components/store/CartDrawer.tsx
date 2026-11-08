'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, Truck } from 'lucide-react';
import { useCart } from '@/lib/store/cart-context';
import { formatPrice } from '@/lib/utils';

export function CartDrawer() {
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
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setIsApplying(true);
    setCouponError('');
    const result = await applyCoupon(couponCodeInput.trim());
    setIsApplying(false);
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponCodeInput('');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-md bg-[#0e0e11] border-l border-zinc-800 text-white shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-gold-400" />
            <h2 className="text-lg font-bold">Your Bag ({items.reduce((s, i) => s + i.quantity, 0)})</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free shipping progress bar */}
        <div className="px-5 py-3 bg-[#131317] border-b border-zinc-800/60">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
              <Truck className="h-3.5 w-3.5 text-gold-400" />
              {remainingForFreeShipping > 0 ? (
                <>
                  Add <strong className="text-gold-400">{formatPrice(remainingForFreeShipping)}</strong> more for FREE shipping
                </>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  🎉 You unlocked FREE UK Delivery!
                </span>
              )}
            </span>
            <span className="text-[11px] text-zinc-400">{freeShippingProgress}%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-gold-500 transition-all duration-300 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="h-16 w-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-4">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Your bag is empty</h3>
              <p className="text-xs text-zinc-400 max-w-xs mb-6">
                Explore our premium collection of authentic nicotine pouches and fresh cans.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push('/products');
                }}
                className="px-6 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs uppercase tracking-wider transition"
              >
                Shop Popular Pouches
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-gold-500/20 transition"
              >
                {/* Product Image */}
                <div className="relative h-20 w-20 flex-shrink-0 bg-black rounded-lg overflow-hidden border border-zinc-800">
                  <Image
                    src={item.image || 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=300&q=80'}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-zinc-100 truncate">{item.name}</h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-zinc-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {item.variantName && (
                      <span className="text-[10px] text-gold-400/80 font-medium block">
                        {item.variantName}
                      </span>
                    )}
                    <span className="text-[10px] text-zinc-500 font-mono">SKU: {item.sku}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-zinc-700 rounded-md bg-black">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-gold-400 text-zinc-400 transition"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold text-white min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-gold-400 text-zinc-400 transition"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-white">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with totals & Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-zinc-800 bg-[#0c0c0f] space-y-4">
            {/* Promo code form */}
            {coupon ? (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gold-500/10 border border-gold-500/30 text-xs">
                <div className="flex items-center gap-2 text-gold-400 font-medium">
                  <Tag className="h-3.5 w-3.5" />
                  <span>
                    Coupon <strong>{coupon.code}</strong> applied ({coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : formatPrice(coupon.discountValue)} OFF)
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-zinc-400 hover:text-rose-400 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (e.g. WELCOME10)"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value)}
                  className="flex-1 rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white uppercase placeholder-zinc-500 focus:border-gold-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isApplying}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition disabled:opacity-50"
                >
                  {isApplying ? 'Applying...' : 'Apply'}
                </button>
              </form>
            )}
            {couponError && <p className="text-[11px] text-rose-400">{couponError}</p>}

            {/* Calculations breakdown */}
            <div className="space-y-1.5 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-zinc-200 font-semibold">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-gold-400">
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-zinc-200">
                  {shippingFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                <span>Estimated Total</span>
                <span className="text-gold-400 text-base">{formatPrice(total)}</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleProceedCheckout}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-gold-500 to-amber-600 px-6 py-3.5 text-sm font-extrabold text-black shadow-lg hover:brightness-110 active:scale-[0.99] transition uppercase tracking-wider"
            >
              Checkout Now <ArrowRight className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-500">
              <span>🔒 256-Bit SSL Encrypted</span>
              <span>⚡ Fast Tracked Dispatch</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

