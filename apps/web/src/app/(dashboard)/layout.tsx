'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Wallet,
  Clock,
  Heart,
  UserCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { MOCK_WALLET_BALANCE, formatPaise } from '@/lib/mock-data';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/providers', label: 'Providers', icon: Users },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
  { href: '/sessions', label: 'Sessions', icon: Clock },
  { href: '/self-help', label: 'Self-Help', icon: Heart },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

const BOTTOM_NAV = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/providers', label: 'Providers', icon: Users },
  { href: '/self-help', label: 'Self-Help', icon: Heart },
  { href: '/sessions', label: 'History', icon: Clock },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-gray-100 bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-5">
            <Link href="/dashboard" className="text-xl font-bold text-primary">
              Help<span className="text-secondary">&</span>Heal
            </Link>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-light hover:bg-gray-50 hover:text-text'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-gray-100 p-3">
            <Link
              href="/login"
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-text-light hover:bg-gray-50 hover:text-error"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <span className="text-xl font-bold text-primary">
                Help<span className="text-secondary">&</span>Heal
              </span>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-1 px-3 py-4">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-light hover:bg-gray-50 hover:text-text'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white/80 px-4 py-3 backdrop-blur-md lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-text-light hover:bg-gray-50 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden text-sm font-medium text-text-light lg:block">
            {NAV_ITEMS.find((i) => pathname === i.href || pathname.startsWith(i.href + '/'))?.label || 'Dashboard'}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/wallet"
              className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
            >
              <Wallet className="h-4 w-4" />
              {formatPaise(MOCK_WALLET_BALANCE)}
            </Link>
            <Link
              href="/profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white"
            >
              H
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 py-6 pb-24 lg:px-8 lg:pb-6">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white lg:hidden">
          <div className="flex items-center justify-around py-2">
            {BOTTOM_NAV.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs transition-colors ${
                    isActive ? 'text-primary' : 'text-text-light'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
