'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Truck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  Printer,
  ShieldCheck,
  User,
  MapPin,
  CreditCard,
} from 'lucide-react';
import { formatPrice, formatDate, formatDateTime, getOrderStatusBadge } from '@/lib/utils';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingCarrier, setTrackingCarrier] = useState('Royal Mail 48 Tracked');
  const [timelineNote, setTimelineNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        setStatus(data.order.status);
        setPaymentStatus(data.order.paymentStatus);
        setTrackingNumber(data.order.trackingNumber || '');
        setTrackingCarrier(data.order.trackingCarrier || 'Royal Mail 48 Tracked');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          paymentStatus,
          trackingNumber,
          trackingCarrier,
          timelineNote,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimelineNote('');
        setTimeout(() => setSavedSuccess(false), 2000);
        fetchOrder();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleRefund = async () => {
    if (!confirm('Are you sure you want to refund this order?')) return;
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'REFUNDED',
          paymentStatus: 'REFUNDED',
          timelineNote: 'Order marked as REFUNDED by Admin.',
        }),
      });
      fetchOrder();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">Loading order {id}...</div>;
  }

  if (!order) {
    return (
      <div className="p-8 text-center text-zinc-500">
        Order not found.{' '}
        <Link href="/admin/orders" className="text-gold-400 underline">
          Return to orders
        </Link>
      </div>
    );
  }

  const badge = getOrderStatusBadge(order.status);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white font-mono">
                {order.orderNumber}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.className}`}
              >
                {badge.label}
              </span>
            </div>
            <span className="text-xs text-zinc-400">
              Placed on {formatDateTime(order.createdAt)} via {order.paymentMethod}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white text-xs font-semibold"
          >
            <Printer className="h-4 w-4" /> Print Invoice
          </button>
          <button
            onClick={handleRefund}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-900/50 bg-rose-950/40 text-rose-400 hover:bg-rose-900/40 text-xs font-semibold"
          >
            <RotateCcw className="h-4 w-4" /> Refund
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Items and Timeline */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order Items Table */}
          <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-white">
              Items Ordered ({order.items?.length || 0})
            </h2>

            <div className="divide-y divide-zinc-800">
              {order.items?.map((item: any) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 flex-shrink-0 bg-black rounded-lg border border-zinc-800 overflow-hidden">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{item.name}</h4>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        SKU: {item.sku} • {formatPrice(item.price)} each
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-white text-sm">
                      {formatPrice(item.total)}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">Qty: {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-zinc-800 pt-4 space-y-2 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-zinc-200">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-gold-400">
                  <span>Discount ({order.couponCode || 'PROMO'})</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="text-zinc-200">
                  {order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-zinc-800">
                <span>Total Amount</span>
                <span className="text-gold-400 text-lg">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Timeline Audit Trail */}
          <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-white">
              Order Timeline & History
            </h2>

            <div className="space-y-4">
              {order.timeline?.map((item: any) => (
                <div key={item.id} className="flex gap-3 text-xs">
                  <div className="mt-1 h-2 w-2 rounded-full bg-gold-400 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{item.title}</span>
                      <span className="text-[10px] text-zinc-500">{formatDateTime(item.createdAt)}</span>
                    </div>
                    {item.message && <p className="text-zinc-400 mt-0.5">{item.message}</p>}
                    <span className="text-[10px] text-zinc-500 font-mono">By: {item.createdBy || 'System'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Status Updater & Shipping Snapshot */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Tracking Updater Form */}
          <form onSubmit={handleUpdateOrder} className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-white">
              Update Status & Dispatch
            </h2>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Order Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
              >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="COMPLETED">Completed</option>
                <option value="REFUNDED">Refunded</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Courier Carrier</label>
              <input
                type="text"
                value={trackingCarrier}
                onChange={(e) => setTrackingCarrier(e.target.value)}
                placeholder="Royal Mail / DPD / DHL"
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Tracking Number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="GB123456789RM"
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Add Timeline Note</label>
              <input
                type="text"
                value={timelineNote}
                onChange={(e) => setTimelineNote(e.target.value)}
                placeholder="Dispatched via tracked van..."
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-gold-500 hover:bg-gold-400 py-3 text-xs font-extrabold text-black uppercase tracking-wider transition shadow"
            >
              {savedSuccess ? '✓ Order Updated' : saving ? 'Updating...' : 'Save Changes'}
            </button>
          </form>

          {/* Customer & Address Details */}
          <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4 text-xs">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-gold-400" /> Shipping Destination
            </h2>

            {order.shippingAddress && (
              <div className="text-zinc-300 space-y-1">
                <p className="font-bold text-white">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </p>
                <p className="uppercase font-semibold">{order.shippingAddress.country}</p>
                <p className="text-gold-400 font-mono pt-1">
                  📞 {order.shippingAddress.phone || order.guestPhone || 'No phone'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

