'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Phone, Wallet, Clock, TrendingUp, ArrowRight, MessageCircle, AlertCircle } from 'lucide-react';
import { formatPaise } from '@/lib/mock-data';

interface EarningsData {
  gross: number;
  net: number;
  sessionCount: number;
  totalMinutes: number;
}

interface ActiveSession {
  id: string;
  status: string;
  type: string;
  createdAt: string;
}

export default function ProviderHomePage() {
  const [today, setToday] = useState<EarningsData | null>(null);
  const [week, setWeek] = useState<EarningsData | null>(null);
  const [month, setMonth] = useState<EarningsData | null>(null);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/provider/earnings?period=today').then((r) => r.json()),
      fetch('/api/provider/earnings?period=week').then((r) => r.json()),
      fetch('/api/provider/earnings?period=month').then((r) => r.json()),
      fetch('/api/provider/active-session').then((r) => r.json()),
    ]).then(([t, w, m, a]) => {
      if (t.success) setToday(t.data);
      if (w.success) setWeek(w.data);
      if (m.success) setMonth(m.data);
      if (a.success && a.data) setActiveSession(a.data);
    });
  }, []);

  // Poll for incoming sessions every 5s
  useEffect(() => {
    const poll = setInterval(async () => {
      const res = await fetch('/api/provider/active-session');
      const data = await res.json();
      if (data.success) setActiveSession(data.data);
    }, 5000);
    return () => clearInterval(poll);
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Provider Dashboard</h1>
        <p className="mt-1 text-text-light">Your performance at a glance</p>
      </div>

      {/* Active/Incoming session */}
      {activeSession && (
        <Link
          href={`/provider/session/${activeSession.id}`}
          className="flex items-center gap-4 rounded-2xl border-2 border-secondary bg-secondary/5 p-5 animate-pulse"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20">
            {activeSession.status === 'WAITING' ? (
              <AlertCircle className="h-6 w-6 text-secondary" />
            ) : (
              <MessageCircle className="h-6 w-6 text-secondary" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-bold text-secondary">
              {activeSession.status === 'WAITING' ? 'Incoming Session Request!' : 'Active Session'}
            </p>
            <p className="text-sm text-text-light">
              {activeSession.status === 'WAITING' ? 'A user wants to chat with you. Tap to accept.' : 'You have an active chat session. Tap to continue.'}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-secondary" />
        </Link>
      )}

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
