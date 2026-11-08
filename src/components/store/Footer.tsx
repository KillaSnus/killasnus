'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ShieldAlert, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#070709] border-t border-zinc-800/90 text-zinc-400">
      {/* Newsletter Bar */}
      <div className="border-b border-zinc-800/80 bg-gradient-to-r from-[#0d0d10] via-[#141419] to-[#0d0d10] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <span className="text-xs font-extrabold uppercase tracking-widest text-gold-400">
                VIP Club Access
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
                Unlock 10% Off Your First Order
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 max-w-md">
                Get early access to limited batch drops, exclusive subscriber flash sales, and new flavour releases.
              </p>
            </div>

            <div className="w-full lg:max-w-md">
              {subscribed ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Welcome! Check your inbox for your 10% coupon code: <strong>WELCOME10</strong></span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl bg-zinc-900 border border-zinc-700/80 px-4 py-3 text-xs text-white placeholder-zinc-500 focus:border-gold-500 focus:outline-none"
                    />
                    <Mail className="absolute right-3.5 top-3.5 h-4 w-4 text-zinc-500" />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-1 rounded-xl bg-gold-500 hover:bg-gold-400 px-5 py-3 text-xs font-extrabold text-black uppercase tracking-wider transition active:scale-95 whitespace-nowrap"
                  >
                    Join <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 via-gold-500 to-amber-700 p-[1.5px] shadow-lg">
                <div className="h-full w-full bg-black rounded-[10px] flex items-center justify-center">
                  <span className="font-extrabold text-gold-400 text-lg">K</span>
                </div>
              </div>
              <span className="font-black text-xl tracking-wider text-white uppercase">
                KILLA<span className="text-gold-400">SNUS</span>
              </span>
            </Link>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              The premier destination for authentic Scandinavian nicotine pouches. Tobacco-free,
              smoke-free, and spit-free. Direct delivery from certified European manufacturers.
            </p>

            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Lock className="h-3.5 w-3.5 text-gold-400" />
              <span>Safe & Secure 256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>

          {/* Column: Categories */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white mb-4">
              Shop Pouches
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/products" className="hover:text-gold-400 transition">
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link href="/products?flavor=Mint%20%26%20Ice" className="hover:text-gold-400 transition">
                  Mint & Ice Flavours
                </Link>
              </li>
              <li>
                <Link href="/products?flavor=Fruit%20%26%20Berry" className="hover:text-gold-400 transition">
                  Fruit & Berry Flavours
                </Link>
              </li>
              <li>
                <Link href="/products?flavor=Cola%20%26%20Energy" className="hover:text-gold-400 transition">
                  Cola & Energy Flavours
                </Link>
              </li>
              <li>
                <Link href="/products?strength=Strong" className="hover:text-gold-400 transition">
                  Strong (15-20mg)
                </Link>
              </li>
              <li>
                <Link href="/products?strength=Ultra" className="hover:text-gold-400 transition">
                  Ultra Strong (50mg+)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Brands */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white mb-4">
              Top Brands
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/brands/killa" className="hover:text-gold-400 transition">
                  Killa
                </Link>
              </li>
              <li>
                <Link href="/brands/pablo" className="hover:text-gold-400 transition">
                  Pablo
                </Link>
              </li>
              <li>
                <Link href="/brands/velo" className="hover:text-gold-400 transition">
                  Velo
                </Link>
              </li>
              <li>
                <Link href="/brands/zyn" className="hover:text-gold-400 transition">
                  ZYN
                </Link>
              </li>
              <li>
                <Link href="/brands/iceberg" className="hover:text-gold-400 transition">
                  Iceberg
                </Link>
              </li>
              <li>
                <Link href="/brands" className="text-gold-400 font-semibold hover:underline">
                  View All 18 Brands →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Customer Care */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/pages/faq" className="hover:text-gold-400 transition">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/pages/contact-us" className="hover:text-gold-400 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/pages/returns-policy" className="hover:text-gold-400 transition">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/pages/payment-methods" className="hover:text-gold-400 transition">
                  Payment Methods
                </Link>
              </li>
              <li>
                <Link href="/pages/wholesale" className="hover:text-gold-400 transition">
                  Wholesale & B2B
                </Link>
              </li>
              <li>
                <Link href="/pages/terms-of-service" className="hover:text-gold-400 transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/pages/privacy-policy" className="hover:text-gold-400 transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Required Nicotine Health Disclaimer */}
        <div className="mt-12 rounded-2xl bg-zinc-950 border border-zinc-800 p-5 text-center">
          <div className="flex items-center justify-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1.5">
            <ShieldAlert className="h-4 w-4" />
            <span>Health & Age Warning</span>
          </div>
          <p className="text-[11px] text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            This product contains nicotine. Nicotine is an addictive chemical. Not suitable for individuals under
            18 years of age, pregnant or breastfeeding women, or people with cardiovascular disease. Keep out of
            reach of children and pets.
          </p>
        </div>

        {/* Bottom copyright and payment methods */}
        <div className="mt-10 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} KILLASNUS. All rights reserved. Original Design.</p>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">VISA</span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">Mastercard</span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">Apple Pay</span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">PayPal</span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-gold-400">Crypto</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

