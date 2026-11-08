'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Lock,
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowRight,
  Check,
  Building,
  Coins,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '@/lib/store/cart-context';
import { useAuth } from '@/lib/store/auth-context';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discountAmount, shippingFee, total, coupon, clearCart } = useCart();
  const { user, profile } = useAuth();

  // Form Fields
  const [email, setEmail] = useState(user?.email || '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('GB');

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const actualShippingFee =
    shippingMethod === 'express' ? 7.99 : shippingFee;
  const grandTotal = Math.max(0, subtotal - discountAmount + actualShippingFee);

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<
    'STRIPE' | 'PAYPAL' | 'COD' | 'BANK_TRANSFER' | 'CRYPTO'
  >('STRIPE');

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (items.length === 0) {
    return (
      <div className="bg-[#09090b] min-h-screen py-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">No items to checkout</h2>
          <p className="text-xs text-zinc-400 mb-4">Please add products to your cart before proceeding.</p>
          <Link
            href="/products"
            className="inline-flex rounded-xl bg-gold-500 px-6 py-2.5 text-xs font-bold text-black uppercase tracking-wider"
          >
            Browse Pouches
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const orderPayload = {
        email,
        firstName,
        lastName,
        phone,
        shippingAddress: {
          firstName,
          lastName,
          phone,
          address1,
          address2,
          city,
          state,
          postalCode,
          country,
        },
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          variantName: i.variantName,
          name: i.name,
          sku: i.sku,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        paymentMethod,
        subtotal,
        discount: discountAmount,
        shippingFee: actualShippingFee,
        total: grandTotal,
        couponCode: coupon?.code,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Success: clear cart and redirect to success page
      clearCart();
      router.push(`/checkout/success?orderNumber=${data.order.orderNumber}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment processing error. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#09090b] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-zinc-800">
          <Link href="/cart" className="text-xs font-bold text-zinc-400 hover:text-gold-400 transition">
            ← Return to Bag
          </Link>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Lock className="h-4 w-4 text-gold-400" />
            <span>Secure 256-Bit SSL Checkout</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Customer & Shipping Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Contact info */}
            <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
                  1. Contact Information
                </h2>
                {!user && (
                  <Link href="/account/login" className="text-xs text-gold-400 hover:underline">
                    Already an account? Sign in
                  </Link>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Email Address (For Order Tracking & Receipt)
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:border-gold-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
                2. Shipping Address
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Address Line 1</label>
                <input
                  type="text"
                  required
                  placeholder="Street address, house number"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  placeholder="Apartment, suite, unit"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Town / City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">County / State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Postcode / ZIP</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:border-gold-500 focus:outline-none"
                  >
                    <option value="GB">United Kingdom (UK)</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="ES">Spain</option>
                    <option value="IT">Italy</option>
                    <option value="NL">Netherlands</option>
                    <option value="SE">Sweden</option>
                    <option value="US">United States</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Phone Number (For Courier Updates)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 7123 456789"
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
                3. Shipping Speed
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShippingMethod('standard')}
                  className={`p-4 rounded-xl border text-left transition ${
                    shippingMethod === 'standard'
                      ? 'border-gold-500 bg-gold-500/10 text-white'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-white">Standard Tracked (2-3 Days)</span>
                    <span className="text-xs font-bold text-gold-400">
                      {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500 block">Royal Mail 48 Tracked</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingMethod('express')}
                  className={`p-4 rounded-xl border text-left transition ${
                    shippingMethod === 'express'
                      ? 'border-gold-500 bg-gold-500/10 text-white'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-white">Express Next Day (1 Day)</span>
                    <span className="text-xs font-bold text-gold-400">£7.99</span>
                  </div>
                  <span className="text-[11px] text-zinc-500 block">DPD Next Working Day by 12PM</span>
                </button>
              </div>
            </div>

            {/* Payment Gateway Manager */}
            <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
                4. Payment Method
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {[
                  { id: 'STRIPE', label: 'Credit Card', icon: CreditCard },
                  { id: 'PAYPAL', label: 'PayPal', icon: DollarSign },
                  { id: 'COD', label: 'Cash on Deliv.', icon: Truck },
                  { id: 'BANK_TRANSFER', label: 'Bank Transfer', icon: Building },
                  { id: 'CRYPTO', label: 'Crypto (BTC)', icon: Coins },
                ].map((pm) => {
                  const Icon = pm.icon;
                  const active = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                        active
                          ? 'border-gold-500 bg-gold-500/15 text-gold-400 font-bold'
                          : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-[10px]">{pm.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Conditional Payment Details */}
              {paymentMethod === 'STRIPE' && (
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Name on card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full rounded-lg bg-black border border-zinc-800 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="•••• •••• •••• ••••"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full rounded-lg bg-black border border-zinc-800 px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Expires (MM/YY)</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        className="w-full rounded-lg bg-black border border-zinc-800 px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-400 mb-1">CVC / CVV</label>
                      <input
                        type="password"
                        required
                        placeholder="•••"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full rounded-lg bg-black border border-zinc-800 px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'PAYPAL' && (
                <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 text-xs text-zinc-300">
                  <p>You will be redirected to PayPal to complete your purchase securely with one click.</p>
                </div>
              )}

              {paymentMethod === 'COD' && (
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs text-zinc-300">
                  <p>Pay cash upon delivery directly to the courier driver. Available for selected UK postal zones.</p>
                </div>
              )}

              {paymentMethod === 'BANK_TRANSFER' && (
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 space-y-1">
                  <p className="font-bold text-white">Direct UK Faster Payments Transfer:</p>
                  <p>Sort Code: 04-00-04 | Account: 82910482</p>
                  <p className="text-[11px] text-gold-400">Please use your Order Number as the transfer reference.</p>
                </div>
              )}

              {paymentMethod === 'CRYPTO' && (
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 space-y-1">
                  <p className="font-bold text-white">Cryptocurrency Payment (BTC, ETH, USDT):</p>
                  <p>A deposit wallet address and QR code will be provided upon placing this order.</p>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-400 text-xs">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-6 sticky top-24">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
                Order Review ({items.length} Items)
              </h2>

              {/* Items summary list */}
              <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-xs">
                    <div className="relative h-14 w-14 flex-shrink-0 bg-black rounded-lg border border-zinc-800 overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                      <span className="absolute right-0 top-0 bg-gold-500 text-black text-[9px] font-black px-1 rounded-bl">
                        x{item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-zinc-200 font-bold truncate">{item.name}</h4>
                      {item.variantName && (
                        <span className="text-[10px] text-zinc-500 block">{item.variantName}</span>
                      )}
                    </div>
                    <span className="font-black text-gold-400">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations breakdown */}
              <div className="space-y-2 text-xs text-zinc-400 border-t border-zinc-800 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-zinc-200 font-semibold">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-gold-400">
                    <span>Discount ({coupon?.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery ({shippingMethod === 'express' ? 'Express' : 'Standard'})</span>
                  <span className="text-zinc-200">
                    {actualShippingFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : formatPrice(actualShippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-3 border-t border-zinc-800">
                  <span>Total Amount</span>
                  <span className="text-gold-400 text-2xl">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-gold-500 to-amber-600 py-4 text-sm font-extrabold text-black uppercase tracking-wider shadow-xl hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <span>Place Order & Pay {formatPrice(grandTotal)}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="text-[11px] text-zinc-500 space-y-1 text-center">
                <p>By placing this order you confirm you are 18 years of age or older.</p>
                <p>Discreet, unbranded outer packaging guaranteed.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

