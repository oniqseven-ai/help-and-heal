'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Phone, Wallet, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { formatPaise } from '@/lib/mock-data';

interface EarningsData {
  gross: number;
  net: number;
  sessionCount: number;
  totalMinutes: number;
}

export default function ProviderHomePage() {
  const [today, setToday] = useState<EarningsData | null>(null);
  const [week, setWeek] = useState<EarningsData | null>(null);
  const [month, setMonth] = useState<EarningsData | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/provider/earnings?period=today').then((r) => r.json()),
      fetch('/api/provider/earnings?period=week').then((r) => r.json()),
      fetch('/api/provider/earnings?period=month').then((r) => r.json()),
    ]).then(([t, w, m]) => {
      if (t.success) setToday(t.data);
      if (w.success) setWeek(w.data);
      if (m.success) setMonth(m.data);
    });
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Provider Dashboard</h1>
        <p className="mt-1 text-text-light">Your performance at a glance</p>
      </div>

      {/* Today's stats */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-light">Today</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
              <Phone className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-text-light">Sessions</p>
              <p className="text-2xl font-bold">{today?.sessionCount ?? 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <Wallet className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-text-light">Earnings</p>
              <p className="text-2xl font-bold">{formatPaise(today?.net ?? 0)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-text-light">Hours</p>
              <p className="text-2xl font-bold">{((today?.totalMinutes ?? 0) / 60).toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Week & Month */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">This Week</h2>
            <TrendingUp className="h-5 w-5 text-secondary" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold">{week?.sessionCount ?? 0}</p>
              <p className="text-xs text-text-light">Sessions</p>
            </div>
            <div>
              <p className="text-xl font-bold">{formatPaise(week?.net ?? 0)}</p>
              <p className="text-xs text-text-light">Earned</p>
            </div>
            <div>
              <p className="text-xl font-bold">{((week?.totalMinutes ?? 0) / 60).toFixed(1)}h</p>
              <p className="text-xs text-text-light">Hours</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">This Month</h2>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold">{month?.sessionCount ?? 0}</p>
              <p className="text-xs text-text-light">Sessions</p>
            </div>
            <div>
              <p className="text-xl font-bold">{formatPaise(month?.net ?? 0)}</p>
              <p className="text-xs text-text-light">Earned</p>
            </div>
            <div>
              <p className="text-xl font-bold">{((month?.totalMinutes ?? 0) / 60).toFixed(1)}h</p>
              <p className="text-xs text-text-light">Hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/provider/earnings" className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 hover:shadow-md transition-shadow">
          <span className="font-medium">View Earnings</span>
          <ArrowRight className="h-4 w-4 text-text-light" />
        </Link>
        <Link href="/provider/stats" className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 hover:shadow-md transition-shadow">
          <span className="font-medium">View Stats</span>
          <ArrowRight className="h-4 w-4 text-text-light" />
        </Link>
        <Link href="/provider/profile" className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 hover:shadow-md transition-shadow">
          <span className="font-medium">Edit Profile</span>
          <ArrowRight className="h-4 w-4 text-text-light" />
        </Link>
      </div>
    </div>
  );
}
