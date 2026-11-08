'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Search, Download, Upload, Tag, FileText, Check, Phone, Mail } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/customers?search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleOpenCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setNotes(customer.notes || '');
    setTags((customer.tags || []).join(', '));
  };

  const handleSaveNotesAndTags = async () => {
    if (!selectedCustomer) return;
    setSavingNote(true);
    try {
      await fetch(`/api/customers/${selectedCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      });
      fetchCustomers();
      setSelectedCustomer(null);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
            Customer CRM
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-0.5">
            Customers ({customers.length})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/import-export"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white text-xs font-semibold"
          >
            <Upload className="h-3.5 w-3.5" /> Import CSV
          </Link>
          <a
            href="/api/import-export?type=customers"
            download
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white text-xs font-semibold"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </a>
        </div>
      </div>

      {/* Search Input */}
      <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search customer email, name, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2 pl-9 text-xs text-white placeholder-zinc-500 focus:border-gold-500 focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
        </div>
      </div>

      {/* Customer Table */}
      <div className="rounded-2xl bg-[#111114] border border-zinc-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#15151a] border-b border-zinc-800 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Role</th>
              <th className="p-4">Tags</th>
              <th className="p-4">Joined Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-500">
                  Loading customers...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-500">
                  No registered customers yet.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-900/40 transition">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold uppercase">
                      {c.name ? c.name.slice(0, 1) : c.email.slice(0, 1)}
                    </div>
                    <div>
                      <span className="block font-semibold">{c.name || 'Anonymous User'}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">{c.id.slice(0, 10)}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="space-y-0.5">
                      <span className="text-zinc-300 block">{c.email}</span>
                      {c.phone && <span className="text-[10px] text-zinc-500 block">{c.phone}</span>}
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        c.role === 'ADMIN'
                          ? 'bg-gold-500/15 text-gold-400 border-gold-500/30'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}
                    >
                      {c.role}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {c.tags?.length ? (
                        c.tags.map((t: string) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-full text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-300"
                          >
                            {t}
                          </span>
                        ))
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 text-zinc-400">{formatDate(c.createdAt)}</td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenCustomer(c)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-gold-500/40 text-gold-400 hover:text-white transition font-semibold"
                    >
                      Tags & Notes
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Tags & Notes Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-[#111114] border border-zinc-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Customer CRM: {selectedCustomer.name || selectedCustomer.email}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Customer Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="VIP, Wholesale, High-Volume"
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Internal Admin Notes
              </label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Log customer support communications, wholesale requests, or special handling..."
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSaveNotesAndTags}
                disabled={savingNote}
                className="flex-1 rounded-xl bg-gold-500 hover:bg-gold-400 py-2.5 text-xs font-extrabold text-black uppercase tracking-wider"
              >
                {savingNote ? 'Saving...' : 'Save Notes & Tags'}
              </button>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

