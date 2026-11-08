'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, Upload, Save, Check, Eye, Image as ImageIcon, Type } from 'lucide-react';

export default function AdminLogoSettingsPage() {
  const [mode, setMode] = useState<'TEXT' | 'IMAGE'>('TEXT');
  const [imageUrl, setImageUrl] = useState('');
  const [imageWidth, setImageWidth] = useState(160);
  const [imageHeight, setImageHeight] = useState(40);
  const [faviconUrl, setFaviconUrl] = useState('');
  const [textPrefix, setTextPrefix] = useState('KILLA');
  const [textSuffix, setTextSuffix] = useState('SNUS');
  const [tagline, setTagline] = useState('LUXURY POUCHES');
  const [goldAccent, setGoldAccent] = useState(true);

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings/logo')
      .then((r) => r.json())
      .then((data) => {
        if (data.logo) {
          setMode(data.logo.mode || 'TEXT');
          setImageUrl(data.logo.imageUrl || '');
          setImageWidth(data.logo.imageWidth || 160);
          setImageHeight(data.logo.imageHeight || 40);
          setFaviconUrl(data.logo.faviconUrl || '');
          setTextPrefix(data.logo.textPrefix || 'KILLA');
          setTextSuffix(data.logo.textSuffix || 'SNUS');
          setTagline(data.logo.tagline || 'LUXURY POUCHES');
          setGoldAccent(data.logo.goldAccent ?? true);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'favicon'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'logo') setUploadingLogo(true);
    else setUploadingFavicon(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'branding');

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (type === 'logo') {
          setImageUrl(data.media.url);
          setMode('IMAGE');
        } else {
          setFaviconUrl(data.media.url);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingLogo(false);
      setUploadingFavicon(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings/logo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          imageUrl,
          imageWidth: Number(imageWidth),
          imageHeight: Number(imageHeight),
          faviconUrl,
          textPrefix,
          textSuffix,
          tagline,
          goldAccent,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
            Branding & Identity
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-0.5">
            Store Logo & Favicon
          </h1>
          <p className="text-xs text-zinc-400">
            Switch between high-resolution image logos or customized typography emblems.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-extrabold uppercase tracking-wider transition shadow"
        >
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? 'Saved!' : 'Save Logo'}
        </button>
      </div>

      {/* Live Preview Box */}
      <div className="rounded-2xl bg-[#111114] border border-gold-500/30 p-6 space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
          <Eye className="h-4 w-4" /> Live Header Preview
        </span>

        <div className="p-6 rounded-xl bg-black border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {mode === 'IMAGE' && imageUrl ? (
              <img
                src={imageUrl}
                alt="Logo Preview"
                style={{ width: `${imageWidth}px`, height: 'auto', maxHeight: `${imageHeight * 1.5}px` }}
                className="object-contain"
              />
            ) : (
              <div className="flex items-center gap-2 group">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 via-gold-500 to-amber-700 p-[1.5px] shadow-lg">
                  <div className="h-full w-full bg-black rounded-[10px] flex items-center justify-center">
                    <span className="font-extrabold text-gold-400 text-xl tracking-tighter">
                      {textPrefix.slice(0, 1)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-xl tracking-wider text-white uppercase">
                    {textPrefix}
                    <span className={goldAccent ? 'text-gold-400' : 'text-zinc-400'}>
                      {textSuffix}
                    </span>
                  </span>
                  {tagline && (
                    <span className="text-[9px] tracking-[0.25em] text-zinc-400 uppercase -mt-1">
                      {tagline}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <span className="text-xs text-zinc-500 font-mono">Storefront Header Preview</span>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
          Logo Display Format
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMode('TEXT')}
            className={`p-4 rounded-xl border text-left flex items-center gap-3 transition ${
              mode === 'TEXT'
                ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                : 'border-zinc-800 bg-zinc-900/60 text-zinc-400'
            }`}
          >
            <Type className="h-5 w-5" />
            <div>
              <span className="font-bold text-xs text-white block">Stylized Text Logo</span>
              <span className="text-[10px] text-zinc-500">Gold metallic gradient typography emblem</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMode('IMAGE')}
            className={`p-4 rounded-xl border text-left flex items-center gap-3 transition ${
              mode === 'IMAGE'
                ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                : 'border-zinc-800 bg-zinc-900/60 text-zinc-400'
            }`}
          >
            <ImageIcon className="h-5 w-5" />
            <div>
              <span className="font-bold text-xs text-white block">Custom Image / Vector Logo</span>
              <span className="text-[10px] text-zinc-500">PNG, SVG, or WebP logo file</span>
            </div>
          </button>
        </div>
      </div>

      {/* Mode: Image Upload & Dimensions */}
      {mode === 'IMAGE' && (
        <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
            Upload Logo Graphic
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Upload to Cloudflare R2
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'logo')}
                disabled={uploadingLogo}
                className="w-full text-xs text-zinc-400 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:text-gold-400"
              />
              {uploadingLogo && <span className="text-[11px] text-gold-400 mt-1 block">Uploading to R2...</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Direct Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://media.killasnus.com/logo.png"
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Max Width (px)</label>
              <input
                type="number"
                value={imageWidth}
                onChange={(e) => setImageWidth(Number(e.target.value))}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Max Height (px)</label>
              <input
                type="number"
                value={imageHeight}
                onChange={(e) => setImageHeight(Number(e.target.value))}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mode: Typography Customizer */}
      {mode === 'TEXT' && (
        <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
            Customise Typography Emblem
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Primary Brand Word</label>
              <input
                type="text"
                value={textPrefix}
                onChange={(e) => setTextPrefix(e.target.value.toUpperCase())}
                placeholder="KILLA"
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Accent Suffix</label>
              <input
                type="text"
                value={textSuffix}
                onChange={(e) => setTextSuffix(e.target.value.toUpperCase())}
                placeholder="SNUS"
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-gold-400 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Sub-Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value.toUpperCase())}
              placeholder="LUXURY POUCHES"
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white uppercase tracking-widest"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={goldAccent}
              onChange={(e) => setGoldAccent(e.target.checked)}
              className="rounded border-zinc-700 bg-zinc-900 text-gold-500"
            />
            <span>Highlight accent suffix in luxury metallic gold</span>
          </label>
        </div>
      )}

      {/* Favicon Settings */}
      <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
          Browser Favicon & App Icon
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Upload Favicon (.ico, .png, .svg)
            </label>
            <input
              type="file"
              accept=".ico,.png,.svg"
              onChange={(e) => handleFileUpload(e, 'favicon')}
              disabled={uploadingFavicon}
              className="w-full text-xs text-zinc-400 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:text-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Favicon URL</label>
            <input
              type="url"
              value={faviconUrl}
              onChange={(e) => setFaviconUrl(e.target.value)}
              placeholder="https://media.killasnus.com/favicon.ico"
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

