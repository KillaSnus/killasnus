import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = '£'): string {
  return `${currency}${Number(price || 0).toFixed(2)}`;
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export function getStrengthBadgeColor(strength?: string | null): {
  bg: string;
  text: string;
  border: string;
} {
  switch (strength?.toLowerCase()) {
    case 'light':
      return { bg: 'bg-emerald-950/60', text: 'text-emerald-400', border: 'border-emerald-800/40' };
    case 'medium':
      return { bg: 'bg-blue-950/60', text: 'text-blue-400', border: 'border-blue-800/40' };
    case 'strong':
      return { bg: 'bg-amber-950/60', text: 'text-amber-400', border: 'border-amber-800/40' };
    case 'x-strong':
    case 'extra strong':
      return { bg: 'bg-orange-950/60', text: 'text-orange-400', border: 'border-orange-800/40' };
    case 'ultra':
    case 'ultra strong':
      return { bg: 'bg-rose-950/60', text: 'text-rose-400', border: 'border-rose-800/40' };
    default:
      return { bg: 'bg-zinc-900', text: 'text-zinc-300', border: 'border-zinc-800' };
  }
}

export function getOrderStatusBadge(status: string): {
  label: string;
  className: string;
} {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return { label: 'Pending', className: 'bg-amber-900/30 text-amber-400 border-amber-800/50' };
    case 'PAID':
      return { label: 'Paid', className: 'bg-cyan-900/30 text-cyan-400 border-cyan-800/50' };
    case 'PROCESSING':
      return { label: 'Processing', className: 'bg-blue-900/30 text-blue-400 border-blue-800/50' };
    case 'SHIPPED':
      return { label: 'Shipped', className: 'bg-purple-900/30 text-purple-400 border-purple-800/50' };
    case 'COMPLETED':
      return { label: 'Completed', className: 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50' };
    case 'REFUNDED':
      return { label: 'Refunded', className: 'bg-zinc-800 text-zinc-400 border-zinc-700' };
    case 'CANCELLED':
      return { label: 'Cancelled', className: 'bg-rose-900/30 text-rose-400 border-rose-800/50' };
    default:
      return { label: status, className: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
  }
}

