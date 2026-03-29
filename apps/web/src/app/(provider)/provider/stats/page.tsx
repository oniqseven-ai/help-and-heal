'use client';

import { useEffect, useState } from 'react';
import { Star, Users, Clock, TrendingUp, CheckCircle, Repeat } from 'lucide-react';

interface StatsData {
  ratingAvg: number;
  ratingDistribution: Record<number, number>;
  totalSessions: number;
  totalMinutes: number;
  avgSessionDuration: number;
  repeatUserPct: number;
  completionRate: number;
  uniqueUsers: number;
  recentFeedback: Array<{
    score: number;
    feedback: string;
    createdAt: string;
  }>;
}

export default function ProviderStatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    fetch('/api/provider/stats')
      .then((r) => r.json())
      .then((d) => { if (d.success) setStats(d.data); });
  }, []);

  if (!stats) return <div className="text-text-light">Loading...</div>;

  const totalRatings = Object.values(stats.ratingDistribution).reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Performance Stats</h1>

      {/* Rating overview */}
      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="text-center">
            <div className="text-3xl font-extrabold sm:text-4xl">{stats.ratingAvg}</div>
            <div className="mt-1 flex items-center justify-center gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} className={`h-4 w-4 ${n <= Math.round(stats.ratingAvg) ? 'fill-accent text-accent' : 'text-gray-200'}`} />
              ))}
            </div>
            <p className="mt-1 text-xs text-text-light">{totalRatings} reviews</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((n) => {
              const count = stats.ratingDistribution[n] || 0;
              const pct = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
              return (
                <div key={n} className="flex items-center gap-2 text-xs">
                  <span className="w-3 text-right">{n}</span>
                  <Star className="h-3 w-3 text-accent" />
                  <div className="h-2 flex-1 rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 text-right text-text-light">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4">
          <Clock className="h-8 w-8 text-primary" />
          <div>
            <p className="text-xl font-bold">{stats.totalSessions}</p>
            <p className="text-xs text-text-light">Total Sessions</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4">
          <TrendingUp className="h-8 w-8 text-secondary" />
          <div>
            <p className="text-xl font-bold">{Math.round(stats.totalMinutes / 60)}h</p>
            <p className="text-xs text-text-light">Total Hours</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4">
          <Repeat className="h-8 w-8 text-accent" />
          <div>
            <p className="text-xl font-bold">{stats.repeatUserPct}%</p>
            <p className="text-xs text-text-light">Repeat Users</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4">
          <Clock className="h-8 w-8 text-text-light" />
          <div>
            <p className="text-xl font-bold">{Math.floor(stats.avgSessionDuration / 60)}m</p>
            <p className="text-xs text-text-light">Avg Duration</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4">
          <CheckCircle className="h-8 w-8 text-secondary" />
          <div>
            <p className="text-xl font-bold">{stats.completionRate}%</p>
            <p className="text-xs text-text-light">Completion Rate</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <p className="text-xl font-bold">{stats.uniqueUsers}</p>
            <p className="text-xs text-text-light">Unique Users</p>
          </div>
        </div>
      </div>

      {/* Recent feedback */}
      {stats.recentFeedback.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 font-semibold">Recent Reviews</h2>
          <div className="space-y-2">
            {stats.recentFeedback.map((f, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-white p-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} className={`h-3.5 w-3.5 ${n <= f.score ? 'fill-accent text-accent' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-text-light">
                    {new Date(f.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <p className="mt-2 text-sm text-text-light">{f.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
