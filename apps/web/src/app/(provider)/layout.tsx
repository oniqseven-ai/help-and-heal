'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Clock,
  Wallet,
  BarChart3,
  UserCircle,
  LogOut,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';
import ProviderOnboardingStatus from '@/components/provider-onboarding-status';

const NAV_ITEMS = [
  { href: '/provider', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/provider/sessions', label: 'Sessions', icon: Clock },
  { href: '/provider/earnings', label: 'Earnings', icon: Wallet },
  { href: '/provider/stats', label: 'Stats', icon: BarChart3 },
  { href: '/provider/profile', label: 'Profile', icon: UserCircle },
];

const BOTTOM_NAV = [
  { href: '/provider', label: 'Home', icon: LayoutDashboard },
  { href: '/provider/sessions', label: 'Sessions', icon: Clock },
  { href: '/provider/earnings', label: 'Earnings', icon: Wallet },
  { href: '/provider/stats', label: 'Stats', icon: BarChart3 },
  { href: '/provider/profile', label: 'Profile', icon: UserCircle },
];

interface ProviderStatus {
  applicationStatus: string | null;
  rejectionReason: string | null;
  hasProviderRecord: boolean;
  provider: { displayName: string; isOnline: boolean } | null;
}

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  const role = (session?.user as { role?: string })?.role;

  useEffect(() => {
    if (authStatus === 'authenticated' && role !== 'PROVIDER' && role !== 'ADMIN') {
      router.replace('/dashboard');
    }
  }, [authStatus, role, router]);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      fetch('/api/provider/status')
        .then((r) => r.json())
        .then((d) => {
          if (d.success) {
            setProviderStatus(d.data);
            setIsOnline(d.data.provider?.isOnline || false);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [authStatus]);

  const handleToggleOnline = async () => {
    const res = await fetch('/api/provider/toggle-online', { method: 'POST' });
    const data = await res.json();
    if (data.success) setIsOnline(data.data.isOnline);
  };

  if (authStatus === 'loading' || loading) {
    return <div className="flex min-h-screen items-center justify-center text-text-light">Loading...</div>;
  }

  if (role !== 'PROVIDER' && role !== 'ADMIN') {
    return <div className="flex min-h-screen items-center justify-center text-text-light">Access denied</div>;
  }

  // Show onboarding status if not approved
  if (providerStatus && !providerStatus.hasProviderRecord) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <Link href="/" className="text-3xl font-bold text-primary">
              Help<span className="text-secondary">&</span>Heal
            </Link>
            <div className="mt-1 inline-block rounded-full bg-secondary/10 px-3 py-0.5 text-xs font-semibold text-secondary">
              Provider
            </div>
          </div>
          <ProviderOnboardingStatus
            status={providerStatus.applicationStatus}
            rejectionReason={providerStatus.rejectionReason}
          />
        </div>
      </div>
    );
  }

  const displayName = providerStatus?.provider?.displayName || session?.user?.name || 'Provider';

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-gray-100 bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-gray-100 px-6 py-5">
            <Link href="/provider" className="text-xl font-bold text-primary">
              Help<span className="text-secondary">&</span>Heal
            </Link>
            <div className="mt-1 inline-block rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-semibold text-secondary">
              Provider
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/provider' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-secondary/10 text-secondary' : 'text-text-light hover:bg-gray-50 hover:text-text'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-gray-100 p-3 space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-text-light hover:bg-gray-50">
              <ArrowLeft className="h-5 w-5" /> User Dashboard
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-text-light hover:bg-gray-50 hover:text-error"
            >
              <LogOut className="h-5 w-5" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-[85vw] max-w-72 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <span className="text-xl font-bold text-primary">H<span className="text-secondary">&</span>H</span>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400"><X className="h-5 w-5" /></button>
            </div>
            <nav className="space-y-1 px-3 py-4">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/provider' && pathname.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium ${isActive ? 'bg-secondary/10 text-secondary' : 'text-text-light'}`}>
                    <item.icon className="h-5 w-5" /> {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white/80 px-4 py-3 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-text-light hover:bg-gray-50 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium text-text-light">{displayName}</span>
          </div>
          <button
            onClick={handleToggleOnline}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              isOnline ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-text-light'
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-secondary' : 'bg-gray-400'}`} />
            {isOnline ? 'Online' : 'Offline'}
          </button>
        </header>

        <main className="flex-1 px-4 py-6 pb-24 lg:px-8 lg:pb-6">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white lg:hidden">
          <div className="flex items-center justify-around py-2">
            {BOTTOM_NAV.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/provider' && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs ${isActive ? 'text-secondary' : 'text-text-light'}`}>
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
