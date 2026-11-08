'use client';

import React, { useState } from 'react';
import { CreditCard, DollarSign, Truck, Building, Coins, Plus, Check, Save } from 'lucide-react';

interface GatewayConfig {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  instructions?: string;
  apiKey?: string;
  secretKey?: string;
}

export default function AdminPaymentSettingsPage() {
  const [gateways, setGateways] = useState<GatewayConfig[]>([
    {
      id: 'stripe',
      name: 'Stripe (Cards & Apple Pay)',
      type: 'STRIPE',
      enabled: true,
      apiKey: 'pk_live_placeholder',
      secretKey: 'sk_live_placeholder',
    },
    {
      id: 'paypal',
      name: 'PayPal Express Checkout',
      type: 'PAYPAL',
      enabled: true,
      apiKey: 'client_id_placeholder',
    },
    {
      id: 'cod',
      name: 'Cash On Delivery (COD)',
      type: 'MANUAL',
      enabled: true,
      instructions: 'Available for selected UK delivery postcodes. Pay driver upon arrival.',
    },
    {
      id: 'bank-transfer',
      name: 'Direct Bank Transfer (BACS/Faster Payments)',
      type: 'BANK_TRANSFER',
      enabled: true,
      instructions: 'Sort Code: 04-00-04 | Account: 82910482 | Reference: Order Number',
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency (BTC / ETH / USDT)',
      type: 'CRYPTO',
      enabled: true,
      instructions: 'BTC Deposit: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    },
  ]);

  const [newGatewayName, setNewGatewayName] = useState('');
  const [newGatewayType, setNewGatewayType] = useState('CUSTOM');
  const [newGatewayInstructions, setNewGatewayInstructions] = useState('');
  const [saved, setSaved] = useState(false);

  const handleToggle = (id: string) => {
    setGateways(gateways.map((g) => (g.id === id ? { ...g, enabled: !g.enabled } : g)));
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGatewayName.trim()) return;

    const newG: GatewayConfig = {
      id: `custom-${Date.now()}`,
      name: newGatewayName,
      type: newGatewayType,
      enabled: true,
      instructions: newGatewayInstructions,
    };

    setGateways([...gateways, newG]);
    setNewGatewayName('');
    setNewGatewayInstructions('');
  };

  const handleSaveAll = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400">Settings</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-0.5">
            Payment Gateways Manager
          </h1>
          <p className="text-xs text-zinc-400">
            Configure Stripe, PayPal, COD, Crypto, Faster Payments, and create custom gateways.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-extrabold uppercase tracking-wider transition shadow"
        >
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? 'Saved!' : 'Save Gateways'}
        </button>
      </div>

      {/* Gateway Cards List */}
      <div className="space-y-4">
        {gateways.map((g) => (
          <div
            key={g.id}
            className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-gold-400">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{g.name}</h3>
                  <span className="text-[10px] text-zinc-500 uppercase font-mono font-semibold">
                    Type: {g.type}
                  </span>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={g.enabled}
                  onChange={() => handleToggle(g.id)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
              </label>
            </div>

            {g.instructions !== undefined && (
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Customer Instructions (Shown on Checkout & Receipt)
                </label>
                <textarea
                  rows={2}
                  value={g.instructions}
                  onChange={(e) => {
                    const copy = gateways.map((item) =>
                      item.id === g.id ? { ...item, instructions: e.target.value } : item
                    );
                    setGateways(copy);
                  }}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-zinc-200"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Custom Payment Gateway */}
      <form onSubmit={handleAddCustom} className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-gold-400 flex items-center gap-2">
          <Plus className="h-4 w-4" /> Create Custom Payment Gateway
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Gateway Name</label>
            <input
              type="text"
              required
              value={newGatewayName}
              onChange={(e) => setNewGatewayName(e.target.value)}
              placeholder="e.g. Klarna / PayPo / Monzo"
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Gateway Type</label>
            <select
              value={newGatewayType}
              onChange={(e) => setNewGatewayType(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
            >
              <option value="CUSTOM">Custom Gateway</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CRYPTO">Crypto Wallet</option>
              <option value="MANUAL">Manual Payment</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">Payment Instructions</label>
          <textarea
            rows={2}
            value={newGatewayInstructions}
            onChange={(e) => setNewGatewayInstructions(e.target.value)}
            placeholder="Instructions displayed to customer..."
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
          />
        </div>

        <button
          type="submit"
          className="rounded-xl bg-gold-500 hover:bg-gold-400 px-5 py-2.5 text-xs font-extrabold text-black uppercase tracking-wider transition shadow"
        >
          Add Gateway
        </button>
      </form>
    </div>
  );
}

