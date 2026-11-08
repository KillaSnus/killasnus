'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store/auth-context';
import {
  Package,
  MapPin,
  Heart,
  User,
  LogOut,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
} from 'lucide-react';
import { formatPrice, formatDate, getOrderStatusBadge } from '@/lib/utils';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { user, profile, loading, logout } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/account/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders/user');
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (e) {
        console.warn('Could not load user orders:', e);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="bg-[#09090b] min-h-screen py-20 flex items-center justify-center text-zinc-400">
        Loading customer dashboard...
      </div>
    );
  }

  return (
    <div className="bg-[#09090b] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Greeting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-zinc-800 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-gold-400">
              Customer Portal
            </span>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight mt-1">
              Welcome, {profile?.name || user.displayName || user.email?.split('@')[0]}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Member ID: <span className="font-mono text-zinc-300">{profile?.id || user.uid.slice(0, 8)}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => logout()}
              className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs font-bold text-zinc-400 hover:text-rose-400 hover:border-zinc-700 transition"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Quick Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-2xl bg-[#111114] border border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Orders</span>
              <div className="h-10 w-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <Package className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white mt-4">{orders.length}</div>
            <span className="text-[11px] text-zinc-500 mt-1 block">Lifetime placed orders</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#111114] border border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">VIP Rewards</span>
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Zap className="h-5 w-5 fill-amber-400" />
              </div>
            </div>
            <div className="text-3xl font-black text-gold-400 mt-4">250 Pts</div>
            <span className="text-[11px] text-zinc-500 mt-1 block">Tier: Gold Member (5% Off Next)</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#111114] border border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Saved Addresses</span>
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <MapPin className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white mt-4">1</div>
            <span className="text-[11px] text-zinc-500 mt-1 block">Default UK shipping address</span>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex gap-4 border-b border-zinc-800 pb-4 mb-8 text-xs font-bold uppercase tracking-wider overflow-x-auto">
          <Link href="/account/dashboard" className="text-gold-400 border-b-2 border-gold-500 pb-2">
            Overview
          </Link>
          <Link href="/account/orders" className="text-zinc-400 hover:text-white pb-2 transition">
            Order History
          </Link>
          <Link href="/account/addresses" className="text-zinc-400 hover:text-white pb-2 transition">
            Address Book
          </Link>
          <Link href="/account/wishlist" className="text-zinc-400 hover:text-white pb-2 transition">
            Wishlist
          </Link>
        </div>

        {/* Recent Orders Table */}
        <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Recent Orders
            </h2>
            <Link
              href="/account/orders"
              className="text-xs font-bold text-gold-400 hover:underline flex items-center gap-1"
            >
              All Orders <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {loadingOrders ? (
            <p className="text-xs text-zinc-400 py-6 text-center">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs text-zinc-400 mb-3">You haven't placed any orders yet.</p>
              <Link
                href="/products"
                className="inline-flex rounded-xl bg-gold-500 px-5 py-2 text-xs font-bold text-black uppercase tracking-wider"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {orders.slice(0, 5).map((order) => {
                const badge = getOrderStatusBadge(order.status);
                return (
                  <div key={order.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-white text-sm">{order.orderNumber}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.className}`}>
                          {badge.label}
                        </span>
                      </div>
                      <span className="text-zinc-400">Placed on {formatDate(order.createdAt)} • {order.items?.length || 1} cans</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-black text-gold-400 text-sm">{formatPrice(order.total)}</span>
                      <Link
                        href={`/checkout/success?orderNumber=${order.orderNumber}`}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-gold-500/40 text-zinc-300 hover:text-white transition font-semibold"
                      >
                        Track Order
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

