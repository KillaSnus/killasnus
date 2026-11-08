'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
  Flame,
  Zap,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/lib/store/cart-context';
import { useAuth } from '@/lib/store/auth-context';
import { formatPrice } from '@/lib/utils';

export function Header() {
  const router = useRouter();
  const { itemCount, subtotal, setIsCartOpen } = useCart();
  const { user, profile, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [flavorDropdownOpen, setFlavorDropdownOpen] = useState(false);
  const [strengthDropdownOpen, setStrengthDropdownOpen] = useState(false);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const featuredBrands = [
    'Killa', 'Pablo', 'Velo', 'Iceberg', 'ZYN', 'White Fox', 'Kurwa', 'Siberia',
    'Ace', 'Goat', 'Kelly White', 'Thor', 'Rush', '77', 'XQS', 'Zone', 'Jixx', 'Greatest'
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-zinc-400 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 via-gold-500 to-amber-700 p-[1.5px] shadow-lg group-hover:scale-105 transition-transform">
              <div className="h-full w-full bg-black rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-gold-400 text-xl tracking-tighter">K</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-wider text-white uppercase">
                KILLA<span className="text-gold-400">SNUS</span>
              </span>
              <span className="text-[9px] tracking-[0.25em] text-zinc-400 uppercase -mt-1">
                Luxury Pouches
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            <Link
              href="/products"
              className="text-zinc-200 hover:text-gold-400 transition flex items-center gap-1.5"
            >
              Shop All
            </Link>

            {/* Shop by Flavour Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setFlavorDropdownOpen(true)}
              onMouseLeave={() => setFlavorDropdownOpen(false)}
            >
              <button className="text-zinc-200 hover:text-gold-400 transition flex items-center gap-1 py-2">
                Flavours <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              </button>
              {flavorDropdownOpen && (
                <div className="absolute left-0 top-full w-56 rounded-xl bg-[#121215] border border-gold-500/20 p-2 shadow-2xl animate-in fade-in slide-in-from-top-1">
                  <Link
                    href="/products?flavor=Mint%20%26%20Ice"
                    className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-gold-500/10 rounded-lg transition"
                  >
                    <Sparkles className="h-4 w-4 text-cyan-400" /> Mint & Ice
                  </Link>
                  <Link
                    href="/products?flavor=Fruit%20%26%20Berry"
                    className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-gold-500/10 rounded-lg transition"
                  >
                    <Sparkles className="h-4 w-4 text-rose-400" /> Fruit & Berry
                  </Link>
                  <Link
                    href="/products?flavor=Cola%20%26%20Energy"
                    className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-gold-500/10 rounded-lg transition"
                  >
                    <Sparkles className="h-4 w-4 text-amber-400" /> Cola & Energy
                  </Link>
                  <div className="border-t border-zinc-800 my-1" />
                  <Link
                    href="/products"
                    className="block px-3 py-1.5 text-[11px] text-gold-400 hover:underline font-semibold"
                  >
                    View All Flavours →
                  </Link>
                </div>
              )}
            </div>

            {/* Shop by Strength Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setStrengthDropdownOpen(true)}
              onMouseLeave={() => setStrengthDropdownOpen(false)}
            >
              <button className="text-zinc-200 hover:text-gold-400 transition flex items-center gap-1 py-2">
                Strengths <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              </button>
              {strengthDropdownOpen && (
                <div className="absolute left-0 top-full w-60 rounded-xl bg-[#121215] border border-gold-500/20 p-2 shadow-2xl animate-in fade-in slide-in-from-top-1">
                  <Link
                    href="/products?strength=Light"
                    className="flex items-center justify-between px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-gold-500/10 rounded-lg transition"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" /> Light
                    </span>
                    <span className="text-[11px] text-zinc-500">4-8 mg/g</span>
                  </Link>
                  <Link
                    href="/products?strength=Medium"
                    className="flex items-center justify-between px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-gold-500/10 rounded-lg transition"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-400" /> Medium
                    </span>
                    <span className="text-[11px] text-zinc-500">9-14 mg/g</span>
                  </Link>
                  <Link
                    href="/products?strength=Strong"
                    className="flex items-center justify-between px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-gold-500/10 rounded-lg transition"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-400" /> Strong
                    </span>
                    <span className="text-[11px] text-zinc-500">15-20 mg/g</span>
                  </Link>
                  <Link
                    href="/products?strength=X-Strong"
                    className="flex items-center justify-between px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-gold-500/10 rounded-lg transition"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-500" /> X-Strong
                    </span>
                    <span className="text-[11px] text-zinc-500">21-35 mg/g</span>
                  </Link>
                  <Link
                    href="/products?strength=Ultra"
                    className="flex items-center justify-between px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-gold-500/10 rounded-lg transition"
                  >
                    <span className="flex items-center gap-2">
                      <Flame className="h-3.5 w-3.5 text-rose-500" /> Ultra Strong
                    </span>
                    <span className="text-[11px] text-rose-400 font-bold">50+ mg/g</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Brands Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setBrandDropdownOpen(true)}
              onMouseLeave={() => setBrandDropdownOpen(false)}
            >
              <button className="text-zinc-200 hover:text-gold-400 transition flex items-center gap-1 py-2">
                Brands <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              </button>
              {brandDropdownOpen && (
                <div className="absolute -left-12 top-full w-96 rounded-2xl bg-[#121215] border border-gold-500/20 p-4 shadow-2xl grid grid-cols-3 gap-2 animate-in fade-in slide-in-from-top-1">
                  {featuredBrands.map((b) => (
                    <Link
                      key={b}
                      href={`/brands/${b.toLowerCase().replace(/\s+/g, '-')}`}
                      className="px-2 py-1.5 text-xs text-zinc-300 hover:text-gold-400 hover:bg-zinc-900 rounded-md transition font-medium text-center"
                    >
                      {b}
                    </Link>
                  ))}
                  <div className="col-span-3 border-t border-zinc-800 pt-2 mt-1 flex justify-between items-center text-xs">
                    <Link href="/brands" className="text-gold-400 font-semibold hover:underline">
                      Explore All 18+ Brands →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/blog" className="text-zinc-200 hover:text-gold-400 transition">
              Blog
            </Link>

            <Link
              href="/pages/rewards"
              className="text-amber-400 hover:text-amber-300 transition flex items-center gap-1"
            >
              <Zap className="h-3.5 w-3.5" /> Rewards
            </Link>
          </nav>

          {/* Search bar desktop */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative flex-1 max-w-xs"
          >
            <input
              type="text"
              placeholder="Search pouches, flavors, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full bg-zinc-900/90 border border-zinc-800 px-4 py-2 pl-10 text-xs text-white placeholder-zinc-500 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition"
            />
            <Search className="absolute left-3.5 h-3.5 w-3.5 text-zinc-500" />
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Account / Admin Portal */}
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-md bg-gold-500/10 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 transition"
              >
                CMS Admin
              </Link>
            )}

            <Link
              href={user ? '/account/dashboard' : '/account/login'}
              className="p-2 text-zinc-300 hover:text-gold-400 transition"
              title={user ? 'My Account' : 'Sign In'}
            >
              <User className="h-5 w-5" />
            </Link>

            <Link
              href="/account/wishlist"
              className="hidden sm:block p-2 text-zinc-300 hover:text-gold-400 transition"
              title="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-gold-500 to-amber-600 px-3.5 py-2 text-xs font-bold text-black shadow-lg hover:brightness-110 transition active:scale-95"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline font-bold">{formatPrice(subtotal)}</span>
              {itemCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[11px] font-extrabold text-gold-400 shadow">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-800 bg-[#09090b] px-4 pt-3 pb-6 animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search pouches, brands, flavors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2.5 pl-10 text-sm text-white placeholder-zinc-500"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            </div>
          </form>

          <div className="flex flex-col space-y-3 text-sm">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-200 font-medium py-1"
            >
              Shop All Pouches
            </Link>
            <div className="border-t border-zinc-800/60 pt-2">
              <span className="text-xs uppercase tracking-wider text-gold-400 font-bold block mb-2">
                Popular Flavours
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  href="/products?flavor=Mint%20%26%20Ice"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded bg-zinc-900 text-zinc-300"
                >
                  Mint & Ice
                </Link>
                <Link
                  href="/products?flavor=Fruit%20%26%20Berry"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded bg-zinc-900 text-zinc-300"
                >
                  Fruit & Berry
                </Link>
                <Link
                  href="/products?flavor=Cola%20%26%20Energy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded bg-zinc-900 text-zinc-300"
                >
                  Cola & Energy
                </Link>
              </div>
            </div>

            <div className="border-t border-zinc-800/60 pt-2">
              <span className="text-xs uppercase tracking-wider text-gold-400 font-bold block mb-2">
                Shop by Strength
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <Link
                  href="/products?strength=Light"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded bg-zinc-900 text-zinc-300"
                >
                  Light
                </Link>
                <Link
                  href="/products?strength=Strong"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded bg-zinc-900 text-zinc-300"
                >
                  Strong
                </Link>
                <Link
                  href="/products?strength=Ultra"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded bg-zinc-900 text-rose-400 font-bold"
                >
                  Ultra (50mg+)
                </Link>
              </div>
            </div>

            <div className="border-t border-zinc-800/60 pt-2 flex flex-col gap-2">
              <Link
                href="/brands"
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-200"
              >
                All Brands (18+)
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-200"
              >
                Guides & Articles
              </Link>
              <Link
                href="/pages/wholesale"
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-200"
              >
                Wholesale Portal
              </Link>
              <Link
                href="/pages/rewards"
                onClick={() => setMobileMenuOpen(false)}
                className="text-amber-400"
              >
                VIP Rewards
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gold-400 font-bold"
                >
                  Admin CMS Panel
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

