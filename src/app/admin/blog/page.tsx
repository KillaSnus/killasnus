'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Plus, Trash2, Edit, Eye, Sparkles } from 'lucide-react';
import { formatDate, slugify } from '@/lib/utils';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState(
    'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80'
  );
  const [authorName, setAuthorName] = useState('Editorial Team');
  const [saving, setSaving] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blog');
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug: slug || slugify(title),
          excerpt,
          content,
          featuredImage,
          authorName,
          isPublished: true,
        }),
      });
      setShowNewModal(false);
      setTitle('');
      setSlug('');
      setExcerpt('');
      setContent('');
      fetchPosts();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400">Content</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-0.5">
            Blog Posts & Articles ({posts.length})
          </h1>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-extrabold uppercase tracking-wider transition shadow"
        >
          <Plus className="h-4 w-4" /> New Article
        </button>
      </div>

      <div className="rounded-2xl bg-[#111114] border border-zinc-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#15151a] border-b border-zinc-800 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="p-4">Article</th>
              <th className="p-4">Author</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Published</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-zinc-500">
                  Loading articles...
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-zinc-500">
                  No published articles yet.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-zinc-900/40 transition">
                  <td className="p-4 font-bold text-white max-w-sm truncate">{post.title}</td>
                  <td className="p-4 text-zinc-400">{post.authorName}</td>
                  <td className="p-4 font-mono text-zinc-500">/blog/{post.slug}</td>
                  <td className="p-4 text-zinc-400">{formatDate(post.createdAt)}</td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Article Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCreatePost}
            className="relative w-full max-w-2xl rounded-2xl bg-[#111114] border border-zinc-800 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs"
          >
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Create New Article
            </h3>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSlug(slugify(e.target.value));
                }}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-300 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Excerpt</label>
              <input
                type="text"
                required
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Article Content</label>
              <textarea
                rows={8}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write article in markdown..."
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-3 text-white leading-relaxed"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-gold-500 hover:bg-gold-400 py-2.5 font-extrabold text-black uppercase tracking-wider"
              >
                {saving ? 'Publishing...' : 'Publish Article'}
              </button>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

