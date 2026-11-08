'use client';

import React, { useState, useEffect } from 'react';
import { Palette, Save, Check, ShieldAlert, Mail, Lock, Globe, Plus, Trash2 } from 'lucide-react';

export default function AdminFooterSettingsPage() {
  const [aboutText, setAboutText] = useState(
    'The premier destination for authentic Scandinavian nicotine pouches. Tobacco-free, smoke-free, and spit-free. Direct delivery from certified European manufacturers.'
  );
  const [copyrightText, setCopyrightText] = useState(
    `© ${new Date().getFullYear()} KILLASNUS. All rights reserved. Original Design.`
  );
  const [disclaimerText, setDisclaimerText] = useState(
    'This product contains nicotine. Nicotine is an addictive chemical. Not suitable for individuals under 18 years of age, pregnant or breastfeeding women, or people with cardiovascular disease. Keep out of reach of children and pets.'
  );
  const [supportEmail, setSupportEmail] = useState('support@killasnus.com');
  const [newsletterTitle, setNewsletterTitle] = useState('Unlock 10% Off Your First Order');
  const [newsletterSubtitle, setNewsletterSubtitle] = useState(
    'Get early access to limited batch drops, exclusive subscriber flash sales, and new flavour releases.'
  );

  const [instagram, setInstagram] = useState('https://instagram.com');
  const [twitter, setTwitter] = useState('https://x.com');
  const [telegram, setTelegram] = useState('https://t.me');
  const [whatsapp, setWhatsapp] = useState('https://whatsapp.com');

  const [paymentBadges, setPaymentBadges] = useState([
    'VISA',
    'Mastercard',
    'Apple Pay',
    'PayPal',
    'Crypto',
  ]);
  const [newBadge, setNewBadge] = useState('');

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings/footer')
      .then((r) => r.json())
      .then((data) => {
        if (data.footer) {
          const f = data.footer;
          if (f.aboutText) setAboutText(f.aboutText);
          if (f.copyrightText) setCopyrightText(f.copyrightText);
          if (f.disclaimerText) setDisclaimerText(f.disclaimerText);
          if (f.supportEmail) setSupportEmail(f.supportEmail);
          if (f.newsletterTitle) setNewsletterTitle(f.newsletterTitle);
          if (f.newsletterSubtitle) setNewsletterSubtitle(f.newsletterSubtitle);
          if (f.socialLinks) {
            setInstagram(f.socialLinks.instagram || '');
            setTwitter(f.socialLinks.twitter || '');
            setTelegram(f.socialLinks.telegram || '');
            setWhatsapp(f.socialLinks.whatsapp || '');
          }
          if (f.paymentBadges) setPaymentBadges(f.paymentBadges);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleAddBadge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBadge.trim()) return;
    setPaymentBadges([...paymentBadges, newBadge.trim()]);
    setNewBadge('');
  };

  const handleRemoveBadge = (idx: number) => {
    setPaymentBadges(paymentBadges.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aboutText,
          copyrightText,
          disclaimerText,
          supportEmail,
          newsletterTitle,
          newsletterSubtitle,
          socialLinks: {
            instagram,
            twitter,
            telegram,
            whatsapp,
          },
          paymentBadges,
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
            Footer Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-0.5">
            Footer Content & Disclaimers
          </h1>
          <p className="text-xs text-zinc-400">
            Edit statutory warnings, company bio, newsletter incentive, and social channels.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-extrabold uppercase tracking-wider transition shadow"
        >
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? 'Saved!' : 'Save Footer'}
        </button>
      </div>

      {/* Newsletter Section Settings */}
      <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
          <Mail className="h-4 w-4 text-gold-400" /> Newsletter Banner
        </h2>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">Headline Title</label>
          <input
            type="text"
            value={newsletterTitle}
            onChange={(e) => setNewsletterTitle(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">Subtitle / Offer</label>
          <input
            type="text"
            value={newsletterSubtitle}
            onChange={(e) => setNewsletterSubtitle(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
          />
        </div>
      </div>

      {/* Brand & Support Bio */}
      <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
          Brand Story & Contact
        </h2>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">About Company Text</label>
          <textarea
            rows={3}
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Support Email</label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Copyright Line</label>
            <input
              type="text"
              value={copyrightText}
              onChange={(e) => setCopyrightText(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* Nicotine Health Warning Notice */}
      <div className="rounded-2xl bg-[#111114] border border-rose-900/40 p-6 space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-rose-400 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4" /> Statutory Nicotine Warning Notice
        </h2>
        <p className="text-xs text-zinc-400">
          This warning is mandated under UK and European nicotine consumer protection standards.
        </p>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">Disclaimer Text</label>
          <textarea
            rows={3}
            value={disclaimerText}
            onChange={(e) => setDisclaimerText(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-zinc-300"
          />
        </div>
      </div>

      {/* Social Media Links */}
      <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
          Social Media Channels
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Instagram URL</label>
            <input
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">X (Twitter) URL</label>
            <input
              type="url"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Telegram Community</label>
            <input
              type="url"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">WhatsApp Support</label>
            <input
              type="url"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white font-mono"
            />
          </div>
        </div>
      </div>

      {/* Accepted Payment Badges */}
      <div className="rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
          Accepted Payment Badges
        </h2>

        <div className="flex flex-wrap gap-2">
          {paymentBadges.map((badge, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200"
            >
              {badge}
              <button
                type="button"
                onClick={() => handleRemoveBadge(idx)}
                className="text-zinc-500 hover:text-rose-400"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <form onSubmit={handleAddBadge} className="flex gap-2 max-w-sm pt-2">
          <input
            type="text"
            placeholder="Add badge (e.g. Klarna)"
            value={newBadge}
            onChange={(e) => setNewBadge(e.target.value)}
            className="flex-1 rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs text-white"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold uppercase"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

