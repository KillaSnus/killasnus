'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, ArrowRight, Printer, Clock, Truck, ShieldCheck } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'KNS-10492';
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire festive gold/metallic confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#ffd700', '#ffffff', '#e5c158'],
      });
    } catch (e) {
      // ignore
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderNumber}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
        }
      } catch (err) {
        console.warn('Could not load order details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  return (
    <div className="bg-[#09090b] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-gold-400">
            Order Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mt-1">
            Thank You For Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Order Reference: <strong className="text-white font-mono">{orderNumber}</strong>
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            A confirmation receipt and tracking code have been sent to your email.
          </p>
        </div>

        {/* Order Tracker Timeline */}
        <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 mb-8">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 mb-6">
            Live Order Status
          </h3>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="space-y-2">
              <div className="mx-auto h-8 w-8 rounded-full bg-gold-500 text-black flex items-center justify-center font-bold">
                ✓
              </div>
              <span className="font-bold text-white block">Confirmed</span>
              <span className="text-[10px] text-zinc-500">Just now</span>
            </div>
            <div className="space-y-2">
              <div className="mx-auto h-8 w-8 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-400 flex items-center justify-center font-bold">
                2
              </div>
              <span className="font-semibold text-zinc-300 block">Processing</span>
              <span className="text-[10px] text-zinc-500">Warehouse</span>
            </div>
            <div className="space-y-2">
              <div className="mx-auto h-8 w-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-600 flex items-center justify-center">
                3
              </div>
              <span className="text-zinc-500 block">Shipped</span>
              <span className="text-[10px] text-zinc-600">Tracked</span>
            </div>
            <div className="space-y-2">
              <div className="mx-auto h-8 w-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-600 flex items-center justify-center">
                4
              </div>
              <span className="text-zinc-500 block">Delivered</span>
              <span className="text-[10px] text-zinc-600">At door</span>
            </div>
          </div>
        </div>

        {/* Order Details snapshot */}
        {order && (
          <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-6 mb-8 text-xs">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
              <div>
                <span className="text-zinc-400">Order Placed: </span>
                <span className="text-white font-medium">{formatDate(order.createdAt)}</span>
              </div>
              <div>
                <span className="text-zinc-400">Payment: </span>
                <span className="text-gold-400 font-bold uppercase">{order.paymentMethod}</span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center text-zinc-300">
                  <span>
                    {item.name} <strong className="text-white font-mono">x{item.quantity}</strong>
                  </span>
                  <span className="font-bold text-white">{formatPrice(item.total)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-800 pt-3 space-y-1 text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-gold-400">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>{order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-white pt-2 border-t border-zinc-800">
                <span>Total Paid</span>
                <span className="text-gold-400">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/products"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gold-500 hover:bg-gold-400 py-3.5 text-xs font-extrabold text-black uppercase tracking-wider transition"
          >
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/account/orders"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 py-3.5 text-xs font-bold text-white transition"
          >
            View Order History
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-white">Loading order...</div>}>
      <SuccessContent />
    </Suspense>
  );
}

