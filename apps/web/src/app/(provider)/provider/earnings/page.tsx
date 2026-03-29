'use client';

import { useEffect, useState } from 'react';
import { Wallet, TrendingUp, Percent } from 'lucide-react';
import { formatPaise } from '@/lib/mock-data';

interface EarningsData {
  period: string;
  gross: number;
  net: number;
  commission: number;
  sessionCount: number;
  totalMinutes: number;
  sessions: Array<{
    id: string;
    type: string;
    durationSeconds: number;
    gross: number;
    commission: number;
    net: number;
    createdAt: string;
  }>;
}

export default function ProviderEarningsPage() {
  const [period, setPeriod] = useState('month');
  const [data, setData] = useState<EarningsData | null>(null);
  const [allTime, setAllTime] = useState<EarningsData | null>(null);

  useEffect(() => {
    fetch(`/api/provider/earnings?period=${period}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setData(d.data); });
  }, [period]);

  useEffect(() => {
    fetch('/api/provider/earnings?period=all')
      .then((r) => r.json())
      .then((d) => { if (d.success) setAllTime(d.data); });
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Earnings</h1>

      {/* Lifetime earnings hero */}
      <div className="mt-6 rounded-2xl bg-gradient-to-br from-secondary to-secondary-dark p-6 text-white shadow-lg shadow-secondary/25 md:p-8">
        <div className="flex items-center gap-2 text-white/70">
          <Wallet className="h-5 w-5" />
          <span className="text-sm font-medium">Lifetime Net Earnings</span>
        </div>
        <div className="mt-2 text-3xl font-extrabold sm:text-4xl">{formatPaise(allTime?.net ?? 0)}</div>
        <p className="mt-1 text-sm text-white/70">
          {allTime?.sessionCount ?? 0} sessions · {((allTime?.totalMinutes ?? 0) / 60).toFixed(0)} hours
        </p>
      </div>

      {/* Period tabs */}
      <div className="mt-6 flex gap-2">
        {[
          { key: 'week', label: 'This Week' },
          { key: 'month', label: 'This Month' },
          { key: 'all', label: 'All Time' },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setPeriod(tab.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              period === tab.key ? 'bg-secondary text-white' : 'bg-white border border-gray-200 text-text-light hover:bg-gray-50'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Summary */}
      {data && (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-100 bg-white p-4 text-center">
              <TrendingUp className="mx-auto h-5 w-5 text-secondary" />
              <p className="mt-2 text-xl font-bold">{formatPaise(data.gross)}</p>
              <p className="text-xs text-text-light">Gross</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 text-center">
              <Percent className="mx-auto h-5 w-5 text-error" />
              <p className="mt-2 text-xl font-bold">{formatPaise(data.commission)}</p>
              <p className="text-xs text-text-light">Platform (30%)</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 text-center">
              <Wallet className="mx-auto h-5 w-5 text-secondary" />
              <p className="mt-2 text-xl font-bold">{formatPaise(data.net)}</p>
              <p className="text-xs text-text-light">Your Share (70%)</p>
            </div>
          </div>

          {/* Per-session */}
          {data.sessions.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-3 font-semibold">Session Breakdown</h2>
              <div className="space-y-2">
                {data.sessions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium">
                        {s.type === 'CHAT' ? 'Chat' : 'Audio'} · {Math.floor(s.durationSeconds / 60)} min
                      </p>
                      <p className="text-xs text-text-light">
                        {new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-secondary">{formatPaise(s.net)}</p>
                      <p className="text-xs text-text-light">of {formatPaise(s.gross)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payout info */}
          <div className="mt-6 rounded-xl bg-secondary/5 border border-secondary/20 p-4 text-sm">
            <p className="font-semibold text-secondary">Payouts</p>
            <p className="mt-1 text-text-light">
              Earnings are paid out weekly every Monday via RazorpayX directly to your bank account.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
