'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Plus, Edit, Eye, Trash2, Sliders, Check } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminPagesList() {
  const [pages, setPages] = useState<any[]>([
    { id: 'home', title: 'Home Page', slug: 'home', isPublished: true, updatedAt: new Date() },
    { id: 'about-us', title: 'About Us', slug: 'about-us', isPublished: true, updatedAt: new Date() },
    { id: 'wholesale', title: 'Wholesale B2B', slug: 'wholesale', isPublished: true, updatedAt: new Date() },
    { id: 'rewards', title: 'VIP Rewards', slug: 'rewards', isPublished: true, updatedAt: new Date() },
    { id: 'faq', title: 'FAQ & Help', slug: 'faq', isPublished: true, updatedAt: new Date() },
    { id: 'terms-of-service', title: 'Terms of Service', slug: 'terms-of-service', isPublished: true, updatedAt: new Date() },
    { id: 'privacy-policy', title: 'Privacy Policy', slug: 'privacy-policy', isPublished: true, updatedAt: new Date() },
    { id: 'returns-policy', title: 'Returns Policy', slug: 'returns-policy', isPublished: true, updatedAt: new Date() },
    { id: 'payment-methods', title: 'Payment Methods', slug: 'payment-methods', isPublished: true, updatedAt: new Date() },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400">Content CMS</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-0.5">
            Store Pages ({pages.length})
          </h1>
        </div>

        <Link
          href="/admin/pages/builder/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-extrabold uppercase tracking-wider transition shadow"
        >
          <Plus className="h-4 w-4" /> New CMS Page
        </Link>
      </div>

      <div className="rounded-2xl bg-[#111114] border border-zinc-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#15151a] border-b border-zinc-800 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">URL Handle</th>
              <th className="p-4">Status</th>
              <th className="p-4">Last Updated</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {pages.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-900/40 transition">
                <td className="p-4 font-bold text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gold-400" />
                  <span>{p.title}</span>
                </td>
                <td className="p-4 font-mono text-zinc-400">/pages/{p.slug}</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                    Published
                  </span>
                </td>
                <td className="p-4 text-zinc-400">{formatDate(p.updatedAt)}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/pages/${p.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                      title="View live page"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/admin/pages/builder/${p.id}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-gold-500/40 text-gold-400 hover:text-white transition font-bold"
                    >
                      <Sliders className="h-3.5 w-3.5" /> Page Builder
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

