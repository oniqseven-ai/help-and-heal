'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  ArrowLeft,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/applications', label: 'Applications', icon: ClipboardList },
  { href: '/admin/providers', label: 'Providers', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = (session?.user as { role?: string })?.role;

  useEffect(() => {
    if (status === 'authenticated' && role !== 'ADMIN') {
      router.replace('/dashboard');
    }
  }, [status, role, router]);

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center text-text-light">Loading...</div>;
  }

  if (role !== 'ADMIN') {
    return <div className="flex min-h-screen items-center justify-center text-text-light">Access denied</div>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-gray-100 bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-gray-100 px-6 py-5">
            <Link href="/admin" className="text-xl font-bold text-primary">
              Help<span className="text-secondary">&</span>Heal
            </Link>
            <div className="mt-1 inline-block rounded-full bg-error/10 px-2 py-0.5 text-xs font-semibold text-error">
              Admin
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
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
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-text-light hover:bg-gray-50"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to App
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-4 border-b border-gray-100 bg-white px-4 py-3 lg:hidden">
          <Link href="/admin" className="text-lg font-bold text-primary">
            H<span className="text-secondary">&</span>H
          </Link>
          <span className="rounded-full bg-error/10 px-2 py-0.5 text-xs font-semibold text-error">Admin</span>
          <nav className="ml-auto flex gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}
                  className={`rounded-lg p-2 ${isActive ? 'bg-primary/10 text-primary' : 'text-text-light'}`}>
                  <item.icon className="h-5 w-5" />
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
