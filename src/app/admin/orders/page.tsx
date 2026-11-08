'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  XCircle,
  Download,
} from 'lucide-react';
import { formatPrice, formatDate, getOrderStatusBadge } from '@/lib/utils';

const statuses = [
  'ALL',
  'PENDING',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'COMPLETED',
  'REFUNDED',
  'CANCELLED',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url =
        activeStatus === 'ALL'
          ? `/api/orders?search=${encodeURIComponent(search)}`
          : `/api/orders?status=${activeStatus}&search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeStatus, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
            Fulfillment
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-0.5">
            Orders ({orders.length})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/import-export?type=orders"
            download
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white text-xs font-semibold transition"
          >
            <Download className="h-3.5 w-3.5" /> Export Orders CSV
          </a>
        </div>
      </div>

      {/* Filter Tabs by Status */}
      <div className="flex gap-2 border-b border-zinc-800 pb-3 overflow-x-auto text-xs font-bold uppercase tracking-wider">
        {statuses.map((st) => (
          <button
            key={st}
            onClick={() => setActiveStatus(st)}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeStatus === st
                ? 'bg-gold-500 text-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search order number, customer email, or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2 pl-9 text-xs text-white placeholder-zinc-500 focus:border-gold-500 focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-[#111114] border border-zinc-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#15151a] border-b border-zinc-800 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Date</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {loading ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-zinc-500">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-zinc-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((o) => {
                const badge = getOrderStatusBadge(o.status);
                return (
                  <tr key={o.id} className="hover:bg-zinc-900/40 transition">
                    <td className="p-4 font-mono font-bold text-white">
                      <Link href={`/admin/orders/${o.id}`} className="hover:text-gold-400">
                        {o.orderNumber}
                      </Link>
                    </td>

                    <td className="p-4 text-zinc-400">{formatDate(o.createdAt)}</td>

                    <td className="p-4">
                      <div>
                        <span className="font-semibold text-white block">
                          {o.guestName || o.user?.name || 'Guest'}
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          {o.guestEmail || o.user?.email}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="text-[10px] font-bold text-gold-400 uppercase">
                        {o.paymentMethod} ({o.paymentStatus})
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </td>

                    <td className="p-4 font-semibold text-zinc-300">
                      {o.items?.length || 1} cans
                    </td>

                    <td className="p-4 font-bold text-gold-400 text-sm">{formatPrice(o.total)}</td>

                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-gold-500/40 text-gold-400 hover:text-white transition font-semibold"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

