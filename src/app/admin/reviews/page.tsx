'use client';

import React, { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reviews?admin=true');
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id: string, isApproved: boolean) => {
    try {
      await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved }),
      });
      fetchReviews();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-gold-400">Social Proof</span>
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-0.5">
          Product Reviews Moderation ({reviews.length})
        </h1>
        <p className="text-xs text-zinc-400">
          Moderate, approve, and verify authentic customer ratings and feedback.
        </p>
      </div>

      <div className="rounded-2xl bg-[#111114] border border-zinc-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#15151a] border-b border-zinc-800 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Product</th>
              <th className="p-4">Rating & Review</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-zinc-500">
                  Loading reviews...
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-zinc-500">
                  No submitted reviews to moderate.
                </td>
              </tr>
            ) : (
              reviews.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-900/40 transition">
                  <td className="p-4">
                    <span className="font-bold text-white block">{r.authorName}</span>
                    <span className="text-[10px] text-zinc-500">{r.authorEmail}</span>
                  </td>

                  <td className="p-4 font-bold text-zinc-200">
                    {r.product?.name || 'General Review'}
                  </td>

                  <td className="p-4 max-w-sm">
                    <div className="flex gap-0.5 text-gold-400 mb-1">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-gold-400" />
                      ))}
                    </div>
                    {r.title && <strong className="text-white block">{r.title}</strong>}
                    <p className="text-zinc-400 text-[11px] line-clamp-2">{r.content}</p>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        r.isApproved
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                          : 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                      }`}
                    >
                      {r.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!r.isApproved ? (
                        <button
                          onClick={() => handleApprove(r.id, true)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApprove(r.id, false)}
                          className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px]"
                        >
                          Unapprove
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

