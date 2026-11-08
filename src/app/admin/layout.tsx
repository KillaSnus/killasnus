'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  Award,
  Users,
  ShoppingCart,
  FileText,
  BookOpen,
  Image as ImageIcon,
  Tag,
  Star,
  Menu as MenuIcon,
  Palette,
  CreditCard,
  Truck,
  Globe,
  ArrowUpDown,
  BarChart3,
  ExternalLink,
  ChevronRight,
  LogOut,
  Bell,
  Search,
} from 'lucide-react';
import { useAuth } from '@/lib/store/auth-context';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Layers },
  { label: 'Brands (18+)', href: '/admin/brands', icon: Award },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Pages & Builder', href: '/admin/pages', icon: FileText },
  { label: 'Blog Posts', href: '/admin/blog', icon: BookOpen },
  { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { label: 'Coupons', href: '/admin/coupons', icon: Tag },
  { label: 'Reviews', href: '/admin/reviews', icon: Star },
  { label: 'Menus', href: '/admin/menus', icon: MenuIcon },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Import / Export', href: '/admin/import-export', icon: ArrowUpDown },
];

const settingsItems = [
  { label: 'Theme Settings', href: '/admin/settings/theme', icon: Palette },
  { label: 'Payment Settings', href: '/admin/settings/payments', icon: CreditCard },
  { label: 'Shipping Settings', href: '/admin/settings/shipping', icon: Truck },
  { label: 'SEO Settings', href: '/admin/settings/seo', icon: Globe },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, profile, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-200 flex">
      {/* Sidebar Navigation */}
      <aside
        className={`${
          collapsed ? 'w-20' : 'w-64'
        } border-r border-zinc-800/80 bg-[#0c0c0f] flex flex-col justify-between transition-all duration-300 z-30 sticky top-0 h-screen`}
      >
        <div>
          {/* Admin Header / Logo */}
          <div className="h-16 px-5 border-b border-zinc-800 flex items-center justify-between">
            {!collapsed && (
              <Link href="/admin" className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-gold-500 flex items-center justify-center font-black text-black text-base shadow">
                  K
                </div>
                <div>
                  <span className="font-extrabold text-sm tracking-wider text-white uppercase block">
                    KILLASNUS
                  </span>
                  <span className="text-[10px] text-gold-400 font-bold uppercase tracking-widest block -mt-1">
                    CMS Control
                  </span>
                </div>
              </Link>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition"
              title="Toggle sidebar"
            >
              <MenuIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 px-3 mb-2 block">
                Store Modules
              </span>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href ||
                    (item.href !== '/admin' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        active
                          ? 'bg-gold-500/15 border border-gold-500/30 text-gold-400 shadow-sm'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 px-3 mb-2 block">
                Configuration
              </span>
              <nav className="space-y-1">
                {settingsItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        active
                          ? 'bg-gold-500/15 border border-gold-500/30 text-gold-400 shadow-sm'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Profile and Storefront shortcut */}
        <div className="p-3 border-t border-zinc-800/80 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-zinc-300 hover:text-gold-400 hover:bg-zinc-800/60 transition"
            title="Open Live Store"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-gold-400" />
              {!collapsed && <span>Live Storefront</span>}
            </span>
          </Link>

          {!collapsed && (
            <div className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800/60 flex items-center justify-between">
              <div className="truncate">
                <span className="text-xs font-bold text-white block truncate">
                  {profile?.name || user?.email || 'Super Admin'}
                </span>
                <span className="text-[10px] text-gold-400 font-semibold block">
                  {profile?.role || 'ADMIN'}
                </span>
              </div>
              <button
                onClick={() => logout()}
                className="text-zinc-500 hover:text-rose-400 transition"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-zinc-800/80 bg-[#09090b]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products, orders, customers..."
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2 pl-9 text-xs text-white placeholder-zinc-500 focus:border-gold-500 focus:outline-none"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Production Live</span>
            </div>

            <button
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

