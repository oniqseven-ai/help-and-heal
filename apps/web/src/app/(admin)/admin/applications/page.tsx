'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Filter } from 'lucide-react';
import { formatPaise } from '@/lib/mock-data';

interface Application {
  id: string;
  fullName: string;
  displayName: string;
  phone: string;
  tier: string;
  status: string;
  yearsExperience: number;
  requestedRate: number;
  createdAt: string;
  completedChecks: number;
  totalChecks: number;
}

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: 'bg-accent/10 text-accent',
  UNDER_REVIEW: 'bg-primary/10 text-primary',
  APPROVED: 'bg-secondary/10 text-secondary',
  REJECTED: 'bg-error/10 text-error',
  RESUBMISSION_REQUESTED: 'bg-purple-100 text-purple-700',
};

const TIER_LABEL: Record<string, string> = {
  LISTENER: 'Listener',
  COUNSELOR: 'Counselor',
  PSYCHOLOGIST: 'Psychologist',
  PSYCHIATRIST: 'Psychiatrist',
};

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (tierFilter) params.set('tier', tierFilter);
    if (search) params.set('search', search);

    fetch(`/api/admin/applications?${params}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setApps(d.data); })
      .finally(() => setLoading(false));
  }, [statusFilter, tierFilter, search]);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold">Applications</h1>
      <p className="mt-1 text-text-light">{apps.length} total applications</p>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary">
          <option value="">All statuses</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary">
          <option value="">All tiers</option>
          <option value="LISTENER">Listener</option>
          <option value="COUNSELOR">Counselor</option>
          <option value="PSYCHOLOGIST">Psychologist</option>
          <option value="PSYCHIATRIST">Psychiatrist</option>
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="mt-8 text-center text-text-light">Loading...</div>
      ) : apps.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-12 text-center text-text-light">
          No applications found
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {apps.map((app) => (
            <Link
              key={app.id}
              href={`/admin/applications/${app.id}`}
              className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {app.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{app.fullName}</p>
                <p className="text-xs text-text-light">
                  {TIER_LABEL[app.tier]} · {app.yearsExperience}y exp · {formatPaise(app.requestedRate)}/min
                </p>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-xs text-text-light">
                  Checklist: {app.completedChecks}/{app.totalChecks}
                </p>
                <div className="mt-1 h-1.5 w-20 rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${app.totalChecks ? (app.completedChecks / app.totalChecks) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[app.status] || ''}`}>
                {app.status.replace(/_/g, ' ')}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
