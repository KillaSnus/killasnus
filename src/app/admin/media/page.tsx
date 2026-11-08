'use client';

import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  Folder,
  File,
  ExternalLink,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media');
      if (res.ok) {
        const data = await res.json();
        setMediaItems(data.media || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', selectedFolder === 'all' ? 'products' : selectedFolder);

        await fetch('/api/media/upload', {
          method: 'POST',
          body: formData,
        });
      }
      fetchMedia();
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media file from Cloudflare R2?')) return;
    try {
      await fetch(`/api/media/${id}`, { method: 'DELETE' });
      fetchMedia();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = mediaItems.filter((m) => {
    const matchesFolder = selectedFolder === 'all' || m.folder === selectedFolder;
    const matchesSearch =
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.altText?.toLowerCase().includes(search.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400">Storage</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-0.5">
            Cloudflare R2 Media Library
          </h1>
          <p className="text-xs text-zinc-400">
            Fast, zero-egress asset storage for product photography, banners, and logos.
          </p>
        </div>

        <div>
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-extrabold uppercase tracking-wider transition shadow cursor-pointer">
            <Upload className="h-4 w-4" />
            <span>{uploading ? 'Uploading to R2...' : 'Upload Assets'}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Folders and Search Bar */}
      <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-1.5 overflow-x-auto text-xs font-bold uppercase tracking-wider">
          {['all', 'products', 'banners', 'brands', 'blog'].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFolder(f)}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedFolder === f
                  ? 'bg-gold-500 text-black'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search filenames..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 pl-9 text-xs text-white placeholder-zinc-500 focus:border-gold-500 focus:outline-none"
          />
          <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-zinc-500" />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-zinc-500 text-xs">
            No media files found in this folder.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl bg-[#111114] border border-zinc-800 overflow-hidden hover:border-gold-500/40 transition flex flex-col justify-between"
            >
              <div className="relative aspect-square w-full bg-black p-2 flex items-center justify-center">
                <img src={item.url} alt={item.name} className="h-full w-full object-contain" />
              </div>

              <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/60">
                <h4 className="text-[11px] font-bold text-white truncate" title={item.name}>
                  {item.name}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
                  <span>{(item.size / 1024).toFixed(0)} KB</span>
                  <span className="uppercase text-gold-400/80">{item.folder}</span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-zinc-800 flex items-center justify-between">
                  <button
                    onClick={() => handleCopyUrl(item.url, item.id)}
                    className="flex items-center gap-1 text-[10px] font-bold text-gold-400 hover:text-gold-300"
                    title="Copy direct CDN link"
                  >
                    {copiedKey === item.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-zinc-500 hover:text-rose-400 p-1"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

