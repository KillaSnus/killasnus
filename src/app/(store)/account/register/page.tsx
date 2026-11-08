'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store/auth-context';
import { User, Mail, Lock, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { signupWithEmail, loginWithGoogle } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ageConfirm, setAgeConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ageConfirm) {
      setError('You must confirm that you are 18 years or older to register.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signupWithEmail(email, password, name);
      router.push('/account/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#09090b] min-h-screen py-16 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="rounded-3xl bg-[#111114] border border-zinc-800 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-xs font-extrabold uppercase tracking-widest text-gold-400">
              New Member
            </span>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight mt-1">
              Create an Account
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Join KILLASNUS for fast checkout and exclusive VIP perks.
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-400 text-xs">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 pl-10 text-xs text-white focus:border-gold-500 focus:outline-none"
                />
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 pl-10 text-xs text-white focus:border-gold-500 focus:outline-none"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Password (min 6 characters)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 pl-10 text-xs text-white focus:border-gold-500 focus:outline-none"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="ageConfirm"
                required
                checked={ageConfirm}
                onChange={(e) => setAgeConfirm(e.target.checked)}
                className="mt-0.5 rounded border-zinc-700 bg-zinc-900 text-gold-500 focus:ring-gold-500"
              />
              <label htmlFor="ageConfirm" className="text-[11px] text-zinc-400 leading-tight">
                I verify that I am at least 18 years of age and agree to the{' '}
                <Link href="/pages/terms-of-service" className="text-gold-400 underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/pages/privacy-policy" className="text-gold-400 underline">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gold-500 hover:bg-gold-400 py-3.5 text-xs font-extrabold text-black uppercase tracking-wider transition active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'} <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-zinc-400">
            Already have an account?{' '}
            <Link href="/account/login" className="text-gold-400 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

