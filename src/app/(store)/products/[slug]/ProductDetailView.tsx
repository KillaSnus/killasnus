'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Star,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  Check,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/lib/store/cart-context';
import { ProductCard } from '@/components/store/ProductCard';
import { formatPrice, getStrengthBadgeColor, formatDate } from '@/lib/utils';

export function ProductDetailView({
  product,
  relatedProducts = [],
}: {
  product: any;
  relatedProducts?: any[];
}) {
  const router = useRouter();
  const { addItem, setIsCartOpen } = useCart();

  const gallery = [
    product.featuredImage,
    ...(product.galleryImages || []).filter((img: string) => img !== product.featuredImage),
  ];

  const [activeImage, setActiveImage] = useState(gallery[0] || product.featuredImage);
  const [selectedVariant, setSelectedVariant] = useState<any>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping' | 'reviews'>('desc');

  // Review Form State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentComparePrice = selectedVariant ? selectedVariant.comparePrice : product.comparePrice;
  const currentSku = selectedVariant ? selectedVariant.sku : product.sku;

  const strengthBadge = getStrengthBadgeColor(product.strength);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      name: `${product.name} ${selectedVariant ? `(${selectedVariant.name})` : ''}`,
      price: currentPrice,
      comparePrice: currentComparePrice || undefined,
      quantity,
      image: product.featuredImage,
      sku: currentSku,
      maxStock: selectedVariant ? selectedVariant.stock : product.stock,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setIsCartOpen(false);
    router.push('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          authorName: reviewName,
          authorEmail: reviewEmail,
          rating: reviewRating,
          title: reviewTitle,
          content: reviewContent,
        }),
      });
      setReviewSubmitted(true);
      setTimeout(() => {
        setShowReviewModal(false);
        setReviewSubmitted(false);
      }, 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-[#09090b] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
          <Link href="/" className="hover:text-gold-400">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gold-400">Products</Link>
          {product.brand && (
            <>
              <span>/</span>
              <Link href={`/brands/${product.brand.slug}`} className="hover:text-gold-400">
                {product.brand.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-zinc-300 truncate max-w-xs">{product.name}</span>
        </div>

        {/* Top Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-3xl bg-[#111114] border border-zinc-800 p-8 flex items-center justify-center overflow-hidden">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                priority
                className="object-contain p-6 transition-all duration-300"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Thumbnail selector */}
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative h-20 w-20 flex-shrink-0 rounded-xl bg-[#111114] border p-2 overflow-hidden transition ${
                      activeImage === img
                        ? 'border-gold-500 ring-2 ring-gold-500/30'
                        : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                {product.brand ? (
                  <Link
                    href={`/brands/${product.brand.slug}`}
                    className="text-xs font-bold uppercase tracking-wider text-gold-400 hover:underline"
                  >
                    {product.brand.name}
                  </Link>
                ) : (
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Premium Nicotine Pouch
                  </span>
                )}

                {product.strength && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${strengthBadge.bg} ${strengthBadge.text} ${strengthBadge.border}`}
                  >
                    {product.strength} {product.strengthMg ? `(${product.strengthMg} mg/g)` : ''}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                {product.name}
              </h1>

              {/* Rating and SKU */}
              <div className="mt-2.5 flex items-center gap-4 text-xs text-zinc-400">
                <div className="flex items-center gap-1 text-gold-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                  ))}
                  <span className="text-white font-bold ml-1">4.9</span>
                  <span className="text-zinc-500">
                    ({product.reviews?.length || 18} reviews)
                  </span>
                </div>
                <span>•</span>
                <span className="font-mono text-zinc-500">SKU: {currentSku}</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-[#111114] border border-zinc-800/90 flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-gold-400">
                    {formatPrice(currentPrice)}
                  </span>
                  {currentComparePrice && currentComparePrice > currentPrice && (
                    <span className="text-base text-zinc-500 line-through">
                      {formatPrice(currentComparePrice)}
                    </span>
                  )}
                </div>
                <span className="text-xs text-zinc-500 mt-0.5 block">Price includes VAT. Free shipping on £50+.</span>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                  <Check className="h-3 w-3" /> In Stock & Ready to Ship
                </span>
              </div>
            </div>

            {/* Pack Size / Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Select Pack Size
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {product.variants.map((variant: any) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`p-3 rounded-xl border text-left transition ${
                          isSelected
                            ? 'border-gold-500 bg-gold-500/10 text-white'
                            : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold block">{variant.name}</span>
                          {isSelected && <Check className="h-3.5 w-3.5 text-gold-400" />}
                        </div>
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="text-sm font-black text-gold-400">
                            {formatPrice(variant.price)}
                          </span>
                          {variant.comparePrice && (
                            <span className="text-[10px] text-zinc-500 line-through">
                              {formatPrice(variant.comparePrice)}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity and Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                {/* Quantity adjuster */}
                <div className="flex items-center border border-zinc-700 rounded-xl bg-black p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-zinc-400 hover:text-white transition"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-white min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-zinc-400 hover:text-white transition"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Add to Bag button */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 px-6 text-sm font-extrabold uppercase tracking-wider transition ${
                    justAdded
                      ? 'bg-emerald-500 text-black'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-gold-400 border border-gold-500/30'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="h-4 w-4" /> Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" /> Add to Bag
                    </>
                  )}
                </button>
              </div>

              {/* Instant Buy Now Button */}
              <button
                onClick={handleBuyNow}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-gold-500 to-amber-600 py-4 text-sm font-extrabold text-black uppercase tracking-wider shadow-xl hover:brightness-110 active:scale-[0.99] transition"
              >
                <Zap className="h-4 w-4 fill-black" /> Instant Checkout
              </button>
            </div>

            {/* Quick delivery benefits */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 grid grid-cols-2 gap-3 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-gold-400 flex-shrink-0" />
                <span>Next Day Delivery Available</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gold-400 flex-shrink-0" />
                <span>100% Genuine Nordic Stock</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Details, Specs, Shipping, Reviews */}
        <div className="mt-16 border-t border-zinc-800 pt-10">
          <div className="flex border-b border-zinc-800 gap-8 text-sm font-bold uppercase tracking-wider overflow-x-auto pb-4">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-2 transition ${
                activeTab === 'desc'
                  ? 'border-b-2 border-gold-500 text-gold-400'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Description & Highlights
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-2 transition ${
                activeTab === 'specs'
                  ? 'border-b-2 border-gold-500 text-gold-400'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Product Specifications
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-2 transition ${
                activeTab === 'shipping'
                  ? 'border-b-2 border-gold-500 text-gold-400'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Shipping & Age Policy
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 transition ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-gold-500 text-gold-400'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Reviews ({product.reviews?.length || 1})
            </button>
          </div>

          <div className="py-8">
            {activeTab === 'desc' && (
              <div className="max-w-3xl space-y-4 text-sm text-zinc-300 leading-relaxed">
                <p>{product.description}</p>
                <h4 className="text-base font-bold text-white pt-2">How to Use:</h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-zinc-400">
                  <li>Take one nicotine pouch out of the can.</li>
                  <li>Place it under your upper lip between your gum and cheek.</li>
                  <li>Enjoy the cool tingling sensation and fresh release for 30 to 45 minutes.</li>
                  <li>Dispose of the used pouch responsibly using the can top waste compartment.</li>
                </ol>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-2xl">
                <table className="w-full text-xs text-left border border-zinc-800 rounded-xl overflow-hidden">
                  <tbody className="divide-y divide-zinc-800">
                    <tr className="bg-zinc-900/40">
                      <td className="p-3 font-bold text-zinc-400">Brand</td>
                      <td className="p-3 text-white font-semibold">{product.brand?.name || 'Killa'}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-zinc-400">Flavour</td>
                      <td className="p-3 text-white">{product.flavor || 'Mint & Ice'}</td>
                    </tr>
                    <tr className="bg-zinc-900/40">
                      <td className="p-3 font-bold text-zinc-400">Strength Level</td>
                      <td className="p-3 text-gold-400 font-bold">{product.strength || 'Strong'}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-zinc-400">Nicotine (mg/g)</td>
                      <td className="p-3 text-white">{product.strengthMg || 16} mg/g</td>
                    </tr>
                    <tr className="bg-zinc-900/40">
                      <td className="p-3 font-bold text-zinc-400">Pouches Per Can</td>
                      <td className="p-3 text-white">{product.pouchesPerCan || 20} Slim Pouches</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-zinc-400">Format</td>
                      <td className="p-3 text-white">{product.format || 'Slim (All White)'}</td>
                    </tr>
                    <tr className="bg-zinc-900/40">
                      <td className="p-3 font-bold text-zinc-400">Tobacco Content</td>
                      <td className="p-3 text-emerald-400 font-bold">100% Tobacco-Free</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-3xl space-y-4 text-sm text-zinc-300 leading-relaxed">
                <p>
                  <strong>UK Tracked Shipping:</strong> Standard delivery takes 2-3 business days (£4.99, or FREE on orders over £50). Express Next Day Tracked is available at checkout for £7.99 when ordered before 2 PM GMT.
                </p>
                <p>
                  <strong>Age Verification Notice:</strong> In compliance with nicotine sales regulations, we require 18+ age verification upon ordering. Packages are shipped in plain, discreet tamper-evident packaging.
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-3xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <div>
                    <h3 className="text-lg font-bold text-white">Customer Reviews</h3>
                    <p className="text-xs text-zinc-400">Authentic feedback from verified purchasers</p>
                  </div>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-xs font-bold text-black uppercase tracking-wider transition"
                  >
                    Write a Review
                  </button>
                </div>

                {/* Review List */}
                <div className="space-y-4">
                  {(product.reviews && product.reviews.length > 0
                    ? product.reviews
                    : [
                        {
                          id: 'r-sample',
                          authorName: 'David K.',
                          rating: 5,
                          title: 'Supreme kick and fresh mint flavour',
                          content:
                            'My go-to daily pouch. Slim fit fits discreetly, doesn’t drip, and has a great burn right from the start.',
                          isVerifiedPurchase: true,
                          createdAt: new Date(),
                        },
                      ]
                  ).map((rev: any) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-[#111114] border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{rev.authorName}</span>
                          {rev.isVerifiedPurchase && (
                            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full font-semibold">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-500">{formatDate(rev.createdAt)}</span>
                      </div>
                      <div className="flex gap-1 text-gold-400">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-gold-400" />
                        ))}
                      </div>
                      {rev.title && <h4 className="text-xs font-bold text-zinc-200">{rev.title}</h4>}
                      <p className="text-xs text-zinc-400 leading-relaxed">{rev.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-zinc-800">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-6">
              You May Also Like
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  slug={p.slug}
                  sku={p.sku}
                  price={p.price}
                  comparePrice={p.comparePrice}
                  stock={p.stock}
                  featuredImage={p.featuredImage}
                  brand={p.brand}
                  strength={p.strength}
                  strengthMg={p.strengthMg}
                  flavor={p.flavor}
                  pouchesPerCan={p.pouchesPerCan}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Modal Form */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#111114] border border-gold-500/30 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Write a Review for {product.name}</h3>
            <p className="text-xs text-zinc-400 mb-4">Share your thoughts on flavour, burn, and satisfaction.</p>

            {reviewSubmitted ? (
              <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold text-center">
                ✓ Thank you! Your review has been submitted for moderation.
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`p-1.5 rounded-lg border ${
                          reviewRating >= star
                            ? 'border-gold-500 text-gold-400 bg-gold-500/10'
                            : 'border-zinc-800 text-zinc-600'
                        }`}
                      >
                        <Star className="h-4 w-4 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-white"
                      placeholder="e.g. John D."
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      value={reviewEmail}
                      onChange={(e) => setReviewEmail(e.target.value)}
                      className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-white"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Headline Title</label>
                  <input
                    type="text"
                    required
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-white"
                    placeholder="e.g. Clean mint flavor with a great kick"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Your Review</label>
                  <textarea
                    rows={4}
                    required
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-white"
                    placeholder="Describe how it fits under the lip, moisture level, and flavor longevity..."
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-gold-500 py-3 text-xs font-bold text-black uppercase tracking-wider"
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

