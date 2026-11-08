'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Check } from 'lucide-react';

export function AgeGateModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem('kns_age_verified');
    if (!verified) {
      setIsOpen(true);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('kns_age_verified', 'true');
    setIsOpen(false);
  };

  const handleReject = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-2xl bg-[#111114] border border-gold-500/30 p-8 shadow-2xl text-center gold-glow">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-400 bg-gold-500/10 border border-gold-500/20 rounded-full mb-3">
          Age Verification Required
        </span>

        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
          Are you 18 or older?
        </h2>

        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          The nicotine pouches sold on this website contain nicotine, an addictive substance.
          You must be of legal age (18+ in the UK/EU) to browse and purchase nicotine products.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-400 via-gold-500 to-amber-600 px-6 py-3 text-sm font-bold text-black shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Check className="h-4 w-4" />
            I am 18 or older
          </button>
          <button
            onClick={handleReject}
            className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-3 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            I am under 18
          </button>
        </div>

        <p className="mt-5 text-[11px] text-zinc-500">
          By clicking enter, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

